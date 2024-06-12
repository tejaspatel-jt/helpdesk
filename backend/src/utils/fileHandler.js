
import fs from "fs";
import path from "path";
import { ApiError } from "./ApiError.js";
import { File } from "../models/files.model.js";

// const mongoose = require("mongoose");

const saveBase64Data = async (base64String) => {
  // Decode base64 string
  try {
    const decodedData = Buffer.from(base64String, "base64");

    // Create a unique filename
    const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Define the file path
    const filePath = path.join("./public/temp", filename);

    // Write the decoded data to a temporary file
    fs.writeFileSync(filePath, decodedData);

    // Create a new instance of the File model
    const file = await File.create({
      fileName: filename,
      fileType: "txt", // Example file type, you can change it accordingly
      base64File: base64String, // We're not saving the Base64 string directly
    });

    fs.unlinkSync(filePath);

    return file._id;
  } catch (error) {
    throw new ApiError(100, "Some problemmmmmm");
  }
};

async function fileToBase64(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const base64String = Buffer.from(data).toString("base64");
        resolve(base64String);
      }
    });
  });
}

export { saveBase64Data, fileToBase64 };
