const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Asignar la clave secreta desde las variables de entorno
const secret = process.env.SECRET;

if (!secret) {
  throw new Error('La clave secreta (SECRET) no está definida en las variables de entorno.');
}

// Función para restablecer la contraseña (envía correo)
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = (email || '').toLowerCase();

  try {
    // Calcular el hash del email
    const emailHash = crypto.createHash('sha256').update(normalizedEmail).digest('hex');

    // Buscar usando emailHash en lugar de email
    const user = await User.findOne({ emailHash });
    if (!user) {
      return res.status(404).json({
        success: false,
        code: 'USER_NOT_FOUND',
        message: 'No se encontró una cuenta asociada a este correo. Por favor, verifica e intenta nuevamente.',
      });
    }

    const firstName = user.name.split(' ')[0];

    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      secret,
      { expiresIn: '1h' }
    );

    // Guardar token y expiración
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    user.canResetPassword = false; // Debe confirmarse manualmente con POST
    await user.save();

    const baseUrl = process.env.BASE_URL;
    const apiUrl = process.env.API_URL;

    // Link apunta a verify-reset-token (GET)
    const resetLink = `${baseUrl}${apiUrl}/password/verify-reset-token?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:app_logo" alt="App Acompañamiento UV" style="width: 70px; height: auto;">
        </div>
        <h2 style="color: #1d72b8; text-align: center;">Restablece tu Contraseña</h2>
        <p>Hola <strong>${firstName}</strong>,</p>
        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en la <strong>App Acompañamiento UV</strong>.</p>
        <p>Si realizaste esta solicitud, haz clic en el siguiente botón para continuar:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" style="background-color: #1d72b8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Restablecer Contraseña</a>
        </div>
        <p>Este enlace es válido por 1 hora.</p>
        <p>Si no solicitaste este restablecimiento, por favor ignora este correo. Tu contraseña seguirá siendo segura.</p>
        <p>Saludos cordiales,</p>
        <p style="font-style: italic; color: #333;">Equipo de App Acompañamiento UV</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; text-align: center; color: #777;">
          Este correo se ha enviado automáticamente. Por favor, no respondas a este mensaje.
        </p>
      </div>
    `;

    await transporter.sendMail({
      to: normalizedEmail,
      subject: 'Restablece tu contraseña - App Acompañamiento UV',
      html: htmlContent,
      attachments: [
        {
          filename: 'Icon_Application_Blue.png',
          path: 'public/Icon_Application_Blue.png',
          cid: 'app_logo',
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: 'Se ha enviado un correo para restablecer la contraseña. Por favor, revisa tu bandeja de entrada.',
    });
  } catch (error) {
    console.error('Error al enviar el correo de restablecimiento:', error);
    return res.status(500).json({
      success: false,
      message: 'Hubo un error interno. Por favor, intenta nuevamente más tarde.',
    });
  }
};

// Cambio real de contraseña (desde la app)
const changePassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'El token de restablecimiento es requerido.',
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const userId = decoded.userId;

    const user = await User.findOne({
      _id: userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'El token es inválido o ha expirado. Por favor, solicita uno nuevo.',
      });
    }

    // ✅ Ahora esto sí tiene sentido, porque SOLO se activa por POST manual
    if (!user.canResetPassword) {
      return res.status(400).json({
        success: false,
        message: 'Debes confirmar el enlace enviado a tu correo antes de cambiar la contraseña.',
      });
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Debes ingresar y confirmar la nueva contraseña.',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Las contraseñas no coinciden.',
      });
    }

    const passwordRegex = /^(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>,.?\/\\|~`])[A-Za-z\d!@#$%^&*()_+\-={}\[\]:;"'<>,.?\/\\|~`áéíóúÁÉÍÓÚñÑ]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 8 caracteres e incluir al menos un carácter especial (@, $, !, %, #, ?, &, etc).',
      });
    }

    user.passwordHash = bcrypt.hashSync(newPassword, 8);

    // Invalidar token y estado
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.canResetPassword = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Contraseña actualizada con éxito. Ahora puedes iniciar sesión.',
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        success: false,
        message: 'El token es inválido. Por favor, solicita uno nuevo.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        message: 'El token ha expirado. Por favor, solicita uno nuevo.',
      });
    }

    console.error('Error al cambiar la contraseña:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud. Por favor, inténtalo nuevamente.',
    });
  }
};

/**
 * ✅ Router estilo verifyEmail:
 * GET  -> renderiza página con botón (NO toca BD)
 * POST -> confirma y recién ahí habilita canResetPassword
 */
