const express = require("express");
const teacherController = require("./../controllers/teacherController.js");

// Router-level middleware
const router = express.Router();
// route handler
// The app.route() function returns an instance of a single route, which you can then use to handle HTTP verbs with optional middleware. Use app.route() to avoid duplicate route names (and thus typo errors).

// Parameter mapping is used to provide pre-conditions to routes which use normalized placeholders. For example a :user_id parameter could automatically load a user's information from the database without any additional code,

// The callback uses the samesignature as middleware, the only differencing being that the value of the placeholder is passed, in this case the id of the user. Once the next() function is invoked, just like middleware it will continue on to execute the route, or subsequent parameter functions.

router.param("id", teacherController.checkId);

router
  .route("/")
  .get(teacherController.getAllTeachers)
  .post(teacherController.checkBody, teacherController.createNewTeacher);
router
  .route("/:id")
  .get(teacherController.getTeacherById)
  .patch(teacherController.updateTeacherById)
  .delete(teacherController.deleteTeacherById);

module.exports = router;
