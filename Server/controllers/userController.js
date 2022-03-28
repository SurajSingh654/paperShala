const User = require("./../models/userModel.js");
const APIFeatures = require("./../utils/APIFeatures.js");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError.js");
const Organization = require("./../models/organizationModel.js");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.getMyData = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const user = await User.findById(req.user.id).populate("classes");
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
  if (req.body.organizations) {
    const organization = await Organization.findById(req.body.organizations);
    if (!organization) {
      return next(new AppError("No organization found with this id...", 404));
    }
    req.body.organizations = [
      ...req.user.organizations,
      req.body.organizations,
    ];
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
    "emailId",
    "organizations"
  );

  // UPDATE USER DATA AFTER FILTERING
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  await updatedUser.save({ validateBeforeSave: false });

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
