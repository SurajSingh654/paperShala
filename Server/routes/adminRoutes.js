const express = require("express");
const authController = require("./../controllers/authController.js");
const adminController = require("./../controllers/adminController.js");
const teacherController = require("./../controllers/teacherController.js");
const teacherRouter = require("./../routes/teacherRoutes.js");
const studentRouter = require("./../routes/studentRoutes.js");
const organizationRouter = require("./../routes/organizationRoutes.js");
const organizationHeadRouter = require("./../routes/organizationHeadRoutes.js");
const classRouter = require("./../routes/classRoutes.js");
const examPaperRouter = require("./../routes/examPaperRoutes.js");
const questionRouter = require("./../routes/questionRoutes.js");
const Admin = require("./../models/adminModel.js");
const router = express.Router();

// ---------------------------NESTED ROUTES-----------------------------

// router.use("/organizations", organizationRouter);
// router.use("/questions", questionRouter);
// router.use("/classes", classRouter);
// router.use("/examPapers", examPaperRouter);
router.use(
  "/organizationHeads",
  authController.protect(Admin),
  organizationHeadRouter
);
router.use("/teachers", authController.protect(Admin), teacherRouter);
router.use("/students", authController.protect(Admin), studentRouter);
// ----------------------------------------------------------------------

// ---------------------------- ALL USER AUTHORITY ----------------------
router.get(
  "/details",
  authController.protect(Admin),
  adminController.organizationDetails
);
router.post("/signup", authController.signup(Admin));
router.post("/login", authController.login(Admin));
router.post("/forgotPassword", authController.forgotPassword(Admin));
router.patch("/resetPassword/:token", authController.resetPassword(Admin));
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updateMyPassword(Admin)
);
router.patch(
  "/updateMyData",
  authController.protect(Admin),
  adminController.updateMyData
);
router.get(
  "/getMyData",
  authController.protect(Admin),
  adminController.organizationDetails,
  adminController.getMyData
);

router.delete(
  "/deleteMe",
  authController.protect(Admin),
  adminController.deleteMe
);
// router.get(
//   "/teachers",
//   authController.protect(Admin),
//   teacherController.getAllTeachers
// );
// router.get(
//   "/teachers/:id",
//   authController.protect(Admin),
//   teacherController.getTeacher
// );
// ----------------------------------------------------------------------

// ----------------------- ONLY ACCESSIBLE TO ADMIN -----------------------
router;
// .route("/")
// .get(
//   authController.protect,
//   authController.restrictTo("Admin"),
//   adminController.getAllUsers
// )
//   .post(
//     authController.protect,
//     authController.restrictTo("Admin"),
//     adminController.createUser
//   );
// router
// .route("/teachers")
//   .patch(
//     authController.protect,
//     authController.restrictTo("Admin"),
//     adminController.updateUser
//   )
// .get(
//   authController.protect(Admin),
//   authController.restrictTo("Admin"),
//   teacherController.getAllTeachers
// );
//   .delete(
//     authController.protect,
//     authController.restrictTo("Admin"),
//     adminController.deleteUser
//   );
// --------------------------------------------------------------------

module.exports = router;
