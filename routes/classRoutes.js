const express = require("express");
const classController = require("./../controllers/classController.js");

// Router-level middleware
const router = express.Router();

router.route("/").get(classController.getAllClasses);
module.exports = router;
