const Teacher = require("./../models/teacherModel.js");
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
exports.getMyData = factory.getMyData(Teacher);
exports.updateMyData = factory.updateMyData(Teacher, filteredOptions);
exports.deleteMe = factory.deleteMe(Teacher);
exports.getAllMyClasses = catchAsync(async (req, res, next) => {
  // Build Query
  const features = new APIFeatures(Model.find(), req.query)
    .populate("classes")
    .filter()
    .sort()
    .paginate()
    .limitFields();
  // Execute Query
  const doc = await features.query;
  // const doc = await Model.find();
  res.status(200).json({
    status: "success",
    totalData: doc.length,
    data: { doc },
  });
});
exports.getAllTeachers = catchAsync(async (req, res, next) => {
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
  const doc = await Teacher.find({
    organization: await Organization.find({ organizationHead: req.user.id }),
  });
  res.status(200).json({
    status: "success",
    totalData: doc.length,
    data: { doc },
  });
});

exports.getTeacher = catchAsync(async (req, res, next) => {
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
  const doc = await Teacher.find({ _id: req.params.id });
  res.status(200).json({
    status: "success",
    totalData: doc.length,
    data: { doc },
  });
});
