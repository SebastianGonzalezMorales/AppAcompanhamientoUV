const mongoose = require("mongoose");

const moodStateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  moodState: {
    type: String,
    required: true,
  },
  intensity: {
    type: Number,
    required: true,
  },
  activities: {
    type: [String],
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  comments: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

exports.MoodState = mongoose.model("MoodState", moodStateSchema);
exports.moodStateSchema = moodStateSchema;
