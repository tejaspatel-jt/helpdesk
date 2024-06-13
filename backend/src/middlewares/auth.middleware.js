import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { UserRole, UserRoleList } from "../constants.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

const authorizedAccess = (req, res, next) => {
  const { user } = req;

  if (
    !user ||
    !UserRoleList.filter((role) => role !== UserRole.EMPLOYEE).includes(
      user.role.toLowerCase()
    )
  ) {
    throw new ApiError(401, "Unauthorized request");
  }

  // If user is admin or superadmin, proceed to the next middleware
  next();
};

export { verifyJWT, authorizedAccess };
