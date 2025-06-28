const mongoose = require("mongoose");

/*  Esquema de preguntas — vinculado a Test  */
const questionSchema = new mongoose.Schema({
  /* Identificador del test (referencia al catálogo) */
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },

  /* Orden de la pregunta dentro de ese test */
  order: { type: Number, required: true },

  /* Texto y opciones */
  question: { type: String, required: true },

  option1: { type: String, required: true },
  option2: { type: String, required: true },
  option3: { type: String, required: true },
  option4: { type: String, required: true },
  selectedoption1: { type: Number, required: true },
  selectedoption2: { type: Number, required: true },
  selectedoption3: { type: Number, required: true },
  selectedoption4: { type: Number, required: true },
});

/* Índice compuesto: evita duplicar el mismo 'order' dentro de un test  */
questionSchema.index(
  { testId: 1, order: 1 },
  { unique: true, name: "testId_order_unique" }
);

module.exports = mongoose.model("Question", questionSchema);
