const Class = require("./../models/classModel.js");
const factory = require("./../controllers/CRUDfactoryController.js");
const AppError = require("./../utils/appError.js");
const catchAsync = require("./../utils/catchAsync");

exports.setTeacherIdAndOrganizationId = (req, res, next) => {
  req.body.teacher = req.user.id;
  req.body.organization = req.user.organization;
  next();
};

exports.deleteClass = factory.deleteOne(Class);
exports.updateClass = factory.updateOne(Class);
exports.createClass = factory.createOne(Class);
exports.getClass = factory.getOne(Class);
exports.getAllClasses = factory.getAll(Class);
