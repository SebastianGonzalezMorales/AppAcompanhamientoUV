const mongoose = require("mongoose");

const assistantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  careers: { type: [String], required: true }, // Carreras asociadas a esta asistente
  imageUrl: { type: String, required: true },
  location: { type: String, required: true },
});

module.exports = mongoose.model("Assistant", assistantSchema);
exports.assistantSchema = assistantSchema;
