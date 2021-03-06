const AppError = require("./../utils/appError.js");

// CasteError
const handleCastError = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 404);
};
// MongoError
const handleDuplicateFieldError = (err) => {
  //   const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate  fieldValue ,  use another value`;
  return new AppError(message, 404);
};

// Handle Validation error
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Data Input . ${errors.join(". ")}`;
  return new AppError(message, 404);
};

// Handle JWT verification error

const handleJWTError = () =>
  new AppError("Not an authorized user . Please login again!", 401);

// Handle JWT Token Session Expired Error
const handleJWTSessionExpiredError = () =>
  new AppError("Session expired! Please Login again...", 401);

// const handleValidatorError = (err) => new AppError(err.message, 404);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error : send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or unknown error: don't leak error details to client
  else {
    // 1) Log Error
    console.error(" Error 💥", err);
    // 2) Send Generic message
    res.status(500).json({
      status: "error",
      message: "something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  // Error status code is defined otherwise 500{Internal Server Error}
  err.statusCode = err.statusCode || 500;
  // Error status is defined otherwise "error"
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    // console.log(`Err in production ${err.message}`);
    console.log(error);
    // console.log(`Error in production ${error.message}`);
    console.log("---------------------Error----------------");
    // console.error(err);
    if (error.message) {
      // CastError: Cast to ObjectId failed error
      if (error.kind === "ObjectId") error = handleCastError(error);
      if (error.code === 11000) error = handleDuplicateFieldError(error);
      if (error._message === "Validation failed")
        error = handleValidationError(error);
      if (error.name === "JsonWebTokenError") error = handleJWTError();
      if (error.name === "TokenExpiredError")
        error = handleJWTSessionExpiredError();
      // if (error._message === "ExamPaper validation failed")
      //   error = handleValidatorError(error);
      sendErrorProd(error, res);
    } else {
      sendErrorProd(err, res);
    }
  }
};
