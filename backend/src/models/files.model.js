import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    base64File: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const File = mongoose.model("File", fileSchema);

