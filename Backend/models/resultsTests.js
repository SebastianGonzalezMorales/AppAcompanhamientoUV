const mongoose = require("mongoose");

const resultsTestsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  totalScore: {
    type: Number,
    required: true,
  },
  severity: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

exports.ResultsTests = mongoose.model("resultsTests", resultsTestsSchema);
exports.resultsTestsSchema = resultsTestsSchema;
