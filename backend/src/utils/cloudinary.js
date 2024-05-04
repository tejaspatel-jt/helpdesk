import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { ApiError } from "./ApiError.js";


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        throw new ApiError(500, "Failed to upload one or more files.");
    }
}

const deleteOldFileInCloudinary = async (oldData) => {
    try {
      const publicIdToDelete = oldData.split("/").pop().split(".")[0];
      console.log("publicIdToDelete ", publicIdToDelete);
      await cloudinary.uploader.destroy(
        publicIdToDelete,
        { resource_type: "image" },
        (error, result) => {
          if (error) {
            throw new ApiError(401, "Error in Uploading to cloud");
          }
        }
      );
    } catch (error) {
      return null;
    }
  };

export {uploadOnCloudinary,deleteOldFileInCloudinary}