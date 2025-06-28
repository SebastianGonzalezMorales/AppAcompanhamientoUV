const Test = require("../models/tests");

const createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body); // { code, name, description }
    res.status(201).json(test);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createTest };
