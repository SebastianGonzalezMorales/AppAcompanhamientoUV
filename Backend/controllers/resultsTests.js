const { ResultsTests } = require("../models/resultsTests"); // Asegúrate de ajustar la ruta según tu estructura de carpetas
const mongoose = require("mongoose");
const User = require("../models/user");

// Crear un nuevo resultado de test
const createResultTest = async (req, res) => {
  try {
    const { totalScore, severity, date, userId } = req.body;

    // Validación del userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ message: "El userId es requerido y debe ser un ID válido." });
    }

    // Verificar si el usuario existe en la base de datos
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "El usuario no existe." });
    }

    const newResult = new ResultsTests({
      totalScore,
      severity,
      date,
      created: new Date(),
      userId: userExists._id, // Usa el _id del usuario existente
    });

    const savedResult = await newResult.save();
    res.status(201).json(savedResult);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el resultado del test",
      error: error.message,
    });
  }
};

// Obtener resultados de tests por userId
const getResultsTestsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validación del userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "El userId es inválido." });
    }

    // Buscar resultados de tests por userId
    const results = await ResultsTests.find({ userId });

    // Devolver resultados (vacío o con datos)
    return res.status(200).json({
      success: true,
      message: results.length
        ? "Resultados encontrados."
        : "No se encontraron resultados para este usuario.",
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los resultados del test",
      error: error.message,
    });
  }
};

const getResultsTestByMonth = async (req, res) => {
  try {
    const userId = req.user._id; // Asigna el ID del usuario autenticado
    const { month } = req.query;

    console.log("User ID autenticado:", userId); // Verifica el userId

    // Nueva validación para aceptar meses de uno o dos dígitos
    if (!month || !/^\d{4}-\d{1,2}$/.test(month)) {
      return res
        .status(400)
        .json({ message: "Formato de mes inválido. Use YYYY-M o YYYY-MM." });
    }

    // Ajustar el formato del mes si es de un dígito, para que sea compatible con la fecha
    const [year, monthValue] = month.split("-");
    const formattedMonth = `${year}-${String(monthValue).padStart(2, "0")}`;

    // Crear el rango de fechas para el mes especificado
    const startDate = new Date(`${formattedMonth}-01T00:00:00Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Consulta en la base de datos
    const results = await ResultsTests.find({
      userId: userId, // Filtra por el userId correcto
      created: { $gte: startDate, $lt: endDate },
    }).sort({ created: 1 });

    // Verificar si no hay resultados
    if (results.length === 0) {
      return res.status(200).json({
        message: "No se encontraron resultados para el mes especificado.",
        results: [],
      });
    }

    // Retorna los resultados si se encuentran
    return res
      .status(200)
      .json({ message: "Resultados encontrados.", results });
  } catch (err) {
    console.error("Error al obtener resultados:", err.message); // Log para errores
    res
      .status(500)
      .json({ message: "Error al obtener resultados", error: err.message });
  }
};

// Obtener todos los resultados de tests
const getAllResultsTests = async (req, res) => {
  try {
    const results = await ResultsTests.find();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los resultados de los tests",
      error: error.message,
    });
  }
};

// Obtener un resultado de test por ID
const getResultTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ResultsTests.findById(id);

    if (!result) {
      return res
        .status(404)
        .json({ message: "Resultado de test no encontrado" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el resultado del test",
      error: error.message,
    });
  }
};

// Exportar los controladores
module.exports = {
  createResultTest,
  getResultsTestsByUserId,
  getAllResultsTests,
  getResultTestById,
  getResultsTestByMonth,
};
