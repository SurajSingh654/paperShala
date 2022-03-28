const Organization = require("./../models/organizationModel.js");
const factory = require("./../controllers/CRUDfactoryController.js");
const catchAsync = require("./../utils/catchAsync");
exports.setOrganizationHeadId = (req, res, next) => {
  req.body.organizationHead = req.user.id;
  next();
};
exports.createOrganization = factory.createOne(Organization);

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
  const organization = await Organization.find({
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
    "organizationName",
    "district",
    "state",
    "country",
    "pinCode"
  );

  // UPDATE USER DATA AFTER FILTERING
  const updatedOrganization = await Organization.findByIdAndUpdate(
    { organizationHead: req.user.id },
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  await updatedOrganization.save({ validateBeforeSave: false });

  // SEND UPDATED DATA
  res.status(200).json({
    status: "success",
    data: {
      organization: updatedOrganization,
    },
  });
});

exports.deleteMyOrganization = catchAsync(async (req, res, next) => {
  await Organization.findByIdAndUpdate(
    { organizationHead: req.user.id },
    { active: false }
  );
  res.status(204).json({
    status: "success",
    organization: null,
  });
});
