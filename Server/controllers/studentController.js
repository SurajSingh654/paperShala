const Student = require("./../models/studentModel.js");
const APIFeatures = require("./../utils/APIFeatures.js");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError.js");
const Organization = require("./../models/organizationModel.js");
const factory = require("./../controllers/CRUDfactoryController.js");
const filteredOptions = [
  "firstName",
  "middleName",
  "lastName",
  "category",
  "address",
  "gender",
  "photo",
  "phoneNumber",
  "emailId",
  "organization",
  "teachers",
];

exports.getMyData = factory.getMyData(Student);
exports.deleteMe = factory.deleteMe(Student);
exports.updateMyData = factory.updateMyData(Student, filteredOptions);
exports.getAllStudents = catchAsync(async (req, res, next) => {
  // Build Query
  // let filter = { teacher: req.user.id };
  // if (req.params.organizationId)
  //   filter = {
  //     ...filter,
  //     organization: req.params.organizationId,
  //   };
  // if (req.params.classId)
  //   filter = {
  //     ...filter,
  //     class: req.params.classId,
  //   };
  // if (req.params.questionId)
  //   filter = {
  //     ...filter,
  //     class: req.params.questionId,
  //   };
  // const features = new APIFeatures(Model.find(filter), req.query)
  //   .filter()
  //   .sort()
  //   .paginate()
  //   .limitFields();
  // // Execute Query
  // const doc = await features.query;
  // const doc = await Model.find();
  const doc = await Student.find({
    organization: req.user.organization,
  });
  res.status(200).json({
    status: "success",
    totalData: doc.length,
    data: { doc },
  });
});

exports.getStudent = catchAsync(async (req, res, next) => {
  // Build Query
  // let filter = { teacher: req.user.id };
  // if (req.params.organizationId)
  //   filter = {
  //     ...filter,
  //     organization: req.params.organizationId,
  //   };
  // if (req.params.classId)
  //   filter = {
  //     ...filter,
  //     class: req.params.classId,
  //   };
  // if (req.params.questionId)
  //   filter = {
  //     ...filter,
  //     class: req.params.questionId,
  //   };
  // const features = new APIFeatures(Model.find(filter), req.query)
  //   .filter()
  //   .sort()
  //   .paginate()
  //   .limitFields();
  // // Execute Query
  // const doc = await features.query;
  // const doc = await Model.find();
  const doc = await Student.find({ _id: req.params.id });
  res.status(200).json({
    status: "success",
    totalData: doc.length,
    data: { doc },
  });
});
