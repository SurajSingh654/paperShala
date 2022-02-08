const User = require("./../models/userModel.js");
const APIFeatures = require("./../utils/APIFeatures.js");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError.js");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // Build Query
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields();
  // Execute Query
  const users = await features.query;
  // const users = await User.find();
  res.status(200).json({
    status: "success",
    totalData: users.length,
    data: { users },
  });
});
