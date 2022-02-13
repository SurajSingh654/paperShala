const mongoose = require("mongoose");
const User = require("./../models/userModel.js");
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
  classUsers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Class must belong to User{Teacher or Student}"],
    },
  ],
  // classUsers: Array,
});
//           ------------DOCUMENT MIDDLEWARE-----------------------
// IN DOCUMENT MIDDLEWARE <this> REFERS TO THE CURRENT DOCUMENT

// RUN WHEN WE CREATE A DOCUMENT i.e, .create() and .save()
classSchema.pre("save", () => console.log("Pre save hook"));
// RUN WHEN WE CREATE A DOCUMENT i.e, .create() and .save()
classSchema.pre("validate", () => console.log("Pre validate hook"));

// NEVER RUN WHEN WE CREATE A DOCUMENT
classSchema.pre("remove", () => console.log("Pre remove hook"));
classSchema.pre("updateOne", () => console.log("Pre updateOne hook"));
classSchema.pre("deleteOne", () => console.log("Pre deleteOne hook"));

//    ----------------------QUERY MIDDLEWARE-------------------------

// IN QUERY MIDDLEWARE <this> REFERS TO THE CURRENT QUERY NOT THE CURRENT DOCUMENT
classSchema.pre(/^find/, function (next) {
  this.populate({
    path: "classUsers",
    select: "-__v  -address  -passwordChangedAt",
  });
  next();
});

// EMBED ALL USERS ASSOCIATED WITH THIS CLASS
// ==> THERE IS A LIMITATION , THAT IT WORKS ONLY FOR .create() and .save() NEVER RUN DURING DOCUMENT UPDATE

// classSchema.pre("save", async function (next) {
//   const classUsersPromises = this.classUsers.map(
//     async (id) => await User.findById(id)
//   );
//   this.classUsers = await Promise.all(classUsersPromises);
//   next();
// });
const Class = mongoose.model("Class", classSchema);
module.exports = Class;
