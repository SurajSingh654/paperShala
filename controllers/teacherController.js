const Teacher = require("./../models/teacherModel.js");
const APIFeatures = require("./../utils/APIFeatures.js");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError.js");

exports.getAllTeachers = catchAsync(async (req, res, next) => {
  // Build Query
  const features = new APIFeatures(Teacher.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields();
  // Execute Query
  const teachers = await features.query;
  res.status(200).json({
    status: "success",
    totalData: teachers.length,
    data: { teachers },
  });
});

exports.getTeacherById = catchAsync(async (req, res, next) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    return next(new AppError("No teacher found with this id😑", 404));
  }
  res.status(200).json({
    status: "success",
    data: { teacher },
  });
});

exports.createNewTeacher = catchAsync(async (req, res, next) => {
  const newTeacher = await Teacher.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      teacher: newTeacher,
    },
  });
});

exports.updateTeacherById = catchAsync(async (req, res, next) => {
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!teacher) {
    return next(new AppError("No teacher found with this id😑", 404));
  }
  res.status(200).json({
    status: "success",
    data: { teacher },
  });
});
exports.deleteTeacherById = catchAsync(async (req, res, next) => {
  const teacher = await Teacher.findByIdAndDelete(req.params.id);
  if (!teacher) {
    return next(new AppError("No teacher found with this id😑", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Aggergation and Pipeline
exports.getTeacherStats = catchAsync(async (req, res, next) => {
  // In aggregate() pass array of stages!!!!!!!!
  const stats = await Teacher.aggregate([
    // Each stage is an object
    {
      $match: {
        $and: [{ state: { $eq: "Uttar Pradesh" } }, { age: { $gte: 40 } }],
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        avgAge: { $avg: "$age" },
        minAge: { $min: "$age" },
        maxAge: { $max: "$age" },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
