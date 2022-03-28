const express = require("express");
const questionController = require("./../controllers/questionController.js");
const authController = require("./../controllers/authController.js");
// Router-level middleware
const router = express.Router({ mergeParams: true });
router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("Teacher"),
    questionController.getAllQuestions
  )
  .post(
    authController.protect,
    authController.restrictTo("Teacher"),
    questionController.setTeacherId_OrganizationId_ClassId,
    questionController.createQuestion
  );
router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("Teacher"),
    questionController.updateQuestion
  )
  .get(
    authController.protect,
    authController.restrictTo("Teacher"),
    questionController.getQuestion
  )
  .delete(
    authController.protect,
    authController.restrictTo("Teacher"),
    questionController.deleteQuestion
  );

module.exports = router;
