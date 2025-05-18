const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const crypto = require("crypto");
require("dotenv").config(); // Para cargar variables de entorno

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rut: {
    type: String,
    required: true,
    unique: true,
  },
  rutHash: { type: String, unique: true }, // Para búsquedas por RUT
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailHash: { type: String, unique: true }, // Para búsquedas por email
  passwordHash: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  faculty: {
    type: String,
    required: false,
  },
  career: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  canResetPassword: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  policyAccepted: {
    type: Boolean,
    default: false,
  },
  policyAcceptedAt: {
    type: Date,
    default: null,
  },
  phoneNumber: { type: String, required: true },
});

/**
 * Pre-guardar: genera un hash determinista para los campos
 * que se usarán en búsquedas (email, rut).
 */
usersSchema.pre("save", function (next) {
  // Hash para el email
  if (this.isModified("email")) {
    const normalizedEmail = this.email.toLowerCase();
    this.emailHash = crypto
      .createHash("sha256")
      .update(normalizedEmail)
      .digest("hex");
  }

  // Hash para el RUT
  if (this.isModified("rut")) {
    this.rutHash = crypto.createHash("sha256").update(this.rut).digest("hex");
  }

  next();
});

/**
 * Aplicar la encriptación a los campos sensibles:
 * - Se encriptan: name, rut, email, phoneNumber.
 * - 'rutHash' y 'emailHash' no se encriptan para que sean buscables.
 */
const encryptionKey = process.env.ENCRYPTION_KEY;
const signingKey = process.env.SIGNING_KEY;

if (!encryptionKey || !signingKey) {
  throw new Error(
    "Faltan las variables de entorno ENCRYPTION_KEY o SIGNING_KEY. Configúralas antes de iniciar la aplicación."
  );
}

// Ahora que estás seguro de que existen, conviértalas a Buffer
const encryptionKeyBuffer = Buffer.from(encryptionKey, "hex");
const signingKeyBuffer = Buffer.from(signingKey, "hex");

usersSchema.plugin(encrypt, {
  encryptionKey: encryptionKeyBuffer,
  signingKey: signingKeyBuffer,
  encryptedFields: ["name", "rut", "email", "phoneNumber"],
  encryptOnly: true,
});

module.exports = mongoose.model("User", usersSchema);
