const User = require("./../models/userModel.js");
const APIFeatures = require("./../utils/APIFeatures.js");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError.js");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

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

exports.updateMyData = catchAsync(async (req, res, next) => {
  // RESTRICT TO UPDATE PASSWORD HERE
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "This route restrict you to update your password... Follow this route: /updateMyPassword",
        400
      )
    );
  }
  // FILTERED OUT UNWANTED FIELDS THAT ARE NOT ALLOWED HERE
  const filteredBody = filterObj(
    req.body,
    "firstName",
    "middleName",
    "lastName",
    "category",
    "address",
    "gender",
    "photo",
    "phoneNumber",
    "emailId"
  );

  // UPDATE USER DATA AFTER FILTERING
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  // SEND UPDATED DATA
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
