import dotenv, { config } from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.port || 3500, () => {
      console.log(`Server is running on port: ${process.env.port}`);
    });
  })
  .catch((error) => {
    console.log("Database connection failed ...", error);
  });
