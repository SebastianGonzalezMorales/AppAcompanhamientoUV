const { PhraseOfTheDay } = require("../models/phraseOfTheDay");
const { UserPhrase } = require("../models/userPhrase");
const moment = require("moment");

// Controlador para obtener todos los phraseOfTheDay
const getPhraseOfTheDay = async (req, res) => {
  try {
    const phraseOfTheDayList = await PhraseOfTheDay.find();
    if (!phraseOfTheDayList) {
      return res.status(500).json({ success: false });
    }
    res.send(phraseOfTheDayList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para crear un nuevo tip
const postPhraseOfTheDay = async (req, res) => {
  const phraseOfTheDay = new PhraseOfTheDay({
    mensaje: req.body.mensaje,
    autor: req.body.autor,
  });
  try {
    const createdPhraseOfTheDay = await phraseOfTheDay.save();
    res.status(201).json(createdPhraseOfTheDay);
  } catch (err) {
    res.status(500).json({
      error: err.message,
      success: false,
    });
  }
};

// Controlador para asignar y retornar una frase motivacional del día al usuario

const getRandomPhraseOfTheDay = async (req, res) => {
  try {
    console.log("Datos del usuario autenticado:", req.auth); // Verifica que req.auth contiene los datos
    const userId = req.auth.userId; // Obtén el ID del usuario desde el token
    const today = moment().format("YYYY-MM-DD"); // Fecha actual en formato YYYY-MM-DD

    // Verificar si el usuario ya tiene una frase asignada para hoy
    const existingUserPhrase = await UserPhrase.findOne({
      userId,
      assignedDate: today,
    }).populate("phraseId");
    if (existingUserPhrase) {
      console.log(
        "Frase ya asignada para el día de hoy:",
        existingUserPhrase.phraseId.mensaje
      );
      return res.send({
        status: "Ok",
        mensaje: existingUserPhrase.phraseId.mensaje,
        autor: existingUserPhrase.phraseId.autor,
      });
    }

    // Obtener la última frase vista por el usuario
    const lastUserPhrase = await UserPhrase.findOne({ userId }).sort({
      assignedDate: -1,
    });
    console.log(
      "Última frase vista por el usuario:",
      lastUserPhrase
        ? lastUserPhrase.phraseId
        : "Ninguna frase asignada anteriormente."
    );

    // Excluir la última frase de la selección aleatoria
    const matchQuery = lastUserPhrase
      ? { _id: { $ne: lastUserPhrase.phraseId } } // Excluye la frase anterior
      : {};

    // Seleccionar una nueva frase aleatoria que no sea la última vista
    const randomPhrase = await PhraseOfTheDay.aggregate([
      { $match: matchQuery },
      { $sample: { size: 1 } }, // Selecciona una frase aleatoria
      { $project: { mensaje: 1, autor: 1 } },
    ]);

    if (randomPhrase.length === 0) {
      console.log("No hay frases disponibles en la base de datos.");
      return res
        .status(404)
        .send({ status: "Error", message: "No hay frases disponibles." });
    }

    console.log("Nueva frase seleccionada:", randomPhrase[0].mensaje);

    // Crear un registro en la colección UserPhrase
    const newUserPhrase = new UserPhrase({
      userId,
      phraseId: randomPhrase[0]._id,
      assignedDate: today,
    });

    await newUserPhrase.save();
    console.log("Frase guardada correctamente en el historial del usuario.");

    // Devolver la frase al cliente
    res.send({
      status: "Ok",
      mensaje: randomPhrase[0].mensaje,
      autor: randomPhrase[0].autor,
    });
  } catch (error) {
    console.error("Error al obtener la frase del día:", error.message);
    return res
      .status(500)
      .send({ status: "Error", error: "Error al obtener la frase del día." });
  }
};

/* const getRandomPhraseOfTheDay = async (req, res) => {
    try {
        const data = await PhraseOfTheDay.aggregate([
            { $sample: { size: 1 } },
            { $project: { mensaje: 1, autor: 1 } }
        ]);
        if (data.length > 0) {
            res.send({ status: "Ok", mensaje: data[0].mensaje, autor: data[0].autor });
        } else {
            res.send({ status: "Error", message: "No phraseOfTheDay found" });
        }
    } catch (error) {
        return res.send({ status: "Error", error: error.message });
    }
}; */

module.exports = {
  getPhraseOfTheDay,
  postPhraseOfTheDay,
  getRandomPhraseOfTheDay,
};
