const express = require("express");
const questionController = require("./../controllers/questionController.js");

// Router-level middleware
const router = express.Router();

router.route("/").get(questionController.getAllQuestions);
module.exports = router;
