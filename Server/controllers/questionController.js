const Question = require("./../models/questionModel.js");
const factory = require("./../controllers/CRUDfactoryController.js");
const AppError = require("./../utils/appError.js");
const catchAsync = require("./../utils/catchAsync");
const Class = require("./../models/classModel.js");
exports.setTeacherId_OrganizationId_ClassId = catchAsync(
  async (req, res, next) => {
    if (req.params.organizationId) {
      if (!req.user.organizations.includes(req.params.organizationId)) {
        return next(
          new AppError(
            "You are not allowed to add question related to this organization!",
            404
          )
        );
      } else {
        if (req.params.classId) {
          const myClass = await Class.findById(req.params.classId);
          if (!myClass) {
            return next(
              new AppError(
                "You are not allowed to add question in this class!",
                404
              )
            );
          } else {
            if (myClass.teacher != req.user.id) {
              return next(
                new AppError(
                  "You are not allowed to add question for this class",
                  404
                )
              );
            }
          }
        }
      }
    }
    req.body.organization = req.params.organizationId;
    req.body.class = req.params.classId;
    req.body.teacher = req.user.id;
    next();
  }
);
exports.deleteQuestion = factory.deleteOne(Question);
exports.updateQuestion = factory.updateOne(Question);
exports.createQuestion = factory.createOne(Question);
exports.getQuestion = factory.getOne(Question);
exports.getAllQuestions = factory.getAll(Question);
