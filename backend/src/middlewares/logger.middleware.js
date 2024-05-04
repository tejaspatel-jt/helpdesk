// import fs from 'fs';
// import morgan from 'morgan';
// import path from 'path';
// import { asyncHandler } from '../utils/asyncHandler.js';


// const logDirectoryPath = 'src';

// // Ensure the directory exists, if not create it
// if (!fs.existsSync(logDirectoryPath)) {
//   fs.mkdirSync(logDirectoryPath, { recursive: true });
// }

// // Define the file path where logs will be stored
// const logFilePath = path.join(logDirectoryPath, "access.log");

// // // Create a write stream to write logs to the file
// const accessLogStream = fs.createWriteStream(logFilePath, { flags: "a" });


// const Logger = morgan(
//   (tokens, req, res) => {
//     if (req.originalUrl === "/access-log") {
//       return null; // Skip logging for /access-log requests
//     }

//     const date = new Date().toDateString(); // Get current date
//     const time = new Date().toTimeString().split(" ")[0]; // Get current time
//     const method = tokens.method(req, res); // Get HTTP method
//     const url = req.protocol + "://" + req.get("host") + req.originalUrl; // Get request URL
//     const status = tokens.status(req, res); // Get response status code
//     const responseTime = tokens["response-time"](req, res); // Get response time
//     const requestBody = JSON.stringify(req.body); // Get request body
//     const responseBody = JSON.stringify(res.locals.responseBody); // Get response body
//     const logseparator =
//       "==========================================================================================";

//     // Format log entry
//     return `📌${date} ${time} || ${method} - ${url} - ${status} - ${responseTime} ms\n👉Request Body: ${requestBody}\n👉Response Body: ${responseBody}\n${logseparator}`;
//   },
//   {
//     stream: accessLogStream,
//   }
// );

// const getLogs = asyncHandler(async(req,res)=>{
//   fs.readFile(logFilePath, "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading access log:", err);
//       res.status(500).json({ message: "No log found" });
//     } else {
//       res.header("Content-Type", "text/plain"); // Set the content type to plain text
//       res.send(data);
//     }
//   });
// })

// const captureResponseBody = (req, res, next) => {
//   const originalJson = res.json;
//   res.json = function (data) {
//     res.locals.responseBody = data;
//     originalJson.call(res, data);
//   };
//   next();
// }

// export {Logger,getLogs,captureResponseBody} ;
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';
import { asyncHandler } from '../utils/asyncHandler.js';

const logDirectoryPath = 'src';

// Ensure the directory exists, if not create it
if (!fs.existsSync(logDirectoryPath)) {
  fs.mkdirSync(logDirectoryPath, { recursive: true });
}

// Define the file path where logs will be stored
const logFilePath = path.join(logDirectoryPath, "access.log");

// Create a function to append data to the log file
const accessLogStream = (logFilePath, data) => {
  const existingData = fs.existsSync(logFilePath) ? fs.readFileSync(logFilePath, 'utf8') : '';
  fs.writeFileSync(logFilePath, `${data}\n${existingData}`);
};

const Logger = morgan(
  (tokens, req, res) => {
    if (req.originalUrl === "/access-log") {
      return null; // Skip logging for /access-log requests
    }

    const date = new Date().toDateString(); // Get current date
    const time = new Date().toTimeString().split(" ")[0]; // Get current time
    const method = tokens.method(req, res); // Get HTTP method
    const url = req.protocol + "://" + req.get("host") + req.originalUrl; // Get request URL
    const status = tokens.status(req, res); // Get response status code
    const responseTime = tokens["response-time"](req, res); // Get response time
    const requestBody = JSON.stringify(req.body); // Get request body
    const responseBody = JSON.stringify(res.locals.responseBody); // Get response body
    const logSeparator =
      "==========================================================================================";

    // Format log entry
    const logEntry = `📌${date} ${time} || ${method} - ${url} - ${status} - ${responseTime} ms\n👉Request Body: ${requestBody}\n👉Response Body: ${responseBody}\n${logSeparator}`;

    // Append log entry to the log file
    accessLogStream(logFilePath, logEntry);

    return null; // Return log entry for morgan to write to stream
  },
  {
    skip: (req, res) => req.originalUrl === "/"
  }
);

const getLogs = asyncHandler(async(req,res)=>{
  fs.readFile(logFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading access log:", err);
      res.status(500).json({ message: "No log found" });
    } else {
      res.header("Content-Type", "text/plain"); // Set the content type to plain text
      res.send(data);
    }
  });
});

const captureResponseBody = (req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    res.locals.responseBody = data;
    originalJson.call(res, data);
  };
  next();
};

export { Logger, getLogs, captureResponseBody };
