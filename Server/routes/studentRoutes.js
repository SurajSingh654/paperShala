const express = require("express");
const authController = require("./../controllers/authController.js");
const studentController = require("./../controllers/studentController.js");
const teacherRouter = require("./../routes/teacherRoutes.js");
const organizationRouter = require("./../routes/organizationRoutes.js");
const classRouter = require("./../routes/classRoutes.js");
const examPaperRouter = require("./../routes/examPaperRoutes.js");
const questionRouter = require("./../routes/questionRoutes.js");
const Student = require("./../models/studentModel.js");
const router = express.Router({ mergeParams: true });

// ---------------------------NESTED ROUTES-----------------------------
// router.use("/teachers", authController.protect(Student), teacherRouter);
// router.use("/organizations", organizationRouter);
// router.use("/questions", questionRouter);
// router.use("/classes", classRouter);
// router.use("/examPapers", examPaperRouter);
// ----------------------------------------------------------------------

// ---------------------------- ALL USER AUTHORITY ----------------------
router.post("/signup", authController.signup(Student));
router.post("/login", authController.login(Student));
router.post("/forgotPassword", authController.forgotPassword(Student));
router.patch("/resetPassword/:token", authController.resetPassword(Student));
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updateMyPassword(Student)
);
router.patch(
  "/updateMyData",
  authController.protect(Student),
  studentController.updateMyData
);
router.get(
  "/getMyData",
  authController.protect(Student),
  studentController.getMyData
);
router.delete(
  "/deleteMe",
  authController.protect(Student),
  studentController.deleteMe
);
// ----------------------------------------------------------------------

// ----------------------- ONLY ACCESSIBLE TO ADMIN -----------------------
router
  .route("/")
  .get(
    authController.restrictTo(
      "Admin",
      "Teacher",
      "OrganizationHead",
      "Student"
    ),
    studentController.getAllStudents
  )
  //   .post(
  //     authController.protect,
  //     authController.restrictTo("Admin"),
  //     studentController.createUser
  //   );
  // router
  //   .route("/:id")
  //   .patch(
  //     authController.protect,
  //     authController.restrictTo("Admin"),
  //     studentController.updateUser
  //   )
  .get(
    authController.restrictTo("Admin OrganizationHead Teacher Student"),
    studentController.getStudent
  );
//   .delete(
//     authController.protect,
//     authController.restrictTo("Admin"),
//     studentController.deleteUser
//   );
// --------------------------------------------------------------------

module.exports = router;
