// require all modules
const express = require("express");

// call express() to get all methods in it...
// Creates an Express application. The express() function is a top-level function exported by the express module.
const app = express();

// handle routes comming from the client
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "Hello from the server!" });
});

// Listen for connections.

// A node http.Server is returned, with this application (which is a Function) as its callback. If you wish to create both an HTTP and HTTPS server you may do so with the "http" and "https" modules as shown here:

// var http = require('http') , https = require('https') , express = require('express') , app = express();

// http.createServer(app).listen(80); https.createServer({ ... }, app).listen(443);
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
