const mongoose = require("mongoose");
const validator = require("validator");

const examPaperSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.ObjectId,
    ref: "Organization",
    required: true,
  },
  teacher: {
    type: mongoose.Schema.ObjectId,
    ref: "Teacher",
    required: true,
  },
  class: {
    type: mongoose.Schema.ObjectId,
    ref: "Class",
    required: true,
  },
  examTime: {
    type: Date,
    // required: true,
  },
  maximumMarks: {
    type: Number,
    required: true,
  },
  examName: {
    type: String,
    required: true,
  },
  generalInstructions: [
    {
      type: String,
    },
  ],
  totalQuestions: {
    type: Number,
  },
  totalMCQSingleCorrect: {
    type: Number,
  },
  totalMCQMultiCorrect: {
    type: Number,
  },
  totalMCQLongAnswer: {
    type: Number,
  },
  totalShortAnswer: {
    type: Number,
  },
  totalFillInTheBlank: {
    type: Number,
  },
  totalOneWord: {
    type: Number,
  },
  totalTrueFalse: {
    type: Number,
  },
  totalMatching: {
    type: Number,
  },
  questions: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Question",
    },
  ],
});

const ExamPaper = mongoose.model("ExamPaper", examPaperSchema);
module.exports = ExamPaper;
