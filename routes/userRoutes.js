const express = require("express");
const authController = require("./../controllers/authController.js");
const userController = require("./../controllers/userController.js");

const router = express.Router();
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePssswordForCurrentLoginUser
);
router.patch(
  "/updateMyData",
  authController.protect,
  userController.updateMyData
);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

// ONLY ACCESSIBLE TO ADMIN
router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("Admin"),
    userController.getAllUsers
  )
  .post(
    authController.protect,
    authController.restrictTo("Admin"),
    userController.createUser
  );
router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("Admin"),
    userController.updateUser
  )
  .get(
    authController.protect,
    authController.restrictTo("Admin"),
    userController.getUser
  )
  .delete(
    authController.protect,
    authController.restrictTo("Admin"),
    userController.deleteUser
  );

module.exports = router;
