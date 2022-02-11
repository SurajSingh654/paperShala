const mongoose = require("mongoose");
const examPaperSchema = new mongoose.Schema({
  instituteAddress: {
    type: String,
    required: true,
    trim: true,
  },
  examTime: {
    type: Date,
    required: true,
  },
  maximumMarks: {
    type: Number,
    required: true,
  },
  examName: {
    type: String,
    required: true,
  },
  className: {
    type: String,
  },
  generalInstructions: [
    {
      type: Map,
      of: String,
    },
  ],
  questions: [Array],
});
const ExamPaper = mongoose.model("ExamPaper", examPaperSchema);
module.exports = ExamPaper;
