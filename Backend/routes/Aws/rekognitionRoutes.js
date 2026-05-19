const express = require("express");
const multer = require("multer");
const { analyzeFaceEmotions } = require("../../helpers/rekognitionHelper");
const { compareMoodWithEmotion } = require("../../helpers/moodImageComparisonHelper");

const router = express.Router();

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error("Solo se permiten imagenes en formato jpeg, jpg, png o webp.")
    );
  },
});

router.post("/test", upload.single("image"), async (req, res) => {
  try {
    const { mood } = req.body;

    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: "Debe enviar una imagen.",
      });
    }

    if (!mood) {
      return res.status(400).json({
        ok: false,
        message: "Debe enviar un estado de ánimo.",
      });
    }

    const analysis = await analyzeFaceEmotions(req.file.buffer);

    const comparison = compareMoodWithEmotion(
      mood,
      analysis.dominantEmotion
    );

    return res.status(200).json({
      ok: true,
      message: "Imagen procesada correctamente.",
      mood,
      analysis,
      comparison,
    });
  } catch (error) {
    console.error("Error al analizar imagen con Rekognition:", error);

    return res.status(500).json({
      ok: false,
      message: "No se pudo analizar la imagen con Amazon Rekognition.",
    });
  }
});
module.exports = router;
