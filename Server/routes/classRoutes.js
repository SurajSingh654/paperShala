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
    authController.protect,
    authController.restrictTo("Teacher"),
    classController.getAllClasses
  )
  .post(
    authController.protect,
    authController.restrictTo("Teacher"),
    classController.setTeacherId_OrganizationId,
    classController.createClass
  );
router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("Teacher", "Student"),
    classController.getClass
  )
  .delete(
    authController.protect,
    authController.restrictTo("Teacher"),
    classController.deleteClass
  )
  .patch(
    authController.protect,
    authController.restrictTo("Teacher"),
    classController.updateClass
  );
module.exports = router;
