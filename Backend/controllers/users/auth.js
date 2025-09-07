const User = require("../../models/user");
const { TempUser } = require("../../models/tempUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto"); // Para calcular los hashes

// Clave secreta para JWT
const secret = process.env.SECRET;
if (!secret) {
  throw new Error(
    "La clave secreta (SECRET) no está definida en las variables de entorno."
  );
}

const sha256 = (v = "") => crypto.createHash("sha256").update(v).digest("hex");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const emailHash = sha256(normalizedEmail);

    const tempUser = await TempUser.findOne({ emailHash });
    if (tempUser) {
      return res.status(403).json({
        success: false,
        message:
          "Aún no has verificado tu correo electrónico. Por favor, revisa tu bandeja de entrada para completar el registro.",
      });
    }

    const user = await User.findOne({ emailHash });
    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "No pudimos encontrar una cuenta con este correo electrónico. Por favor, revisa que el correo sea correcto o regístrate si aún no tienes una cuenta.",
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message:
          "Por favor verifica tu correo electrónico antes de iniciar sesión.",
      });
    }

    // ⚠ Verificar bloqueo temporal
    if (user.blockUntil && user.blockUntil > new Date()) {
      return res.status(403).json({
        success: false,
        message: `Usuario bloqueado temporalmente. Intenta nuevamente después de ${user.blockUntil.toLocaleTimeString()}.`,
      });
    }

    // Validar contraseña
    if (bcrypt.compareSync(password, user.passwordHash)) {
      // Login exitoso: resetear intentos
      user.failedLoginAttempts = 0;
      user.blockUntil = null;
      await user.save();

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: "4d" }
      );

      return res.status(200).json({
        success: true,
        name: user.name,
        user: user.email,
        rut: user.rut,
        phoneNumber: user.phoneNumber,
        role: user.role,
        token,
      });
    } else {
      // Contraseña incorrecta: incrementar contador
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      // Bloquear temporalmente si supera 5 intentos
      if (user.failedLoginAttempts >= 5) {
        user.blockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min de bloqueo
      }

      await user.save();

      return res.status(400).json({
        success: false,
        message: user.blockUntil
          ? "Has excedido el número de intentos. Tu cuenta está bloqueada temporalmente por 15 minutos."
          : "La contraseña es incorrecta.",
      });
    }
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
};

