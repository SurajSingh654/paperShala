// require all modules
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const teacherRouter = require("./routes/teacherRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const classRouter = require("./routes/classRoutes.js");
const questionRouter = require("./routes/questionRoutes.js");
const examPaperRouter = require("./routes/examPaperRoutes.js");

const AppError = require("./utils/appError");
const globalErrorHandlers = require("./controllers/errorController.js");

// call express() to get all methods in it...
// Creates an Express application. The express() function is a top-level function exported by the express module
const app = express();

// Middlewares
// app-level middleware

// SET SECURITY HTTP HEADERS middleware
app.use(helmet());

// BODY-PARSER{reading data from the body into req.body} middleware
// Express doesn't put body data in the request object explicitly...We have to add middleware i.e, app.use(express.json())
app.use(express.json({ limit: "20kb" }));

// DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS
app.use(xss());

// Development Logging middleware
// Concise output colored by response status for development use. The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes. :method :url :status :response-time ms - :res[content-length]
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Middleware to restrict number of logins based on time
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    "Too many requests from your side...Please try again after one hour!",
});
app.use("/api", limiter);

// TODO: ADD SOME FIELDS IN WHITELIST ARRAY
app.use(hpp());

// JSON.parse ==> A function that transforms the results. This function is called for each member of the object. If a member contains nested objects, the nested objects are transformed before the parent object is.

// Mount teacherRouter with "/api/v1/teachers"
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/classes", classRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/examPapers", examPaperRouter);

// Handle all invalid routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server😑`, 404));
});
// Global Error Handler
app.use(globalErrorHandlers);
module.exports = app;
