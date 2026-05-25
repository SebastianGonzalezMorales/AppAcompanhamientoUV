// controllers/phraseOfTheDay.js
const { PhraseOfTheDay } = require("../models/phraseOfTheDay");
const { UserPhrase } = require("../models/userPhrase");
const moment = require("moment");

const getOrAssignPhraseOfTheDayForUser = async (userId) => {
  const today = process.env.TEST_DATE || moment().format("YYYY-MM-DD");

  const existing = await UserPhrase.findOne({
    userId,
    assignedDate: today,
  })
    .populate("phraseId", "message author")
    .lean();

  if (existing?.phraseId) {
    return {
      phrase: {
        message: existing.phraseId.message,
        author: existing.phraseId.author,
      },
      reason: null,
    };
  }

  const allPhrases = await PhraseOfTheDay.find({}, "_id message author").lean();

  if (allPhrases.length === 0) {
    return {
      phrase: null,
      reason: "empty_catalog",
    };
  }

  const seenEntries = await UserPhrase.find({ userId }, "phraseId").lean();
  const seenIds = new Set(
    seenEntries.map((record) => record.phraseId.toString())
  );
  const unseen = allPhrases.filter(
    (phrase) => !seenIds.has(phrase._id.toString())
  );

  if (unseen.length === 0) {
    return {
      phrase: null,
      reason: "catalog_exhausted",
    };
  }

  const choice = unseen[Math.floor(Math.random() * unseen.length)];

  await new UserPhrase({
    userId,
    phraseId: choice._id,
    assignedDate: today,
  }).save();

  return {
    phrase: {
      message: choice.message,
      author: choice.author,
    },
    reason: null,
  };
};

// Controlador para obtener todos los phraseOfTheDay
const getPhraseOfTheDay = async (req, res) => {
  try {
    const list = await PhraseOfTheDay.find();
    if (!list) {
      return res.status(500).json({ success: false });
    }
    res.send(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para crear un nuevo tip
const postPhraseOfTheDay = async (req, res) => {
  const phrase = new PhraseOfTheDay({
    message: req.body.message,
    author: req.body.author,
  });
  try {
    const created = await phrase.save();
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

// Controlador para asignar y retornar una frase motivacional del día al usuario
const getRandomPhraseOfTheDay = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const phraseResult = await getOrAssignPhraseOfTheDayForUser(userId);

    if (phraseResult.phrase) {
      return res.send({
        status: "Ok",
        message: phraseResult.phrase.message,
        author: phraseResult.phrase.author,
      });
    }

    if (phraseResult.reason === "empty_catalog") {
      return res.send({
        status: "Ok",
        message:
          "¡Hola! Aún no tenemos frases para ti, pero muy pronto las estaremos cargando. 😊",
        author: " ",
      });
    }

    if (phraseResult.reason === "catalog_exhausted") {
      return res.send({
        status: "Ok",
        message:
          "🚀 ¡Felicidades! Has recorrido todas nuestras frases. Pronto cargaremos más para ti. 🔜",
        author: " ",
      });
    }

    return res.send({
      status: "Ok",
      message: "Tienes una nueva frase positiva disponible en la aplicación.",
      author: " ",
    });
  } catch (err) {
    console.error("Error al obtener frase del día:", err);
    return res.status(500).send({ status: "Error", error: err.message });
  }
};

module.exports = {
  getPhraseOfTheDay,
  getOrAssignPhraseOfTheDayForUser,
  postPhraseOfTheDay,
  getRandomPhraseOfTheDay,
};
