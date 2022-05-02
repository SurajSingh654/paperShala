const express = require("express");
const authController = require("./../controllers/authController.js");
const organizationController = require("./../controllers/organizationController.js");
const teacherController = require("./../controllers/teacherController.js");
const studentRouter = require("./../routes/studentRoutes.js");
const organizationRouter = require("./../routes/organizationRoutes.js");
const classRouter = require("./../routes/classRoutes.js");
const examPaperRouter = require("./../routes/examPaperRoutes.js");
const questionRouter = require("./../routes/questionRoutes.js");
const Teacher = require("./../models/teacherModel.js");
const Admin = require("./../models/adminModel.js");
const router = express.Router({ mergeParams: true });

// ---------------------------NESTED ROUTES-----------------------------
router.use("/students", authController.protect(Teacher), studentRouter);
router.use(
  "/organizations",
  authController.protect(Teacher),
  organizationRouter
);
// router.use("/questions", questionRouter);
router.use("/classes", authController.protect(Teacher), classRouter);
// router.use("/examPapers", examPaperRouter);
// ----------------------------------------------------------------------

// ---------------------------- ALL USER AUTHORITY ----------------------
router.post("/signup", authController.signup(Teacher));
router.post("/login", authController.login(Teacher));
router.post("/forgotPassword", authController.forgotPassword(Teacher));
router.patch("/resetPassword/:token", authController.resetPassword(Teacher));
router.patch(
  "/updateMyPassword",
  authController.protect(Teacher),
  authController.updateMyPassword(Teacher)
);
router.patch(
  "/updateMyData",
  authController.protect(Teacher),
  teacherController.updateMyData
);
router.get(
  "/getMyData",
  authController.protect(Teacher),
  teacherController.getMyData
);
router.delete(
  "/deleteMe",
  authController.protect(Teacher),
  teacherController.deleteMe
);

router.get(
  "/organizations",
  authController.protect(Teacher),
  organizationController.getOrganization
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
    teacherController.getAllTeachers
  );
//   .post(
//     authController.protect,
//     authController.restrictTo("Admin"),
//     teacherController.createUser
//   );
router
  .route("/:id")
  //   .patch(
  //     authController.protect,
  //     authController.restrictTo("Admin"),
  //     teacherController.updateUser
  //   )
  .get(
    authController.restrictTo("Admin Teacher Student OrganizationHead"),
    teacherController.getTeacher
  );
//   .delete(
//     authController.protect,
//     authController.restrictTo("Admin"),
//     teacherController.deleteUser
//   );
// --------------------------------------------------------------------

module.exports = router;
