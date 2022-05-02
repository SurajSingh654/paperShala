const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError.js");
const APIFeatures = require("./../utils/APIFeatures.js");
const Teacher = require("./../models/teacherModel.js");
const Student = require("./../models/studentModel.js");
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with this id😑", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("No document found with this id😑", 404));
    }
    res.status(200).json({
      status: "success",
      data: { doc },
    });
  });
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError("No document found with this id", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // Build Query
    let filter = { teacher: req.user.id };
    if (req.params.organizationId)
      filter = {
        ...filter,
        organization: req.params.organizationId,
      };
    if (req.params.classId)
      filter = {
        ...filter,
        class: req.params.classId,
      };
    if (req.params.questionId)
      filter = {
        ...filter,
        class: req.params.questionId,
      };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .paginate()
      .limitFields();
    // Execute Query
    const doc = await features.query;
    // const doc = await Model.find();
    res.status(200).json({
      status: "success",
      totalData: doc.length,
      data: { doc },
    });
  });

exports.getMyData = (Model) =>
  catchAsync(async (req, res, next) => {
    const user = await Model.findById(req.user.id).populate("classes");
    if (!user) {
      return next(new AppError("No user found", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  });

exports.deleteMe = (Model) =>
  catchAsync(async (req, res, next) => {
    await Model.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
exports.updateMyData = (Model, filteredOptions) =>
  catchAsync(async (req, res, next) => {
    // RESTRICT TO UPDATE PASSWORD HERE
    console.log(...filteredOptions);
    if (req.body.password || req.body.confirmPassword) {
      return next(
        new AppError(
          "This route restrict you to update your password... Follow this route: /updateMyPassword",
          400
        )
      );
    }
    if (req.body.address) {
      req.body.address = {
        ...req.user.address,
        ...req.body.address,
      };
    }

    // FILTERED OUT UNWANTED FIELDS THAT ARE NOT ALLOWED HERE
    console.log(req.body);
    const filteredBody = filterObj(req.body, ...filteredOptions);

    // UPDATE USER DATA AFTER FILTERING
    const user = await Model.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    await user.save({ validateBeforeSave: false });

    // SEND UPDATED DATA
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  });

exports.getAllTeachersAndStudents = catchAsync(async (req, res, next) => {
  console.log(req.user.organization);
  const teachers = await Teacher.find({ organization: req.user.organization });
  const students = await Student.find({ organization: req.user.organization });
  console.log(students);
  const users = [...teachers, ...students];

  res.status(200).json({
    status: "success",
    totalData: users.length,
    data: { users },
  });
});

exports.getAllStudentsBasedOnTeachers = catchAsync(async (req, res, next) => {
  console.log(req.user.organization);
  const teachers = await Teacher.find({ organization: req.user.organization });
  const students = await Student.find({ organization: req.user.organization });
  console.log(students);
  const users = [...teachers, ...students];

  // const newUsers = await users.aggregate([
  //   {
  //     $group: {
  //       _id: { $teacher: "$" },
  //     },
  //   },
  // ]);
});
