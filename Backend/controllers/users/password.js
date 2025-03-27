const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); // Servicio de correos
const crypto = require('crypto');

// Asignar la clave secreta desde las variables de entorno
const secret = process.env.SECRET;

if (!secret) {
  throw new Error('La clave secreta (SECRET) no está definida en las variables de entorno.');
}

// Función para restablecer la contraseña
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    // Calcular el hash del email
    const emailHash = crypto.createHash('sha256')
      .update(normalizedEmail)
      .digest('hex');

    // Buscar usando emailHash en lugar de email
    const user = await User.findOne({ emailHash: emailHash });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        code: 'USER_NOT_FOUND', 
        message: 'No se encontró una cuenta asociada a este correo. Por favor, verifica e intenta nuevamente.' 
      });
    }
    const firstName = user.name.split(' ')[0];
    const resetToken = jwt.sign({ userId: user._id, email: user.email }, secret, { expiresIn: '1h' });

    // Imprimir el token en la consola
    console.log('Generated reset token:', resetToken);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    user.canResetPassword = false;
    await user.save();

    const baseUrl = process.env.BASE_URL;
    const apiUrl = process.env.API_URL;

    const resetLink = `${baseUrl}${apiUrl}/password/verify-reset-token?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Variable de entorno para el correo
        pass: process.env.EMAIL_PASS, // Variable de entorno para la contraseña
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
        <p>Si realizaste esta solicitud, haz clic en el siguiente botón para restablecer tu contraseña:</p>
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

    res.status(200).json({ success: true, message: 'Se ha enviado un correo para restablecer la contraseña. Por favor, revisa tu bandeja de entrada.' });
  } catch (error) {
    console.error('Error al enviar el correo de restablecimiento:', error);
    res.status(500).json({ success: false, message: 'Hubo un error interno. Por favor, intenta nuevamente más tarde.' });
  }
};


const changePassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  // Verificar que el token esté presente
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'El token de restablecimiento es requerido.',
    });
  }

  try {
    // Decodificar el token
    const decoded = jwt.verify(token, secret);
    const userId = decoded.userId;

    // Buscar al usuario en la base de datos
    const user = await User.findOne({
      _id: userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Verificar que el token no haya expirado
    });

    // Si el usuario no existe o el token es inválido
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'El token es inválido o ha expirado. Por favor, solicita uno nuevo.',
      });
    }

    // Verificar si el usuario no confirmó el enlace
    if (!user.canResetPassword) {
      return res.status(400).json({
        success: false,
        message: 'Debes confirmar el enlace enviado a tu correo antes de cambiar la contraseña.',
      });
    }

    // Verificar que las contraseñas estén presentes
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Debes ingresar y confirmar la nueva contraseña.',
      });
    }

    // Verificar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Las contraseñas no coinciden.',
      });
    }

    // Validar la fuerza de la nueva contraseña
    const passwordRegex = /^(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>,.?\/\\|~`])[A-Za-z\d!@#$%^&*()_+\-={}\[\]:;"'<>,.?\/\\|~`áéíóúÁÉÍÓÚñÑ]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          'La contraseña debe tener al menos 8 caracteres e incluir al menos un carácter especial (@, $, !, %, #, ?, &, etc).',
      });
    }

    // Actualizar la contraseña del usuario
    user.passwordHash = bcrypt.hashSync(newPassword, 8);
    user.resetPasswordToken = null; // Invalidar el token después de usarlo
    user.resetPasswordExpires = null; // Borrar la expiración del token
    user.canResetPassword = false; // Prevenir el uso repetido del enlace
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada con éxito. Ahora puedes iniciar sesión.',
    });
  } catch (error) {
    // Manejo de errores al verificar el token
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

    // Cualquier otro error
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud. Por favor, inténtalo nuevamente.',
    });
  }
};


const verifyResetToken = async (req, res) => {
  const { token } = req.query;

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
              <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif;">
                  <h1 style="font-size: 64px; color: #000C7B; text-align: justify; line-height: 1.3; max-width: 90%; padding: 0 20px;">
                  El enlace de restablecimiento es inválido o ha caducado.</h1>
              </body>
          </html>
      `);
    }

    // Marcar que el usuario puede restablecer la contraseña
    user.canResetPassword = true;
    await user.save();


    // Si el token es válido, responder al frontend indicando que puede cambiar su contraseña
    res.status(200).send(`
      <html>
          <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif;">
              <h1 style="font-size: 64px; color: #000C7B; text-align: justify; line-height: 1.3; max-width: 90%; padding: 0 20px;">
              El token es válido. Puedes restablecer tu contraseña ahora, volviendo a tu aplicación móvil</h1>
          </body>
      </html>
  `);
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(400).send(`
      <html>
          <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif;">
              <h1 style="font-size: 64px; color: #000C7B; text-align: justify; line-height: 1.3; max-width: 90%; padding: 0 20px;">
              El enlace de restablecimiento es inválido o ha caducado.</h1>
          </body>
      </html>
  `);
  }
};
// Controlador para obtener el token de restablecimiento de contraseña
const getResetPasswordToken = async (req, res) => {
  const { email } = req.body; // Obtiene el correo electrónico del cuerpo de la solicitud

  // Expresión regular para validar el formato nombre.apellido@alumnos.uv.cl
  const emailRegex = /^[a-z]+\.[a-z]+@alumnos\.uv\.cl$/;

  // Verifica que el formato del correo sea correcto
  if (!emailRegex.test(email)) {
    return res.status(400).send({ message: "El correo electrónico no tiene el formato correcto" });
  }

  try {
    // Genera el hash del email (igual que en el pre('save'))
    const hashedEmail = crypto.createHash('sha256')
      .update(email.toLowerCase())
      .digest('hex');

    // Busca al usuario usando el emailHash
    const user = await User.findOne({ emailHash: hashedEmail });

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    // Verifica si hay un token de restablecimiento
    if (!user.resetPasswordToken) {
      return res.status(400).send({ message: "No hay token de restablecimiento para este usuario" });
    }

    // Devuelve el token de restablecimiento
    return res.status(200).send({
      message: "Token encontrado",
      resetPasswordToken: user.resetPasswordToken
    });

  } catch (error) {
    // Manejo de errores
    return res.status(500).send({ message: "Error del servidor", error: error.message });
  }
};

module.exports = { forgotPassword, changePassword, verifyResetToken, getResetPasswordToken };