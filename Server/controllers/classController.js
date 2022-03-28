const Class = require("./../models/classModel.js");
const factory = require("./../controllers/CRUDfactoryController.js");
const AppError = require("./../utils/appError.js");
const catchAsync = require("./../utils/catchAsync");

exports.setTeacherId_OrganizationId = catchAsync((req, res, next) => {
  if (req.params.organizationId) {
    if (!req.user.organizations.includes(req.params.organizationId)) {
      return next(
        new AppError(
          "You are not allowed to add class related to this organization!",
          404
        )
      );
    }
  }
  req.body.organization = req.params.organizationId;
  req.body.teacher = req.user.id;
  next();
});

exports.deleteClass = factory.deleteOne(Class);
exports.updateClass = factory.updateOne(Class);
exports.createClass = factory.createOne(Class);
exports.getClass = factory.getOne(Class);
exports.getAllClasses = factory.getAll(Class);
