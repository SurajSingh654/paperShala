const mongoose = require("mongoose");
const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  state: String,
  seats: Number,
});
const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
