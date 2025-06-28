const Question = require("../models/questions");
const Test = require("../models/tests");

/* ---------- Crear pregunta ---------- */
const createQuestion = async (req, res) => {
  try {
    // debe llegar testId o code + order
    if (!req.body.testId && !req.body.code)
      return res.status(400).json({ message: "Falta testId o code" });
    if (req.body.order === undefined)
      return res.status(400).json({ message: "Falta order" });

    // convertir code → testId
    if (!req.body.testId && req.body.code) {
      const t = await Test.findOne({ code: req.body.code.toUpperCase() });
      if (!t) return res.status(404).json({ message: "Test no existe" });
      req.body.testId = t._id;
    }

    const q = new Question(req.body);
    await q.save();
    res.status(201).json(q);
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: "order duplicado en este test" });
    res.status(400).json({ message: err.message });
  }
};

/* ---------- Listar preguntas ---------- */
const getAllQuestions = async (req, res) => {
  try {
    let filter = {};

    if (req.query.testId) {
      filter.testId = req.query.testId;
    } else if (req.query.code) {
      const t = await Test.findOne({ code: req.query.code.toUpperCase() });
      if (!t) return res.status(404).json({ message: "Test no existe" });
      filter.testId = t._id;
    } else {
      return res.status(400).json({ message: "Falta testId o code" });
    }

    const qs = await Question.find(filter).sort({ order: 1 });
    if (!qs.length)
      return res.status(404).json({ message: "El test no tiene preguntas" });

    res.json(qs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------- Obtener por ID ---------- */
const getQuestionById = async (req, res) => {
  const q = await Question.findById(req.params.id);
  if (!q) return res.status(404).json({ message: "Pregunta no encontrada" });
  res.json(q);
};

/* ---------- Actualizar ---------- */
const updateQuestion = async (req, res) => {
  try {
    if (!req.body.testId && req.body.code) {
      const t = await Test.findOne({ code: req.body.code.toUpperCase() });
      if (!t) return res.status(404).json({ message: "Test no existe" });
      req.body.testId = t._id;
    }

    const q = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!q) return res.status(404).json({ message: "Pregunta no encontrada" });
    res.json(q);
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: "order duplicado en este test" });
    res.status(400).json({ message: err.message });
  }
};

/* ---------- Eliminar ---------- */
const deleteQuestion = async (req, res) => {
  const q = await Question.findByIdAndDelete(req.params.id);
  if (!q) return res.status(404).json({ message: "Pregunta no encontrada" });
  res.status(204).send();
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
