const express = require("express");
const questionController = require("./../controllers/questionController.js");
const authController = require("./../controllers/authController.js");
// Router-level middleware
const router = express.Router({ mergeParams: true });
router
  .route("/")
  .get(authController.restrictTo("Teacher"), questionController.getAllQuestions)
  .post(
    authController.restrictTo("Teacher"),
    questionController.setTeacherId_ClassId,
    questionController.createQuestion
  );
router
  .route("/:id")
  .patch(
    authController.restrictTo("Teacher"),
    questionController.updateQuestion
  )
  .get(authController.restrictTo("Teacher"), questionController.getQuestion)
  .delete(
    authController.restrictTo("Teacher"),
    questionController.deleteQuestion
  );

module.exports = router;
