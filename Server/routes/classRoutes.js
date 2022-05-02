const express = require("express");
const classController = require("./../controllers/classController.js");
const authController = require("./../controllers/authController.js");
const questionRouter = require("./../routes/questionRoutes.js");
const examPaperRouter = require("./../routes/examPaperRoutes.js");

// Router-level middleware
const router = express.Router({ mergeParams: true });
router.use("/:classId/questions", questionRouter);
router.use("/:classId/examPapers", examPaperRouter);
router
  .route("/")
  .get(
    authController.restrictTo("Teacher", "OrganizationHead"),
    classController.getAllClasses
  )
  .post(
    authController.restrictTo("Teacher"),
    classController.setTeacherIdAndOrganizationId,
    classController.createClass
  );
router
  .route("/:id")
  .get(
    authController.restrictTo("Teacher", "Student", "OrganizationHead"),
    classController.getClass
  )
  .delete(authController.restrictTo("Teacher"), classController.deleteClass)
  .patch(authController.restrictTo("Teacher"), classController.updateClass);
module.exports = router;
