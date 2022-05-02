const OrganizationHead = require("./../models/organizationHeadModel.js");
const Teacher = require("./../models/teacherModel.js");
const Student = require("./../models/studentModel.js");
const APIFeatures = require("./../utils/APIFeatures.js");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError.js");
const Organization = require("./../models/organizationModel.js");
const factory = require("./../controllers/CRUDfactoryController.js");
const filteredOptions =
  ("firstName",
  "middleName",
  "lastName",
  "category",
  "address",
  "gender",
  "photo",
  "phoneNumber",
  "emailId",
  "organization");

exports.getMyData = factory.getMyData(OrganizationHead);
exports.deleteMe = factory.deleteMe(OrganizationHead);
exports.updateMyData = factory.updateMyData(OrganizationHead, filteredOptions);
exports.addMyOrganization = catchAsync(async (req, res, next) => {
  // Build Query
  const organization = await Organization.findOne({
    organizationHead: req.user.id,
  });
  req.body.organization = organization.id;
  const doc = await OrganizationHead.findByIdAndUpdate(req.user.id, req.body);
  res.status(200).json({
    status: "success",
    totalData: doc.length,
    data: { doc },
  });
});

exports.getAllTeachersAndStudents = factory.getAllTeachersAndStudents;
exports.getAllStudentsBasedOnTeacher = factory.getAllStudentsBasedOnTeacher;
exports.collegeDetails = catchAsync(async (req, res, next) => {
  const users = await Teacher.aggregate([
    {
      $project: {
        firstName: 1,
        middleName: 1,
        lastName: 1,
        emailId: 1,
        phoneNumber: 1,
        organization: 1,
        category: 1,
        _id: 0,
      },
    },
    // {
    //   $unionWith: {
    //     coll: "teachers",
    //     pipeline: [
    //       {
    //         $project: {
    //           firstName: 1,
    //           middleName: 1,
    //           lastName: 1,
    //           emailId: 1,
    //           phoneNumber: 1,
    //           organization: 1,
    //           category: 1,
    //           _id: 0,
    //         },
    //       },
    //     ],
    //   },
    // },
    {
      $unionWith: {
        coll: "students",
        pipeline: [
          {
            $project: {
              firstName: 1,
              middleName: 1,
              lastName: 1,
              emailId: 1,
              phoneNumber: 1,
              organization: 1,
              category: 1,
              _id: 0,
            },
          },
        ],
      },
    },
    {
      $match: { organization: req.user.organization },
    },
    {
      $group: {
        _id: "$category",
        Persons: {
          $push: {
            $concat: ["$firstName", " ", "$middleName", " ", "$lastName"],
          },
        },
      },
    },
    {
      $addFields: { category: "$_id" },
    },
    {
      $project: { _id: 0 },
    },
  ]);

  // console.log(users);
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
  // next();
});
