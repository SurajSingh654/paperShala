const express = require("express");
const teacherController = require("./../controllers/teacherController.js");

// Router-level middleware
const router = express.Router();
// route handler
// The app.route() function returns an instance of a single route, which you can then use to handle HTTP verbs with optional middleware. Use app.route() to avoid duplicate route names (and thus typo errors).

router
  .route("/")
  .get(teacherController.getAllTeachers)
  .post(teacherController.createNewTeacher);
router
  .route("/:id")
  .get(teacherController.getTeacherById)
  .patch(teacherController.updateTeacherById)
  .delete(teacherController.deleteTeacherById);

module.exports = router;
