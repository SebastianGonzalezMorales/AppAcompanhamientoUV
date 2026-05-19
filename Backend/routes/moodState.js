const express = require('express');
const multer = require("multer");
const router = express.Router();
const {
  getMoodStates,
  postMoodState,
  postMoodStateWithImage,
  getMoodStatesByUserId,
  getMoodStateById,
  calculateWeeklyStreak,
} = require('../controllers/moodState');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    req.moodImageUploadError = new Error(
      "Solo se permiten imágenes en formato jpeg, jpg, png o webp."
    );
    return cb(null, false);
  },
});

const uploadMoodImage = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      req.moodImageUploadError = error;
    }

    next();
  });
};

// Rutas asociadas a cada controlador
router.get('/get-moodState', getMoodStates);
router.post('/post-moodState', postMoodState); 
router.post('/post-moodState-with-image', uploadMoodImage, postMoodStateWithImage);
router.get('/get-MoodStatesByUserId', getMoodStatesByUserId);
router.get('/get-MoodStatesById/:id', getMoodStateById);
router.get('/calculateStreak', calculateWeeklyStreak);

module.exports = router;
