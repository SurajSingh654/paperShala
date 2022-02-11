const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");
const AppError = require("../utils/appError.js");
const User = require("./../models/userModel.js");
const catchAsync = require("./../utils/catchAsync.js");
const sendEmail = require("./../utils/email.js");

const assignToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const assignAndSendToken = (user, statusCode, res) => {
  const token = assignToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production")
    (cookieOptions.secure = true),
      // PASS COOKIE TO THE BROWSER
      res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  // const token = assignToken(newUser._id);
  // res.status(201).json({
  //   status: "success",
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
  assignAndSendToken(newUser, 201, res);
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
  assignAndSendToken(user, 202, res);

  // const token = assignToken(user._id);
  // // IF EVERYTHING IS OK
  // res.status(200).json({
  //   status: "success",
  //   token,
  // });
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
  // PASS USER DATA IN req.user
  req.user = freshUser;
  // GRANT ACCESS
  next();
});

exports.restrictTo = (...categories) => {
  return (req, res, next) => {
    if (!categories.includes(req.user.category)) {
      return next(
        new AppError(
          "Sorry😓! You don't have authority to perform this task...",
          403
        )
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // GET USER BASED ON IT'S CLAIMED EMAILID
  const user = await User.findOne({ emailId: req.body.emailId });
  if (!user) {
    return next(new AppError("No user found with this emailId!", 404));
  }
  // GENERATE RANDOM TOKEN
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // SEND TOKEN TO USER'S EMAIL
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password?Click on the given link to reset your password ${resetURL} \n If you don't forgot your password ... Please ignore this message!`;
  try {
    await sendEmail({
      email: user.emailId,
      subject: `Forgot password token (only valid for 10 min)`,
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to user's emailId",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("Error in sending the email...Please try later!"),
      500
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) GET USER BASED ON TOKEN
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) IF TOKEN HASN'T REQUIRED AND USER EXIST, THEN SET A NEW PASSWORD
  if (!user) {
    return next(new AppError("Token is invalid or expired!", 400));
  }
  // 3) UPDATE changedPasswordAt PROPERTY FOR CURRENT USER
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 4) LOG USER IN, SEND JWT TOKEN
  assignAndSendToken(user, 200, res);

  // const token = assignToken(user._id);
  // // IF EVERYTHING IS OK
  // res.status(200).json({
  //   status: "success",
  //   token,
  // });
});

exports.updatePssswordForCurrentLoginUser = catchAsync(
  async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select("+password");
    // 2) Check if posted current password is correct

    if (
      !(await user.checkPasswordMatch(req.body.currentPassword, user.password))
    ) {
      return next(new AppError("Incorrect password!"), 401);
    }
    // 3) If so, update password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    // 4) Log user in, send JWT token
    assignAndSendToken(user, 201, res);
  }
);
