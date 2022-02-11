const ExamPaper = require("./../models/examPaperModel.js");
const APIFeatures = require("./../utils/APIFeatures.js");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError.js");
exports.getAllExamPapers = catchAsync(async (req, res, next) => {
  // Build Query
  const features = new APIFeatures(ExamPaper.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields();
  // Execute Query
  const examPapers = await features.query;
  res.status(200).json({
    status: "success",
    totalData: examPapers.length,
    data: { examPapers },
  });
});
