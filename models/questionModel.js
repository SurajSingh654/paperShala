const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema({
  // Multicorrect,SingleCorrect,One Word,LongAnswer,ShortAnswer,Fill in the blanks,True/False,Matching,
  questionType: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  questionImage: {
    type: String,
  },
  options: [String],
  answer: {
    type: String,
    trim: true,
  },
});
const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
