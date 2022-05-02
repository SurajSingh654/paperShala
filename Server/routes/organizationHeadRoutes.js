const express = require("express");
const authController = require("./../controllers/authController.js");
const organizationHeadController = require("./../controllers/organizationHeadController.js");
const teacherRouter = require("./../routes/teacherRoutes.js");
const studentRouter = require("./../routes/studentRoutes.js");
const organizationRouter = require("./../routes/organizationRoutes.js");
const classRouter = require("./../routes/classRoutes.js");
const examPaperRouter = require("./../routes/examPaperRoutes.js");
const questionRouter = require("./../routes/questionRoutes.js");
const OrganizationHead = require("./../models/organizationHeadModel.js");
const router = express.Router({ mergeParams: true });

// ---------------------------NESTED ROUTES-----------------------------

router.use(
  "/organizations",
  authController.protect(OrganizationHead),
  organizationRouter
);

router.use(
  "/teachers",
  authController.protect(OrganizationHead),
  teacherRouter
);
router.use(
  "/students",
  authController.protect(OrganizationHead),
  studentRouter
);
// router.use("/organizations", organizationRouter);
// router.use("/questions", questionRouter);
// router.use("/classes", classRouter);
// router.use("/examPapers", examPaperRouter);
// ----------------------------------------------------------------------

// ---------------------------- ALL USER AUTHORITY ----------------------
router.post("/signup", authController.signup(OrganizationHead));
router.post("/login", authController.login(OrganizationHead));
router.post("/forgotPassword", authController.forgotPassword(OrganizationHead));
router.patch(
  "/resetPassword/:token",
  authController.resetPassword(OrganizationHead)
);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updateMyPassword(OrganizationHead)
);
router.patch(
  "/updateMyData",
  authController.protect(OrganizationHead),
  organizationHeadController.updateMyData
);
router.patch(
  "/addMyOrganization",
  authController.protect(OrganizationHead),
  organizationHeadController.addMyOrganization
);
router.get(
  "/getMyData",
  authController.protect(OrganizationHead),
  organizationHeadController.getMyData
);
router.get(
  "/getAllTeachersAndStudents",
  authController.protect(OrganizationHead),
  organizationHeadController.getAllTeachersAndStudents
);
router.delete(
  "/deleteMe",
  authController.protect(OrganizationHead),
  organizationHeadController.deleteMe
);
router.get(
  "/organizationDetails",
  authController.protect(OrganizationHead),
  organizationHeadController.collegeDetails
);

module.exports = router;
