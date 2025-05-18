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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    // Calcular hash determinista del email para buscar
    const hashedEmail = crypto
      .createHash("sha256")
      .update(normalizedEmail)
      .digest("hex");

    // Verifica si existe un usuario temporal pendiente de verificación
    const tempUser = await TempUser.findOne({ emailHash: hashedEmail });
    if (tempUser) {
      return res.status(403).json({
        success: false,
        message:
          "Aún no has verificado tu correo electrónico. Por favor, revisa tu bandeja de entrada para completar el registro.",
      });
    }

    // Buscar usuario usando el hash del email
    const user = await User.findOne({ emailHash: hashedEmail });
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

    // Validar la contraseña
    if (bcrypt.compareSync(password, user.passwordHash)) {
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email, // Desencriptado automáticamente por mongoose-encryption
          isAdmin: user.isAdmin,
        },
        secret,
        { expiresIn: "4d" }
      );
      return res.status(200).json({
        success: true,
        name: user.name,
        user: user.email,
        rut: user.rut,
        phoneNumber: user.phoneNumber,
        token,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "La contraseña es incorrecta.",
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
      confirmPassword,
      policyAccepted,
    } = req.body;
    const normalizedEmail = email.toLowerCase();

    // Debug: Verificar que los datos lleguen correctamente
    console.log("Datos de registro recibidos:", req.body);

    if (
      !name ||
      !normalizedEmail ||
      !rut ||
      !birthdate ||
      !faculty ||
      !career ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Todos los campos son obligatorios.",
        });
    }

    const firstName = name.split(" ")[0];

    // Validar el formato del número de celular
    const phoneRegex = /^\+569\s?\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Número de celular inválido. Debe seguir el formato +569 XXXXXXXX.",
        });
    }
    console.log("Número de celular recibido:", phoneNumber);

    // Validar fortaleza y confirmación de contraseña
    if (!isStrongPassword(password)) {
      return res
        .status(400)
        .json({
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
    const [day, month, year] = birthdate.split("-").map(Number);
    const formattedBirthdate = `${year}-${String(month).padStart(
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
      return res
        .status(400)
        .json({
          success: false,
          message: "La fecha de nacimiento no es válida.",
        });
    }
    if (!policyAccepted) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Debes aceptar la política de privacidad para registrarte.",
        });
    }

    // Calcular hash determinista para email y rut
    const hashedEmail = crypto
      .createHash("sha256")
      .update(normalizedEmail)
      .digest("hex");

    const hashedRut = crypto.createHash("sha256").update(rut).digest("hex");

    // Verificar si ya existe un usuario con el mismo email o rut
    const existingUser = await User.findOne({ emailHash: hashedEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "El correo electrónico que ingresaste ya está registrado.",
        });
    }
    const existingRut = await User.findOne({ rutHash: hashedRut });
    if (existingRut) {
      return res
        .status(400)
        .json({ success: false, message: "El Rut ya se encuentra en uso." });
    }

    // Crear un token de verificación para el correo
    const verificationToken = jwt.sign({ email: normalizedEmail }, secret, {
      expiresIn: "1h",
    });

    // Crear un usuario temporal para verificación
    const tempUser = new TempUser({
      name,
      email: normalizedEmail,
      rut,
      birthdate: formattedBirthdate,
      faculty,
      career,
      phoneNumber,
      passwordHash: bcrypt.hashSync(password, 8),
      verificationToken,
      policyAccepted: true,
      policyAcceptedAt: new Date(),
    });

    const savedTempUser = await tempUser.save();
    if (!savedTempUser)
      return res
        .status(400)
        .json({
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

    res
      .status(201)
      .json({
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
    const decoded = jwt.verify(token, secret);
    const email = decoded.email;

    const tempUser = await TempUser.findOne({ verificationToken: token });
    if (!tempUser) {
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

    const user = new User({
      name: tempUser.name,
      email: tempUser.email,
      rut: tempUser.rut,
      birthdate: tempUser.birthdate,
      faculty: tempUser.faculty,
      career: tempUser.career,
      phoneNumber: tempUser.phoneNumber,
      passwordHash: tempUser.passwordHash,
      verified: true,
      policyAccepted: true,
      policyAcceptedAt: new Date(),
    });

    await user.save();
    console.log("New user saved:", user);

    try {
      const deleteResult = await TempUser.deleteOne({
        verificationToken: token,
      });
      if (deleteResult.deletedCount === 0) {
        console.error("Failed to delete temporary user");
        return res.status(500).send(`
                    <html>
                        <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif;">
                            <h1 style="font-size: 64px; color: #000C7B; text-align: justify; line-height: 1.3; max-width: 90%; padding: 0 20px;">
                            Hubo un problema al eliminar el usuario temporal. Por favor, intenta nuevamente.</h1>
                        </body>
                    </html>
                `);
      }
      console.log("Temporary user deleted successfully");
    } catch (error) {
      console.error("Error during temporary user deletion:", error.message);
      return res.status(500).send(`
                <html>
                    <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif;">
                        <h1 style="font-size: 64px; color: #000C7B; text-align: justify; line-height: 1.3; max-width: 90%; padding: 0 20px;">
                        Error al eliminar el usuario temporal. Intenta nuevamente más tarde.</h1>
                    </body>
                </html>
            `);
    }

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