const verifyResetToken = async (req, res) => {
  if (req.method === 'GET') return renderResetPage(req, res);
  if (req.method === 'POST') return confirmResetToken(req, res);
  return res.status(405).send('Método no permitido');
};

// GET: Solo valida token (sin BD) y muestra botón
const renderResetPage = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Token no proporcionado.');
  }

  try {
    jwt.verify(token, secret);
  } catch (error) {
    return res.status(400).send(`
      <html>
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:Arial,sans-serif;">
          <h1 style="font-size:64px;color:#000C7B;text-align:justify;line-height:1.3;max-width:90%;padding:0 20px;">
            El enlace de restablecimiento es inválido o ha caducado.
          </h1>
        </body>
      </html>
    `);
  }

  // ⚠️ Importante: NO tocar base de datos aquí
  return res.send(`
    <html>
      <body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:Arial,sans-serif;">
        <div style="text-align:center;max-width:90%;">
          <h1 style="font-size:64px;color:#000C7B;line-height:1.2;margin-bottom:30px;">
            Restablecer contraseña
          </h1>

          <p style="font-size:28px;color:#000C7B;margin-bottom:40px;">
            Para continuar, confirma tu solicitud.
          </p>

          <form method="POST" action="/api/v1/password/verify-reset-token">
            <input type="hidden" name="token" value="${token}" />
            <button style="background-color:#000C7B;color:#ffffff;border:none;padding:16px 32px;font-size:22px;border-radius:8px;cursor:pointer;">
              Confirmar
            </button>
          </form>
        </div>
      </body>
    </html>
  `);
};

// POST: Aquí sí validas con BD y habilitas canResetPassword
const confirmResetToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send('Token no proporcionado.');
  }

  try {
    const decoded = jwt.verify(token, secret);
    const userId = decoded.userId;

    const user = await User.findOne({
      _id: userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send(`
        <html>
          <body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:Arial,sans-serif;">
            <h1 style="font-size:64px;color:#000C7B;text-align:justify;line-height:1.3;max-width:90%;padding:0 20px;">
              El enlace de restablecimiento es inválido o ha caducado.
            </h1>
          </body>
        </html>
      `);
    }

    // ✅ Evita loop: si ya estaba confirmado, no repitas el mismo mensaje
    if (user.canResetPassword === true) {
      return res.status(200).send(`
        <html>
          <body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:Arial,sans-serif;">
            <div style="text-align:center;max-width:90%;">
              <h1 style="font-size:64px;color:#000C7B;line-height:1.2;margin-bottom:30px;">
                Enlace ya confirmado
              </h1>
              <p style="font-size:28px;color:#000C7B;line-height:1.4;">
                Ya puedes volver a tu aplicación móvil para restablecer tu contraseña.
              </p>
            </div>
          </body>
        </html>
      `);
    }

    user.canResetPassword = true;
    await user.save();

    return res.status(200).send(`
      <html>
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:Arial,sans-serif;">
          <div style="text-align:center;max-width:90%;">
            <h1 style="font-size:64px;color:#000C7B;line-height:1.2;margin-bottom:30px;">
              Solicitud confirmada
            </h1>
            <p style="font-size:28px;color:#000C7B;line-height:1.4;">
              Ahora vuelve a tu aplicación móvil para restablecer tu contraseña.
            </p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error al confirmar el token:', error);
    return res.status(400).send(`
      <html>
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:Arial,sans-serif;">
          <h1 style="font-size:64px;color:#000C7B;text-align:justify;line-height:1.3;max-width:90%;padding:0 20px;">
            El enlace de restablecimiento es inválido o ha caducado.
          </h1>
        </body>
      </html>
    `);
  }
};

// Controlador para obtener el token de restablecimiento de contraseña
const getResetPasswordToken = async (req, res) => {
  const { email } = req.body;

  const emailRegex = /^[a-z]+\.[a-z]+@estudiantes\.uv\.cl$/;

  if (!emailRegex.test(email)) {
    return res.status(400).send({ message: 'El correo electrónico no tiene el formato correcto' });
  }

  try {
    const hashedEmail = crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');

    const user = await User.findOne({ emailHash: hashedEmail });

    if (!user) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }

    if (!user.resetPasswordToken) {
      return res.status(400).send({ message: 'No hay token de restablecimiento para este usuario' });
    }

    return res.status(200).send({
      message: 'Token encontrado',
      resetPasswordToken: user.resetPasswordToken,
    });
  } catch (error) {
    return res.status(500).send({ message: 'Error del servidor', error: error.message });
  }
};

module.exports = { forgotPassword, changePassword, verifyResetToken, getResetPasswordToken };