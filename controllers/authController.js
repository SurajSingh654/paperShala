const jwt = require("jsonwebtoken");
const { promisify } = require("util");
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

  const token = assignToken(user._id);
  // IF EVERYTHING IS OK
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // CHECH WHETHER TOKEN IS PERSIST IN REQ.HEADERS
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please login first!", 401)
    );
  }

  // TOKEN VERYFICATION
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // CHECK IF USER STILL EXIST{possible user deleted after login and someone get access to it's token}
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("User with provided token is no longer exist!", 401)
    );
  }

  // CHECK IF USER CHANGED THE PASSWORD IN MEANTIME
  if (freshUser.checkPasswordChangedAt(decoded.iat)) {
    return next(
      new AppError("Password changed recently...Please Login again!")
    );
  }

  req.user = freshUser;
  // GRANT ACCESS
  next();
});
