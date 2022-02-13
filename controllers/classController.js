const Class = require("./../models/classModel.js");
const APIFeatures = require("./../utils/APIFeatures.js");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError.js");
exports.getAllClasses = catchAsync(async (req, res, next) => {
  // Build Query
  const features = new APIFeatures(Class.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields();
  // Execute Query
  const classes = await features.query;
  res.status(200).json({
    status: "success",
    totalData: classes.length,
    data: { classes },
  });
});
exports.getClass = catchAsync(async (req, res, next) => {
  const myClass = await Class.findById(req.params.id);
  if (!myClass) {
    return next(new AppError("No class found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      myClass,
    },
  });
});
exports.createClass = catchAsync(async (req, res, next) => {
  const newClass = await Class.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      class: newClass,
    },
  });
});
exports.deleteClass = catchAsync(async (req, res, next) => {
  const deletedClass = await Class.findByIdAndDelete(req.params.id);
  if (!deletedClass) {
    return next(new AppError("No class found with this id😑", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.updateClass = catchAsync(async (req, res, next) => {
  const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedClass) {
    return next(new AppError("No class found with this id😑", 404));
  }
  res.status(200).json({
    status: "success",
    data: { updatedClass },
  });
});
