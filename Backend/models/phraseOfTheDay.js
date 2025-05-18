const mongoose = require("mongoose");

const phraseOfTheDaySchema = mongoose.Schema({
  message: String,
  author: String,
});

exports.PhraseOfTheDay = mongoose.model("PhraseOfTheDay", phraseOfTheDaySchema);
