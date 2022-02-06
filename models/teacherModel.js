const mongoose = require("mongoose");
const teacherSchema = new mongoose.Schema({
  name: String,
  age: {
    type: Number,
    required: true,
  },
});
const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
