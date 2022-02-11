const mongoose = require("mongoose");
const classSchema = new mongoose.Schema({
  // College , School , Coaching
  classType: {
    type: String,
    required: true,
  },
  // B.tech , Bsc , Phd , BCA , MCA , HighSchool, Intermediate etc
  className: {
    type: String,
    required: true,
  },
  // Mechanical , Electrical , etc ...
  branchName: {
    type: String,
  },
  sectionName: {
    type: String,
  },
  // Java , Science , Chemistry , Maths , Biology etc ...
  subjectName: {
    type: String,
    required: true,
  },
});
const Class = mongoose.model("Class", classSchema);
module.exports = Class;
