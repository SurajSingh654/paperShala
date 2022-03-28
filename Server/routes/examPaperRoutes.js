const express = require("express");
const examPaperController = require("./../controllers/examPaperController.js");
const authController = require("./../controllers/authController.js");

// Router-level middleware
const router = express.Router({ mergeParams: true });

// router.route("/").get(examPaperController.getAllExamPapers);
router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("Teacher"),
    examPaperController.setTeacherId_OrganizationId_ClassId,
    examPaperController.createExamPaper
  );

// GET users/userId/organizations
router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("Teacher"),
    examPaperController.getAllExamPapers
  );

// GET users/userId/organizations/organizationId
// DELETE users/userId/organizations/organizationId
// PATCH users/userId/organizations/organizationId
router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("Teacher"),
    examPaperController.getExamPaper
  )
  .delete(
    authController.protect,
    authController.restrictTo("Teacher"),
    examPaperController.deleteExamPaper
  )
  .patch(
    authController.protect,
    authController.restrictTo("Teacher"),
    examPaperController.updateExamPaper
  );
module.exports = router;
