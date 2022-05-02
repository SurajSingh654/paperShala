const Organization = require("./../models/organizationModel.js");
const factory = require("./../controllers/CRUDfactoryController.js");
const AppError = require("./../utils/appError.js");
const catchAsync = require("./../utils/catchAsync");

exports.createMyOrganization = catchAsync(async (req, res, next) => {
  req.body.organizationHead = req.user.id;
  const organization = await Organization.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      data: organization,
    },
  });
});
// exports.createOrganization = factory.createOne(Organization);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.getMyOrganization = catchAsync(async (req, res, next) => {
  console.log(req.user.id);
  const organization = await Organization.findOne({
    organizationHead: req.user.id,
  });
  if (!organization) {
    return next(new AppError("No organization found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      organization,
    },
  });
});

exports.updateMyOrganization = catchAsync(async (req, res, next) => {
  // FILTERED OUT UNWANTED FIELDS THAT ARE NOT ALLOWED HERE
  const filteredBody = filterObj(
    req.body,
    "organizationHead",
    "organizationName",
    "district",
    "state",
    "country",
    "pinCode"
  );

  // UPDATE USER DATA AFTER FILTERING
  console.log(req.user.id);
  const organization = await Organization.findOneAndUpdate(
    { organizationHead: req.user.id },
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!organization) {
    return next(new AppError("No organization found", 404));
  }

  await organization.save({ validateBeforeSave: false });

  // SEND UPDATED DATA
  res.status(200).json({
    status: "success",
    data: {
      data: organization,
    },
  });
});

exports.deleteMyOrganization = catchAsync(async (req, res, next) => {
  const organization = await Organization.findOneAndUpdate(
    { organizationHead: req.user.id },
    { active: false }
  );
  if (!organization) {
    return next(new AppError("No organization found", 404));
  }
  res.status(204).json({
    status: "success",
    organization: null,
  });
});

exports.getOrganization = factory.getOne(Organization);
