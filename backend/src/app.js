// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import userRouter from "./routes/user.routes.js";
// import ticketRouter from "./routes/ticket.routes.js";
// import morgan from "morgan";
// import { ApiError } from "./utils/ApiError.js";


// const app = express();

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );

// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(cookieParser());
// app.use(express.static("public"))
// app.use(morgan("dev"));

// //routes declaration
// app.use("/user", userRouter);
// app.use("/user/ticket", ticketRouter);

// //Error handeling for getting response in json format
// app.use((err, req, res, next) => {
//   if (err instanceof ApiError) {
//     res.status(err.statusCode).json(err.toJSON());
//   } else {
//     // Handle other types of errors
//     res.status(500).json({
//       message: err.message || "Internal Server Error",
//     });
//   }
// });
// export { app };

/*
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import ticketRouter from "./routes/ticket.routes.js";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ApiError } from "./utils/ApiError.js";

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Logging setup
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFilePath = path.join(__dirname, "access.log");
const accessLogStream = fs.createWriteStream(logFilePath, { flags: "a" });

// Morgan logging middleware with custom tokens
app.use(
  morgan(
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
      const logseparator =
        "==========================================================================================";

      // Format log entry
      return `📌${date} ${time} || ${method} - ${url} - ${status} - ${responseTime} ms\n👉Request Body: ${requestBody}\n👉Response Body: ${responseBody}\n${logseparator}`;
    },
    {
      stream: accessLogStream,
    }
  )
);

// Middleware to capture response body
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    res.locals.responseBody = data;
    originalJson.call(res, data);
  };
  next();
});

app.get("/access-log", (req, res) => {
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

// Routes
app.use("/user", userRouter);
app.use("/user/ticket", ticketRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json(err.toJSON());
    } else {
      res.status(500).json({
        message: err.message || "Internal Server Error"
      });
    }
  });

export { app };
*/


import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.routes.js'; // Assuming these are your routers
import ticketRouter from './routes/ticket.routes.js'; // Assuming these are your routers
import {Logger, captureResponseBody, getLogs } from './middlewares/logger.middleware.js';
import { ApiError } from './utils/ApiError.js';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static("public"))


// Use personal logger middleware
app.use(Logger);

// Middleware to capture response body
app.use(captureResponseBody);

// Routes
app.use("/user", userRouter);
app.use("/user/ticket", ticketRouter);
app.get("/",getLogs)

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(err.toJSON());
  } else {
    res.status(500).json({
      message: err.message || "Internal Server Error"
    });
  }
});

export { app };
