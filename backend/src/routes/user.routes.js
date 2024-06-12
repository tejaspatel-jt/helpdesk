import { Router } from "express";
import {
  getAllUser,
  getCurrentUser,
  getProfilePicture,
  loginUser,
  logoutUser,
  otpForPassword,
  updateUserDetails,
  updateUserRole,
  verifyOTPForForgotPassword,
} from "../controllers/user.controller.js";
import { authorizedAccess, verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// router.route("/register").post(
//   upload.fields([
//     {
//       name: "avatar",
//       maxCount: 1,
//     },
//   ]),
//   registerUser
// );
// router.route("/verify/register").patch(verifyUser);

router.route("/login").post(loginUser);
router.route("/password/reset").patch(otpForPassword);
router.route("/password/save").patch(verifyOTPForForgotPassword);

//Secured
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current").get(verifyJWT, getCurrentUser);
router.route("/get/all").get(verifyJWT, authorizedAccess, getAllUser);
router.route("/update/role").patch(verifyJWT, authorizedAccess, updateUserRole);
router.route("/update/details").patch(
  verifyJWT,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  updateUserDetails
);
router.route("/get/profile/picture").get(verifyJWT, getProfilePicture);

export default router;
