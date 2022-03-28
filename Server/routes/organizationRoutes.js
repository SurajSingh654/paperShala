const express = require("express");
const organizationController = require("./../controllers/organizationController.js");
const authController = require("./../controllers/authController.js");
const classRouter = require("./../routes/classRoutes.js");
const examPaperRouter = require("./../routes/examPaperRoutes.js");

// Router-level middleware
const router = express.Router({ mergeParams: true });
router.use("/:organizationId/classes", classRouter);
router.use("/:organizationId/examPapers", examPaperRouter);

// --------------------------- NESTED ROUTES ------------------------
// POST users/userId/organizations
router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("OrganizationHead"),
    organizationController.setOrganizationHeadId,
    organizationController.createOrganization
  );

// GET users/userId/organizations
// router
//   .route("/")
//   .get(
//     authController.protect,
//     authController.restrictTo("Teacher"),
//     organizationController.getAllOrganizations
//   );

// // GET users/userId/organizations/organizationId
// // DELETE users/userId/organizations/organizationId
// // PATCH users/userId/organizations/organizationId
// router
//   .route("/:id")
//   .get(
//     authController.protect,
//     authController.restrictTo("Teacher", "OrganizationHead"),
//     organizationController.getOrganization
//   )
//   .delete(
//     authController.protect,
//     authController.restrictTo("OrganizationHead"),
//     organizationController.deleteOrganization
//   )
//   .patch(
//     authController.protect,
//     authController.restrictTo("OrganizationHead"),
//     organizationController.updateOrganization
//   );

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("OrganizationHead"),
    organizationController.getMyOrganization
  )
  .patch(
    authController.protect,
    authController.restrictTo("OrganizationHead"),
    organizationController.updateMyOrganization
  )
  .delete(
    authController.protect,
    authController.restrictTo("OrganizationHead"),
    organizationController.deleteMyOrganization
  );

// ------------------------------------------------------------------------
module.exports = router;
