const fs = require("fs");

const teachers = JSON.parse(
  fs.readFileSync("./developmentData/api_data/teacher_apiData.json")
);

exports.checkBody = (req, res, next) => {
  if (!req.params.id) {
    return res.status(404).json({
      status: "fail",
      message: "Id is not present",
    });
  }
  next();
};

exports.checkId = (req, res, next, value) => {
  console.log(`Tour id is in middleware :${value}`);
  if (req.params.id * 1 > teachers.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id",
    });
  }
  next();
};

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
  res.status(200).json({
    status: "success",
    data: {
      teacher: "<Updated teacher data>",
    },
  });
};
exports.deleteTeacherById = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
