const Organization = require("./../models/organizationModel.js");
const APIFeatures = require("./../utils/APIFeatures.js");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError.js");
exports.getAllOrganizations = catchAsync(async (req, res, next) => {
  // Build Query
  const features = new APIFeatures(Organization.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields();
  // Execute Query
  const organizations = await features.query;
  res.status(200).json({
    status: "success",
    totalData: organizations.length,
    data: { organizations },
  });
});
exports.getOrganization = catchAsync(async (req, res, next) => {
  const organization = await Organization.findById(req.params.id);
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
exports.createOrganization = catchAsync(async (req, res, next) => {
  const newOrganization = await Organization.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      organization: newOrganization,
    },
  });
});
exports.deleteOrganization = catchAsync(async (req, res, next) => {
  const organization = await Organization.findByIdAndDelete(req.params.id);
  if (!organization) {
    return next(new AppError("No organization found with this id😑", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.updateOrganization = catchAsync(async (req, res, next) => {
  const organization = await Organization.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!organization) {
    return next(new AppError("No organization found with this id😑", 404));
  }
  res.status(200).json({
    status: "success",
    data: { organization },
  });
});
