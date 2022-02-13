const express = require("express");
const classController = require("./../controllers/classController.js");
const authController = require("./../controllers/authController.js");

// Router-level middleware
const router = express.Router();

router
  .route("/")
  .get(
    // authController.protect,
    // authController.restrictTo("Teacher", "Student"),
    classController.getAllClasses
  )
  .post(
    // authController.protect,
    // authController.restrictTo("Teacher", "Student"),
    classController.createClass
  );
router
  .route("/:id")
  .get(
    // authController.protect,
    // authController.restrictTo("Teacher", "Student"),
    classController.getClass
  )
  .delete(
    // authController.protect,
    // authController.restrictTo("Teacher", "Student"),
    classController.deleteClass
  )
  .patch(
    // authController.protect,
    // authController.restrictTo("Teacher", "Student"),
    classController.updateClass
  );
module.exports = router;
