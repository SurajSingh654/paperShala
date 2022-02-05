// require all modules
const express = require("express");
const fs = require("fs");

// call express() to get all methods in it...
// Creates an Express application. The express() function is a top-level function exported by the express module.
const app = express();

// Express doesn't put body data in the request object explicitly...We have to add middleware i.e, app.use(express.json())
app.use(express.json());

// handle routes coming from the client
// app.get("/", (req, res) => {
//   res
//     .status(200)
//     .json({ status: "success", message: "Hello from the server!" });
// });

// JSON.parse ==> A function that transforms the results. This function is called for each member of the object. If a member contains nested objects, the nested objects are transformed before the parent object is.
const teachers = JSON.parse(
  fs.readFileSync("./developmentData/api_data/teacher_apiData.json")
);

const getAllTeachers = (req, res) => {
  res.status(200).json({
    status: "success",
    totalData: teachers.length,
    data: { teachers },
  });
};

const getTeacherById = (req, res) => {
  const teacher = teachers.find((el) => el.id === req.params.id * 1);
  res.status(200).json({
    status: "success",
    data: { teacher },
  });
};

const createNewTeacher = (req, res) => {
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

const updateTeacherById = (req, res) => {
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
const deleteTeacherById = (req, res) => {
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
// get route handler
app.get("/api/v1/teachers", getAllTeachers);

app.get("/api/v1/teachers/:id", getTeacherById);

// post route handler
app.post("/api/v1/teachers", createNewTeacher);

// patch handler
app.patch("/api/v1/teachers/:id", updateTeacherById);

// delete handler
app.delete("/api/v1/teachers/:id", deleteTeacherById);

// Listen for connections.

// A node http.Server is returned, with this application (which is a Function) as its callback. If you wish to create both an HTTP and HTTPS server you may do so with the "http" and "https" modules as shown here:

// var http = require('http') , https = require('https') , express = require('express') , app = express();

// http.createServer(app).listen(80); https.createServer({ ... }, app).listen(443);
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
