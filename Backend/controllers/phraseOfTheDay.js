// controllers/phraseOfTheDay.js
const { PhraseOfTheDay } = require("../models/phraseOfTheDay");
const { UserPhrase }   = require("../models/userPhrase");
const moment           = require("moment");

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
    author:  req.body.author,
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
    const today  = process.env.TEST_DATE || moment().format("YYYY-MM-DD");
    // 1. Si ya hay frase para hoy, la devolvemos
    const existing = await UserPhrase
      .findOne({ userId, assignedDate: today })
      .populate("phraseId", "message author");
    if (existing) {
      return res.send({
        status:  "Ok",
        message: existing.phraseId.message,
        author:  existing.phraseId.author
      });
    }

    // 2. Cargamos todas las frases y el historial completo del usuario
    const allPhrases  = await PhraseOfTheDay.find({}, "_id message author").lean();
    const seenRecords = await UserPhrase.find({ userId }, "phraseId").lean();
    const seenIds     = seenRecords.map(r => r.phraseId.toString());

    // 3. Filtrar las frases que el usuario aún no ha visto
    const unseen = allPhrases.filter(f => !seenIds.includes(f._id.toString()));

    // 4. Si no quedan frases nuevas, informamos al usuario
    if (unseen.length === 0) {
      return res.send({
        status:  "Ok",
message: "🚀 ¡Felicidades! Has recorrido todas nuestras frases. Pronto cargaremos más para ti. 🔜",
        author:  " "
      });
    }

    // 5. Elegir aleatoriamente de las no vistas
    const choice = unseen[Math.floor(Math.random() * unseen.length)];

    // 6. Guardar en historial
    await new UserPhrase({
      userId,
      phraseId:     choice._id,
      assignedDate: today
    }).save();

    // 7. Devolver la frase escogida
    return res.send({
      status:  "Ok",
      message: choice.message,
      author:  choice.author
    });

  } catch (err) {
    console.error("Error al obtener frase del día:", err);
    return res.status(500).send({ status: "Error", error: err.message });
  }
};

module.exports = {
  getPhraseOfTheDay,
  postPhraseOfTheDay,
  getRandomPhraseOfTheDay,
};
