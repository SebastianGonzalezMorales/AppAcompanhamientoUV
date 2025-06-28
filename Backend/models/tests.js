const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true }, // 'PHQ9'
  name: { type: String, required: true }, // 'Cuestionario PHQ-9'
  description: { type: String, required: false },
});

module.exports = mongoose.model("Test", testSchema);
