import { set } from "mongoose";
import { User } from "../models/user.model.js";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteOldFileInCloudinary,
  uploadOnCloudinary,
  uploadOnCloudinaryWithBase64,
} from "../utils/cloudinary.js";
import { generateOTP, sendOTPByEmail } from "../utils/otp.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

//Register user
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullname, contactNo, dob } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(
      400,
      "Email is required and must be a valid email address"
    );
  }

  if (!password || password.length < 6) {
    throw new ApiError(
      400,
      "Password is required and must be at least 6 characters long"
    );
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(409, "Already email is registered");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path; // Update the field name to match the request payload
  let avatarUrl = "";

  if (avatarLocalPath) {
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    avatarUrl = avatar.secure_url;
  }
  const otp = generateOTP();
  sendOTPByEmail(email, otp);
  const user = await User.create({
    fullname,
    contactNo,
    dob,
    username,
    email,
    avatar: avatarUrl,
    password,
    otp,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -otp -verified"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  setTimeout(async () => {
    const user = await User.findOne({ email });
    if (user && !user.verified) {
      await User.findByIdAndDelete(user._id);
      console.log(
        `User ${email} deleted due to OTP not being verified within time limit.`
      );
    }
  }, 180000);

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "New account is created"));
});

const verifyUser = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!(email || otp)) {
    throw new ApiError(400, "Please provide email and otp");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not  exists");
  }
  if (user.otp !== otp) {
    throw new ApiError(400, "please provide correct otp");
  }
  user.otp = null;

  user.verified = true;
  user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Registerd successfully"));
});

//Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or Email is required.");
  }
  if (!password) {
    throw new ApiError(400, "Password is required.");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.verified == false) {
    throw new ApiError(401, "Please verify your email.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -otp -verified"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

//User logout
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged out Successfully"));
});

//Forgot password
const otpForPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = generateOTP();
  sendOTPByEmail(email, otp);
  user.otp = otp;
  user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent successfully"));
});

const verifyOTPForForgotPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  if (!(email || otp || password)) {
    throw new ApiError(400, "Please provide email and otp");
  }

  if (!password || password.length < 6) {
    throw new ApiError(
      400,
      "Password is required and must be at least 6 characters long"
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not  exists");
  }
  if (user.otp !== otp) {
    throw new ApiError(400, "please provide correct otp");
  }
  user.otp = null;
  user.password = password;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Passwrd is updated successfully."));
});

//Secured routes

//Get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

//Get all user
const getAllUser = asyncHandler(async (req, res) => {
  const user = await User.find().select("-password -otp");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "All user fetched successfully"));
});

//Update user
const updateUserRole = asyncHandler(async (req, res) => {
  const { updateUserId, updateRole } = req.body;

  if (!(updateUserId || updateRole)) {
    throw new ApiError(
      400,
      "Both 'updateUserId' and 'updateRole' fields are required"
    );
  }
  const userExists = await User.findById(updateUserId);
  if (!userExists) {
    throw new ApiError(404, "user does not exist.");
  }
  if (!["employee", "hr", "is", "admin"].includes(updateRole.toLowerCase())) {
    throw new ApiError(
      400,
      "'updateRole' must be either 'employee' or 'HR' or 'IS'"
    );
  }

  const user = await User.findByIdAndUpdate(
    updateUserId,
    { $set: { role: updateRole } },
    { new: true }
  ).select("-password -otp");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User role is updated successfully"));
});

//Update user details
const updateUserDetails = asyncHandler(async (req, res) => {
  const { fullname, contactNo, dob, avatar } = req.body;
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  let user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { fullname, contactNo, dob } },
    { new: true }
  ).select("-password -otp");
  let uplodedAvatar;
  if (avatar || avatarLocalPath) {
    const oldAvatar = req.user?.avatar;
    if (oldAvatar) {
      try {
        const isOldImageDelete = await deleteOldFileInCloudinary(oldAvatar);
        console.log("isOldImageDelete ", isOldImageDelete);
      } catch (error) {
        throw new ApiError(
          500,
          "Something went wrong while removing old avatar from database"
        );
      }
    }

    if (avatar) {
      // Decode base64 string
      const base64Data = avatar.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Generate a unique filename for the image (you can use any logic to create a filename)
      var fileName = `avatar_${Date.now()}.png`;

      // Save the image to the server
      fs.writeFileSync(`./public/temp/${fileName}`, buffer, "base64");
      uplodedAvatar = await uploadOnCloudinaryWithBase64(fileName);
    } else {
      uplodedAvatar = await uploadOnCloudinary(avatarLocalPath);
    }
    user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avatar: uplodedAvatar?.secure_url } },
      { new: true }
    ).select("-password -otp -verified");
  }

  return res.status(200).json({
    success: true,
    message: "User details updated successfully",
    user,
  });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getAllUser,
  updateUserRole,
  verifyUser,
  otpForPassword,
  verifyOTPForForgotPassword,
  updateUserDetails,
};
