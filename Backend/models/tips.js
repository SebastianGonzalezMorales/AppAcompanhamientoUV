const mongoose = require("mongoose");

// Definir el esquema para los consejos
const tipsSchema = new mongoose.Schema({
  moodState: {
    type: String,
    enum: ["Mal", "Regular", "Bien", "Excelente"],
    required: true,
  },
  activityTips: [
    {
      tip: {
        type: String,
        required: true,
      },
      activities: {
        type: [String],
        required: true,
      },
    },
  ],
  generalTips: {
    type: [String], // Consejos generales para el estado, no asociados a actividades específicas
    default: [],
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

// Crear el modelo a partir del esquema
const Tips = mongoose.model("Tips", tipsSchema);

module.exports = Tips;
