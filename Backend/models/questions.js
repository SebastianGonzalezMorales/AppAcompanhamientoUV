const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  /** Identificador del test: “PHQ9”, “GAD7”, etc. */
  testKey: {
    type: String,
    required: true,
    enum: ["PHQ9", "GAD7"], // añade más códigos según los vayas creando
  },

  /** Orden de la pregunta dentro de ese test */
  order: { type: Number, required: true, unique: true },

  /** Texto de la pregunta */
  question: { type: String, required: true },

  /** Opciones y su puntaje */
  option1: { type: String, required: true },
  option2: { type: String, required: true },
  option3: { type: String, required: true },
  option4: { type: String, required: true },
  selectedoption1: { type: Number, required: true },
  selectedoption2: { type: Number, required: true },
  selectedoption3: { type: Number, required: true },
  selectedoption4: { type: Number, required: true },
});

// Crear el modelo
exports.Question = mongoose.model("Question", questionSchema);

exports.questionSchema = questionSchema;
