const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const crypto = require("crypto");

const tempUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  emailHash: { type: String, unique: true, required: true }, // Para búsquedas
  rut: { type: String, required: true },
  rutHash: { type: String, unique: true, sparse: true }, // Para búsquedas
  birthdate: { type: Date, required: true },
  faculty: { type: String, required: true },
  career: { type: String, required: true },
  passwordHash: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  verificationToken: { type: String, required: true }, // Token de verificación
  createdAt: { type: Date, expires: "1h", default: Date.now }, // Se elimina después de 1 hora
});

/**
 * Pre-guardar: genera hashes para email y rut
 * Esto permite que el usuario sea buscable incluso después de ser encriptado.
 */
tempUserSchema.pre("save", function (next) {
  if (this.isModified("email")) {
    this.emailHash = crypto
      .createHash("sha256")
      .update(this.email.toLowerCase())
      .digest("hex");
  }

  if (this.isModified("rut")) {
    this.rutHash = crypto.createHash("sha256").update(this.rut).digest("hex");
  }

  next();
});

/**
 * Aplicar encriptación a los campos sensibles:
 * - Se encriptan: `name`, `email`, `rut`, `phoneNumber`
 * - No se encriptan `emailHash` ni `rutHash` para permitir búsquedas.
 */
tempUserSchema.plugin(encrypt, {
  encryptionKey: Buffer.from(process.env.ENCRYPTION_KEY, "hex"), // 32 bytes en formato HEX
  signingKey: Buffer.from(process.env.SIGNING_KEY, "hex"), // 32 bytes en formato HEX
  encryptedFields: ["name", "email", "rut", "phoneNumber"],
  encryptOnly: true, // Evita la firma de documentos, permitiendo búsquedas
});

exports.TempUser = mongoose.model("TempUser", tempUserSchema);
exports.tempUserSchema = tempUserSchema;
