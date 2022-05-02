const Admin = require("./../models/adminModel.js");
const APIFeatures = require("./../utils/APIFeatures.js");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError.js");
const Organization = require("./../models/organizationModel.js");
const factory = require("./../controllers/CRUDfactoryController.js");
const OrganizationHead = require("./../models/organizationHeadModel.js");

const Teacher = require("./../models/teacherModel.js");
const filteredOptions =
  ("firstName",
  "middleName",
  "lastName",
  "category",
  "address",
  "gender",
  "photo",
  "phoneNumber",
  "emailId");

exports.getMyData = factory.getMyData(Admin);
exports.updateMyData = factory.updateMyData(Admin, filteredOptions);
exports.deleteMe = factory.deleteMe(Admin);
exports.organizationDetails = catchAsync(async (req, res, next) => {
  const users = await OrganizationHead.aggregate([
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
    {
      $unionWith: {
        coll: "teachers",
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
      $group: {
        _id: {
          organization: "$organization",
        },
        Persons: {
          $push: {
            name: {
              $concat: ["$firstName", " ", "$middleName", " ", "$lastName"],
            },
            category: "$category",
          },
        },
      },
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
