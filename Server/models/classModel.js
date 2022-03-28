const mongoose = require("mongoose");
const User = require("./userModel.js");
const classSchema = mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.ObjectId,
      ref: "Organization",
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//           ------------DOCUMENT MIDDLEWARE-----------------------
// IN DOCUMENT MIDDLEWARE <this> REFERS TO THE CURRENT DOCUMENT

//    ----------------------QUERY MIDDLEWARE-------------------------

// IN QUERY MIDDLEWARE <this> REFERS TO THE CURRENT QUERY NOT THE CURRENT DOCUMENT

// EMBED ALL USERS ASSOCIATED WITH THIS CLASS
// ==> THERE IS A LIMITATION , THAT IT WORKS ONLY FOR .create() and .save() NEVER RUN DURING DOCUMENT UPDATE
classSchema.pre(/^find/, function (next) {
  this.populate({
    path: "organization",
    select: "-__v  -country -pinCode -state -district -organizationHead",
  });
  next();
});

const Class = mongoose.model("Class", classSchema);
module.exports = Class;
