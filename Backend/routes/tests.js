const express = require("express");
const router = express.Router();
const { createTest } = require("../controllers/tests");

// Rutas asociadas a cada controlador

router.post("/", createTest);

module.exports = router;