const registerUser = async (req, res) => {
  try {
    // Verificar que se reciban todos los campos
    const {
      name,
      email,
      rut,
      birthdate,
      faculty,
      career,
      phoneNumber,
      password,
      role,
      confirmPassword,
      policyAccepted,
    } = req.body;
    const normalizedEmail = email.toLowerCase();

    const emailHash = sha256(normalizedEmail);
    const rutHash = sha256(rut);

    // Debug: Verificar que los datos lleguen correctamente
    console.log("Se reciben datos correctamente");

    if (
      !name ||
      !normalizedEmail ||
      !rut ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios.",
      });
    }

    const firstName = name.split(" ")[0];

    // Validar el formato del número de celular
    const phoneRegex = /^\+569\s?\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message:
          "Número de celular inválido. Debe seguir el formato +569 XXXXXXXX.",
      });
    }
    console.log("Número de celular recibido:", phoneNumber);

    // Validar fortaleza y confirmación de contraseña
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un símbolo.",
      });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Las contraseñas no coinciden." });
    }

    // Convertir la fecha de nacimiento a formato YYYY-MM-DD
    let formattedBirthdate;
    if (birthdate){
    const [day, month, year] = birthdate.split("-").map(Number);
    formattedBirthdate = `${year}-${String(month).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    const currentYear = new Date().getFullYear();
    if (
      year < 1900 ||
      year > currentYear ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      return res.status(400).json({
        success: false,
        message: "La fecha de nacimiento no es válida.",
      });
    }
  }
    if (!policyAccepted) {
      return res.status(400).json({
        success: false,
        message: "Debes aceptar la política de privacidad para registrarte.",
      });
    }

    // --------------------------------------------------------------------
    // BLOQUE DE REENVÍO AUTOMÁTICO — añadir aquí
    // --------------------------------------------------------------------
    const pending = await TempUser.findOne({ emailHash });
    if (pending) {
      // Genera un nuevo token (o usa el que ya tiene)
      const newToken = jwt.sign({ email: normalizedEmail }, secret, {
        expiresIn: "1h",
      });
      pending.verificationToken = newToken;
      await pending.save();

      // Construir enlace
      const verificationLink = `${process.env.BASE_URL}${process.env.API_URL}/auth/verificar?token=${newToken}`;

      // Reenviar correo
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      const resendHtml = `
                      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="cid:app_logo" alt="App Acompañamiento UV" style="width: 70px; height: auto;">
                    </div>
                    <h2 style="color: #1d72b8; text-align: center;">Bienvenido a la App Acompañamiento UV</h2>
                    <p>Hola <strong>${firstName}</strong>,</p>
                    <p>Gracias por registrarte en nuestra aplicación. Estamos encantados de que formes parte de nuestra comunidad.</p>
                    <p>Para activar tu cuenta y comenzar a disfrutar de nuestros servicios, por favor haz clic en el siguiente botón:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${verificationLink}" style="background-color: #1d72b8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verificar Cuenta</a>
                    </div>
                    <p>Si no solicitaste este registro, por favor ignora este correo.</p>
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
        subject: "[Nuevo enlace de verificación – App Acompañamiento UV]",
        html: resendHtml,
        attachments: [
          {
            filename: "Icon_Application_Blue.png",
            path: "public/Icon_Application_Blue.png",
            cid: "app_logo",
          },
        ],
      });

      return res.status(400).json({
        success: true,
        message:
          "Ya existía una solicitud pendiente. Se ha reenviado el enlace de verificación.",
      });
    }

    // Verificar si ya existe un usuario con el mismo email o rut
    const existingUser = await User.findOne({ emailHash });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "El correo electrónico que ingresaste ya está registrado.",
      });
    }
    const existingRut = await User.findOne({ rutHash });
    if (existingRut) {
      return res
        .status(400)
        .json({ success: false, message: "El Rut ya se encuentra en uso." });
    }

    // Crear un token de verificación para el correo
    const verificationToken = jwt.sign({ email: normalizedEmail }, secret, {
      expiresIn: "1h",
    });
    // Antes de crear tempUser
if (role === "administrador") {
  const existingAdmin = await User.findOne({ role: "administrador" });
  if (existingAdmin) {
    return res.status(400).json({
      success: false,
      message:
        "Ya existe un administrador registrado. Solo se permite un administrador.",
    });
  }

  // Además, revisa usuarios temporales pendientes de verificación
  const pendingAdmin = await TempUser.findOne({ role: "administrador" });
  if (pendingAdmin) {
    return res.status(400).json({
      success: false,
      message:
        "Ya hay un administrador en proceso de registro. Espera a que verifique su correo.",
    });
  }
}

    // Crear un usuario temporal para verificación
    const tempUser = new TempUser({
      name,
      email: normalizedEmail,
      emailHash,
      rut,
      rutHash,
      birthdate: formattedBirthdate,
      faculty,
      career,
      role,
      phoneNumber,
      passwordHash: bcrypt.hashSync(password, 8),
      verificationToken,
      policyAccepted: true,
      policyAcceptedAt: new Date(),
    });

    const savedTempUser = await tempUser.save();
    if (!savedTempUser)
      return res.status(400).json({
        success: false,
        message: "No se pudo crear el usuario temporal.",
      });

    // Configurar el enlace de verificación
    const baseUrl = process.env.BASE_URL;
    const api_url = process.env.API_URL;
    const verificationLink = `${baseUrl}${api_url}/auth/verificar?token=${verificationToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Enviar correo de verificación
    await transporter.sendMail({
      to: normalizedEmail,
      subject: "[Verifique su correo electrónico - App Acompañamiento UV]",
      html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="cid:app_logo" alt="App Acompañamiento UV" style="width: 70px; height: auto;">
                    </div>
                    <h2 style="color: #1d72b8; text-align: center;">Bienvenido a la App Acompañamiento UV</h2>
                    <p>Hola <strong>${firstName}</strong>,</p>
                    <p>Gracias por registrarte en nuestra aplicación. Estamos encantados de que formes parte de nuestra comunidad.</p>
                    <p>Para activar tu cuenta y comenzar a disfrutar de nuestros servicios, por favor haz clic en el siguiente botón:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${verificationLink}" style="background-color: #1d72b8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verificar Cuenta</a>
                    </div>
                    <p>Si no solicitaste este registro, por favor ignora este correo.</p>
                    <p>Saludos cordiales,</p>
                    <p style="font-style: italic; color: #333;">Equipo de App Acompañamiento UV</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="font-size: 12px; text-align: center; color: #777;">
                        Este correo se ha enviado automáticamente. Por favor, no respondas a este mensaje.
                    </p>
                </div>
            `,
      attachments: [
        {
          filename: "Icon_Application_Blue.png",
          path: "public/Icon_Application_Blue.png",
          cid: "app_logo",
        },
      ],
    });

    res.status(201).json({
      success: true,
      message:
        "Registro exitoso. Por favor, revise su correo electrónico para verificar su cuenta.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor." });
  }
};

