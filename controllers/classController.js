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
