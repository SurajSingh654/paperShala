const Teacher = require("./../models/teacherModel.js");

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json({
      status: "success",
      totalData: teachers.length,
      data: { teachers },
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: "Invalid",
    });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { teacher },
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: "Invalid",
    });
  }
};

exports.createNewTeacher = async (req, res) => {
  try {
    const newTeacher = await Teacher.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        teacher: newTeacher,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: "Invalid",
    });
  }
};

exports.updateTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: { teacher },
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: "Invalid",
    });
  }
};
exports.deleteTeacherById = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (e) {
    res.status(404).json({
      status: "fail",
      message: "Invalid",
    });
  }
};
