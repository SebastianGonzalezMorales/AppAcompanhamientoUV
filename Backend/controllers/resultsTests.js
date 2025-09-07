const { ResultsTests } = require("../models/resultsTests");
const mongoose = require("mongoose");
const User = require("../models/user");
const Test = require("../models/tests"); // ← nuevo

/*----------------------------------------------------------
  Crear resultado de test
----------------------------------------------------------*/
const createResultTest = async (req, res) => {
  try {
    const { totalScore, severity, date, userId, testId, code } = req.body;

    // validar userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "userId inválido" });

    const userExists = await User.findById(userId);
    if (!userExists)
      return res.status(404).json({ message: "El usuario no existe" });

    /* obtener testId a partir de code si hace falta */
    let finalTestId = testId;
    if (!finalTestId && code) {
      const t = await Test.findOne({ code: code.toUpperCase() });
      if (!t) return res.status(404).json({ message: "Test no encontrado" });
      finalTestId = t._id;
    }
    if (!finalTestId)
      return res.status(400).json({ message: "Falta testId o code" });

    const newResult = new ResultsTests({
      userId: userExists._id,
      testId: finalTestId, // ← guarda referencia al test
      totalScore,
      severity,
      date,
      created: new Date(),
    });

    const saved = await newResult.save();
    res.status(201).json(saved);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al crear resultado", error: err.message });
  }
};

/*----------------------------------------------------------
  Resultados por userId
----------------------------------------------------------*/
const getResultsTestsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "userId inválido" });

    const results = await ResultsTests.find({ userId });
    res.status(200).json({
      success: true,
      message: results.length ? "Resultados encontrados" : "Sin resultados",
      results,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error al obtener resultados",
      error: err.message,
    });
  }
};

/*----------------------------------------------------------
  Resultados del mes actual (usuario autenticado)
----------------------------------------------------------*/
const getResultsTestByMonth = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month } = req.query; // YYYY-M o YYYY-MM

    if (!month || !/^\d{4}-\d{1,2}$/.test(month))
      return res.status(400).json({ message: "Mes inválido (use YYYY-M)" });

    const [y, m] = month.split("-");
    const start = new Date(`${y}-${String(m).padStart(2, "0")}-01T00:00:00Z`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const results = await ResultsTests.find({
      userId,
      created: { $gte: start, $lt: end },
    }).sort({ created: 1 });

    if (!results.length)
      return res.status(200).json({ message: "Sin resultados", results: [] });

    res.status(200).json({ message: "Resultados encontrados", results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener resultados", error: err.message });
  }
};

/*----------------------------------------------------------
  Todos los resultados
----------------------------------------------------------*/
const getAllResultsTests = async (req, res) => {
  try {
    // Verificar que el usuario sea administrador
    if (req.auth.role !== "administrador") {
      return res
        .status(403)
        .json({ error: "Acceso denegado. Solo administradores." });
    }

    const results = await ResultsTests.find();
    res.status(200).json({ status: "Ok", data: results });
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener resultados",
      error: err.message,
    });
  }
};

/*----------------------------------------------------------
  Resultado por ID
----------------------------------------------------------*/
const getResultTestById = async (req, res) => {
  try {
    const result = await ResultsTests.findById(req.params.id);
    if (!result)
      return res.status(404).json({ message: "Resultado no encontrado" });
    res.json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener resultado", error: err.message });
  }
};

module.exports = {
  createResultTest,
  getResultsTestsByUserId,
  getAllResultsTests,
  getResultTestById,
  getResultsTestByMonth,
};
