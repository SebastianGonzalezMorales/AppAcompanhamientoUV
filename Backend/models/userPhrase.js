const mongoose = require("mongoose");

const userPhraseSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  phraseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PhraseOfTheDay",
    required: true,
  },
  assignedDate: { type: String, required: true }, // Fecha en formato YYYY-MM-DD
});

exports.UserPhrase = mongoose.model("UserPhrase", userPhraseSchema);
