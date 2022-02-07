const mongoose = require("mongoose");
const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 2,
  },
  state: String,
  seats: {
    type: Number,
    unique: true,
  },
});
const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
