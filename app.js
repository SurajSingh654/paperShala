// require all modules
const express = require("express");
const morgan = require("morgan");
const teacherRouter = require("./routes/teacherRoutes.js");

// call express() to get all methods in it...
// Creates an Express application. The express() function is a top-level function exported by the express module.
const app = express();

// Middlewares
// app-level middleware
// Express doesn't put body data in the request object explicitly...We have to add middleware i.e, app.use(express.json())
app.use(express.json());

// Morgan Middleware
// Concise output colored by response status for development use. The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes. :method :url :status :response-time ms - :res[content-length]
app.use(morgan("dev"));
// handle routes coming from the client
// app.get("/", (req, res) => {
//   res
//     .status(200)
//     .json({ status: "success", message: "Hello from the server!" });
// });

// JSON.parse ==> A function that transforms the results. This function is called for each member of the object. If a member contains nested objects, the nested objects are transformed before the parent object is.

// Mount teacherRouter with "/api/v1/teachers"
app.use("/api/v1/teachers", teacherRouter);
module.exports = app;
