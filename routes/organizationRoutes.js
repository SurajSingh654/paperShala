const express = require("express");
const organizationController = require("./../controllers/organizationController.js");
const authController = require("./../controllers/authController.js");

// Router-level middleware
const router = express.Router({ mergeParams: true });

// --------------------------- NESTED ROUTES ------------------------
// POST users/userId/organizations
router.route("/").post(
  // authController.protect,
  authController.restrictTo("Admin", "OrganizationHead"),
  organizationController.createOrganization
);

// GET users/userId/organizations
router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("Admin"),
    organizationController.getAllOrganizations
  );

// GET users/userId/organizations/organizationId
// DELETE users/userId/organizations/organizationId
// PATCH users/userId/organizations/organizationId
router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("Admin"),
    organizationController.getOrganization
  )
  .delete(
    authController.protect,
    authController.restrictTo("Admin"),
    organizationController.deleteOrganization
  )
  .patch(
    authController.protect,
    authController.restrictTo("Admin"),
    organizationController.updateOrganization
  );

// ------------------------------------------------------------------------
module.exports = router;
