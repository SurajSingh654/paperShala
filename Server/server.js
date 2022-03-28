// Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env
const dotenv = require("dotenv");

// handle unCaughtException
process.on("uncaughtException", (err) => {
  console.log(`error: ${err.name}`);
  console.log(`message: ${err.message}`);
  console.log("UNCAUGHT EXCEPTION 💥💥 Shutting Down...");
  process.exit(1);
});
dotenv.config({ path: "./config.env" });
const app = require("./app.js");

const mongoose = require("mongoose");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to remote database!"));

// Listen for connections.

// A node http.Server is returned, with this application (which is a Function) as its callback. If you wish to create both an HTTP and HTTPS server you may do so with the "http" and "https" modules as shown here:

// var http = require('http') , https = require('https') , express = require('express') , app = express();

// http.createServer(app).listen(80); https.createServer({ ... }, app).listen(443);
const port = 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// handle unhandledPromiseRejections
process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("UNHANDLED REJECTION 💥💥 Shutting Down...");
  server.close(() => {
    process.exit(1);
  });
});