const isStrongPassword = (password) => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
  return true;
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  console.log("Verifying email with token:", token);

  try {
    // Verificar el token
    const { email } = jwt.verify(token, secret);
    const normalizedEmail = email.toLowerCase();

    // Buscar usuario temporal
    const tempUser = await TempUser.findOne({ verificationToken: token });

    // Calcular hashes
    const emailHash = crypto
      .createHash("sha256")
      .update(normalizedEmail)
      .digest("hex");

    const user = await User.findOne({ emailHash });

    // 🔹 Caso 1: El usuario ya existe y está verificado
    if (user && user.verified) {
      console.log("User already verified.");
      return res.send(`
        <html>
          <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif;">
            <h1 style="font-size: 64px; color: #000C7B; text-align: justify; line-height: 1.3; max-width: 90%; padding: 0 20px;">
              Su cuenta fue verificada y se encuentra activa.</h1>
          </body>
        </html>
      `);
    }

    // 🔹 Caso 2: No hay tempUser ⇒ token inválido
    if (!tempUser && !user) {
      console.log("No temporary user found or token expired.");
      return res.status(400).send(`
        <html>
          <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif;">
            <h1 style="font-size: 64px; color: #000C7B; text-align: justify; line-height: 1.3; max-width: 90%; padding: 0 20px;">
              Token de verificación no válido o caducado.</h1>
          </body>
        </html>
      `);
    }

    // 🔹 Caso 3: Usuario existe pero no estaba verificado ⇒ lo marcamos como verificado
    if (user && !user.verified) {
      user.verified = true;
      await user.save();
    } else if (!user) {
      // 🔹 Caso 4: Crear usuario desde tempUser
      const rutHash = crypto
        .createHash("sha256")
        .update(tempUser.rut)
        .digest("hex");

      const newUser = new User({
        name: tempUser.name,
        email: tempUser.email,
        rut: tempUser.rut,
        birthdate: tempUser.birthdate,
        faculty: tempUser.faculty,
        career: tempUser.career,
        phoneNumber: tempUser.phoneNumber,
        passwordHash: tempUser.passwordHash,
        policyAccepted: true,
        policyAcceptedAt: new Date(),
        verified: true,
        emailHash,
        rutHash,
        role: tempUser.role,
      });
      await newUser.save();
    }

    // 🔹 Eliminar usuario temporal si existía
    if (tempUser) {
      await TempUser.deleteOne({ verificationToken: token });
    }

    // 🔹 Respuesta de éxito
    return res.send(`
      <html>
        <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif;">
          <h1 style="font-size: 64px; color: #000C7B; text-align: justify; line-height: 1.3; max-width: 90%; padding: 0 20px;">
            El correo electrónico se ha verificado correctamente. Su cuenta ya está activa.</h1>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error during email verification:", error.message);
    return res.status(400).send(`
      <html>
        <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif;">
          <h1 style="font-size: 64px; color: #000C7B; text-align: justify; line-height: 1.3; max-width: 90%; padding: 0 20px;">
            Enlace de verificación no válido o vencido.</h1>
        </body>
      </html>
    `);
  }
};


let revokedTokens = [];

const logoutUser = (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(400)
        .json({ success: false, message: "No se proporcionó un token" });
    }

    const token = authHeader.split(" ")[1];
    revokedTokens.push(token);

    return res.status(200).json({
      success: true,
      message: "El usuario cerró sesión exitosamente",
    });
  } catch (error) {
    console.error("Error en logoutUser:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

module.exports = { loginUser, registerUser, verifyEmail, logoutUser };
