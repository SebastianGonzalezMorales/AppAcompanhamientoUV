const { Question } = require("../models/questions");

/*----------------------------------------------------------
  Crear pregunta
----------------------------------------------------------*/
const createQuestion = async (req, res) => {
  try {
    // Asegurarse de que lleguen testKey y order
    if (!req.body.testKey) {
      return res.status(400).json({ message: "Falta el campo testKey." });
    }
    if (req.body.order === undefined) {
      return res.status(400).json({ message: "Falta el campo order." });
    }

    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    // Código 11000 = violación de índice único (testKey + order)
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Ya existe una pregunta con ese testKey y order." });
    }
    res.status(400).json({ message: error.message });
  }
};

/*----------------------------------------------------------
  Obtener todas las preguntas  (admite ?testKey=PHQ9)
----------------------------------------------------------*/
const getAllQuestions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.testKey) {
      filter.testKey = req.query.testKey;
    }
    const questions = await Question.find(filter).sort({ order: 1 });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*----------------------------------------------------------
  Obtener una pregunta por ID
----------------------------------------------------------*/
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Pregunta no encontrada." });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*----------------------------------------------------------
  Actualizar pregunta
----------------------------------------------------------*/
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!question) {
      return res.status(404).json({ message: "Pregunta no encontrada." });
    }
    res.status(200).json(question);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Ya existe otra pregunta con ese testKey y order." });
    }
    res.status(400).json({ message: error.message });
  }
};

/*----------------------------------------------------------
  Eliminar pregunta
----------------------------------------------------------*/
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Pregunta no encontrada." });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
