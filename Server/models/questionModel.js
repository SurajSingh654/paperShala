const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema(
  {
    // Multicorrect,SingleCorrect,One Word,LongAnswer,ShortAnswer,Fill in the blanks,True/False,Matching,
    questionType: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    questionImage: {
      type: String,
    },
    options: [String],
    answer: {
      type: String,
      trim: true,
    },
    class: {
      type: mongoose.Schema.ObjectId,
      ref: "Class",
    },
    organization: {
      type: mongoose.Schema.ObjectId,
      ref: "Organization",
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: "Teacher",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
questionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "class",
    select: "-__v -organization -teacher",
  }).populate({
    path: "organization",
    select: "-__v -district -state -country -pinCode -organizationHead",
  });
  next();
});
const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
