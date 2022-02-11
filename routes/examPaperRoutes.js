const express = require("express");
const examPaperController = require("./../controllers/examPaperController.js");

// Router-level middleware
const router = express.Router();

router.route("/").get(examPaperController.getAllExamPapers);
module.exports = router;
