const express = require("express");
const organizationController = require("./../controllers/organizationController.js");
const authController = require("./../controllers/authController.js");
const classRouter = require("./../routes/classRoutes.js");
const examPaperRouter = require("./../routes/examPaperRoutes.js");

// Router-level middleware
const router = express.Router({ mergeParams: true });
router.use("/classes", classRouter);
router.use("/:organizationId/examPapers", examPaperRouter);

// --------------------------- NESTED ROUTES ------------------------
// POST users/userId/organizations
router
  .route("/")
  .post(
    authController.restrictTo("OrganizationHead"),
    organizationController.createMyOrganization
  );

router
  .route("/")
  .get(
    authController.restrictTo("OrganizationHead"),
    organizationController.getMyOrganization
  )
  .patch(
    authController.restrictTo("OrganizationHead"),
    organizationController.updateMyOrganization
  )
  .delete(
    authController.restrictTo("OrganizationHead"),
    organizationController.deleteMyOrganization
  );

// // GET users/userId/organizations/organizationId
// // DELETE users/userId/organizations/organizationId
// // PATCH users/userId/organizations/organizationId
// router
//   .route("/:id")
//   .get(
//     authController.protect,
//     authController.restrictTo("Teacher", "Student"),
//     organizationController.getOrganization
//   );

// ------------------------------------------------------------------------
module.exports = router;
