import fs from "fs";
import { File } from "../models/files.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fileToBase64, saveBase64Data } from "../utils/fileHandler.js";
import { generateOTP, sendOTPByEmail } from "../utils/otp.js";
import { UserRole, UserRoleList } from "../constants.js";

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
// const registerUser = asyncHandler(async (req, res) => {
//   const { username, email, password, fullname, contactNo, dob } = req.body;

//   if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     throw new ApiError(
//       400,
//       "Email is required and must be a valid email address"
//     );
//   }

//   if (!password || password.length < 6) {
//     throw new ApiError(
//       400,
//       "Password is required and must be at least 6 characters long"
//     );
//   }

//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     throw new ApiError(409, "Already email is registered");
//   }

//   const avatarLocalPath = req.files?.avatar?.[0]?.path; // Update the field name to match the request payload
//   let avatarUrl = "";

//   if (avatarLocalPath) {
//     const avatar = await uploadOnCloudinary(avatarLocalPath);
//     avatarUrl = avatar.secure_url;
//   }
//   const otp = generateOTP();
//   sendOTPByEmail(email, otp);
//   const user = await User.create({
//     fullname,
//     contactNo,
//     dob,
//     username,
//     email,
//     avatar: avatarUrl,
//     password,
//     otp,
//   });

//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken -otp -verified"
//   );

//   if (!createdUser) {
//     throw new ApiError(500, "Something went wrong while registering the user");
//   }

//   setTimeout(async () => {
//     const user = await User.findOne({ email });
//     if (user && !user.verified) {
//       await User.findByIdAndDelete(user._id);
//       console.log(
//         `User ${email} deleted due to OTP not being verified within time limit.`
//       );
//     }
//   }, 180000);

//   return res
//     .status(201)
//     .json(new ApiResponse(201, createdUser, "New account is created"));
// });

// const verifyUser = asyncHandler(async (req, res) => {
//   const { email, otp } = req.body;

//   if (!(email || otp)) {
//     throw new ApiError(400, "Please provide email and otp");
//   }

//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new ApiError(404, "User does not  exists");
//   }
//   if (user.otp !== otp) {
//     throw new ApiError(400, "please provide correct otp");
//   }
//   user.otp = null;

//   user.verified = true;
//   user.save();

//   return res
//     .status(200)
//     .json(new ApiResponse(200, {}, "Registered successfully"));
// });

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
    .json(new ApiResponse(200, {}, "Password is updated successfully."));
});

//Secured routes

//Get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user)
    .populate("avatar")
    .select("-password -otp -verified");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current user fetched successfully"));
});

//Get all user
const getAllUser = asyncHandler(async (req, res) => {
  const { searchKey } = req.query;
  let filter = {};

  filter.username = { $regex: new RegExp(searchKey, "i") };
  filter.email = { $regex: new RegExp(searchKey, "i") };

  const user = await User.find(filter).select("username email");
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

  if (
    !UserRoleList.filter((role) => role !== UserRole.MASTER).includes(
      updateRole.toLowerCase()
    )
  ) {
    throw new ApiError(
      400,
      "'updateRole' must be either 'employee' or 'HR' or 'IS' or 'Finance' or 'Admin'"
    );
  }

  const user = await User.findByIdAndUpdate(
    updateUserId,
    { $set: { role: updateRole } },
    { new: true }
  ).select("-password -otp -verified");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User role is updated successfully"));
});

//Update user details
const updateUserDetails = asyncHandler(async (req, res) => {
  const { fullname, contactNo, dob, avatar } = req.body;

  let user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { fullname, contactNo, dob } },
    { new: true }
  ).select("-password -otp-verified");

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  let img_id = null;

  if (avatar || avatarLocalPath) {
    await File.findByIdAndDelete(user.avatar);
    if (avatarLocalPath) {
      const attachFile = await fileToBase64(avatarLocalPath);
      img_id = await saveBase64Data(attachFile);
      fs.unlinkSync(avatarLocalPath);
    }
    if (avatar) {
      img_id = await saveBase64Data(avatar);
    }
    user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avatar: img_id } },
      { new: true }
    ).select("-password -otp -verified");
  }

  return res.status(200).json({
    success: true,
    message: "User details updated successfully",
    user,
  });
});

const getProfilePicture = asyncHandler(async (req, res) => {
  const { fileId } = req.query;

  if (!fileId) {
    throw new ApiError(400, "Please provide id of file.");
  }
  const file = await File.findById(fileId);

  if (!file) {
    throw new ApiError(404, "File not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, file, "Profile picture fetched successfully."));
});

export {
  getAllUser,
  getCurrentUser,
  getProfilePicture,
  // registerUser,
  loginUser,
  logoutUser,
  // verifyUser,
  otpForPassword,
  updateUserDetails,
  updateUserRole,
  verifyOTPForForgotPassword,
};
