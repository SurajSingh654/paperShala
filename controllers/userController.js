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
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError("No user found with this id😑", 404));
  }
  res.status(200).json({
    status: "success",
    data: { user },
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("No user found with this id😑", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
