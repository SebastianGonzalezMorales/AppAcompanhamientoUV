const mongoose = require("mongoose");

const imageAnalysisSchema = new mongoose.Schema(
  {
    hasImage: {
      type: Boolean,
      required: false,
    },
    faceDetected: {
      type: Boolean,
      required: false,
    },
    dominantEmotion: {
      type: String,
      required: false,
      default: null,
    },
    confidence: {
      type: Number,
      required: false,
      default: null,
    },
    emotions: [
      {
        type: {
          type: String,
          required: false,
        },
        confidence: {
          type: Number,
          required: false,
        },
      },
    ],
    comparisonResult: {
      type: String,
      required: false,
      default: null,
    },
    supportMessage: {
      type: String,
      required: false,
      default: null,
    },
    analyzedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  { _id: false }
);

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
  imageAnalysis: {
    type: imageAnalysisSchema,
    required: false,
    default: undefined,
  },
});

exports.MoodState = mongoose.model("MoodState", moodStateSchema);
exports.moodStateSchema = moodStateSchema;
