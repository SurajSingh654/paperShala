const Question = require("./../models/questionModel.js");
const APIFeatures = require("./../utils/APIFeatures.js");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError.js");
exports.getAllQuestions = catchAsync(async (req, res, next) => {
  // Build Query
  const features = new APIFeatures(Question.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields();
  // Execute Query
  const questions = await features.query;
  res.status(200).json({
    status: "success",
    totalData: questions.length,
    data: { questions },
  });
});
