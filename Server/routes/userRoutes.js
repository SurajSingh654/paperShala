const express = require("express");
const authController = require("./../controllers/authController.js");
const userController = require("./../controllers/userController.js");
const organizationRouter = require("./../routes/organizationRoutes.js");
const classRouter = require("./../routes/classRoutes.js");
const examPaperRouter = require("./../routes/examPaperRoutes.js");
const questionRouter = require("./../routes/questionRoutes.js");

const router = express.Router();

// ---------------------------NESTED ROUTES-----------------------------

router.use("/organizations", organizationRouter);
router.use("/questions", questionRouter);
router.use("/classes", classRouter);
router.use("/examPapers", examPaperRouter);
// ----------------------------------------------------------------------

// ---------------------------- ALL USER AUTHORITY ----------------------
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updateMyPassword
);
router.patch(
  "/updateMyData",
  authController.protect,
  userController.updateMyData
);
router.get("/getMyData", authController.protect, userController.getMyData);
router.delete("/deleteMe", authController.protect, userController.deleteMe);
// ----------------------------------------------------------------------

// ----------------------- ONLY ACCESSIBLE TO ADMIN -----------------------
// router
//   .route("/")
//   .get(
//     authController.protect,
//     authController.restrictTo("Admin"),
//     userController.getAllUsers
//   )
//   .post(
//     authController.protect,
//     authController.restrictTo("Admin"),
//     userController.createUser
//   );
// router
//   .route("/:id")
//   .patch(
//     authController.protect,
//     authController.restrictTo("Admin"),
//     userController.updateUser
//   )
//   .get(
//     authController.protect,
//     authController.restrictTo("Admin"),
//     userController.getUser
//   )
//   .delete(
//     authController.protect,
//     authController.restrictTo("Admin"),
//     userController.deleteUser
//   );
// --------------------------------------------------------------------

module.exports = router;
