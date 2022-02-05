const fs = require("fs");

const teachers = JSON.parse(
  fs.readFileSync("./developmentData/api_data/teacher_apiData.json")
);

exports.getAllTeachers = (req, res) => {
  res.status(200).json({
    status: "success",
    totalData: teachers.length,
    data: { teachers },
  });
};

exports.getTeacherById = (req, res) => {
  const teacher = teachers.find((el) => el.id === req.params.id * 1);
  res.status(200).json({
    status: "success",
    data: { teacher },
  });
};

exports.createNewTeacher = (req, res) => {
  console.log("Hello");
  const newTeacher = req.body;
  teachers.push(newTeacher);
  console.log(newTeacher);
  fs.writeFile(
    "./developmentData/api_data/teacher_apiData.json",
    JSON.stringify(teachers),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          newTeacher,
        },
      });
    }
  );
};

exports.updateTeacherById = (req, res) => {
  if (req.params.id > teachers.length) {
    res.status(404).json({
      status: "Failed",
      message: "Invalid Id",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      teacher: "<Updated teacher data>",
    },
  });
};
exports.deleteTeacherById = (req, res) => {
  if (req.params.id > teachers.length) {
    res.status(404).json({
      status: "Failed",
      message: "Invalid Id",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};
