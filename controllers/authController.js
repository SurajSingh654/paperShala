const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError.js");
const User = require("./../models/userModel.js");
const catchAsync = require("./../utils/catchAsync.js");

const assignToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = assignToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
  //   next();
});
exports.login = catchAsync(async (req, res, next) => {
  const { emailId, password } = req.body;
  //   console.log(`==========${emailId}, ${password}================`);
  // CHECK WHETHER EMAIL and PASSWORD IS EXIST
  if (!emailId || !password) {
    return next(new AppError("Please provide email and password both", 400));
  }

  // CHECK IF PROVIDED EMAIL AND PASSWORD IS PRESENT IN DATABASE
  // .select("+password") is used b'coz password {select:false} is schema
  const user = await User.findOne({ emailId }).select("+password");
  if (!user || !(await user.checkPasswordMatch(password, user.password))) {
    return next(new AppError("email or password is wrong", 401));
  }

  const token = assignToken(password);
  // IF EVERYTHING IS OK
  res.status(200).json({
    status: "success",
    token,
  });
});
