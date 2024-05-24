import React, { useState } from "react";
import FormLayout from "../components/form/FormLayout";
import FormHeader from "../components/form/FormHeader";
import FormBody from "../components/form/FormBody";
import FormSubmit from "../components/form/FormSubmit";
import FormField from "../components/form/FormField";
import FormValidation from "../components/form/FormValidation";
import AuthenticationLinks from "../components/form/AuthenticationLinks";
import { validateEmail } from "../Validation/Validation";
import ApiService from "../ApiUtils/Api";
import { changePasswordWithOTP } from "../ApiUtils/Api";
import Loader from "../components/loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOTPSent] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiService = new ApiService(setLoading);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    // Validate email format
    if (!email) {
      setError("Email required!");
      return;
    } else if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    // Send a request to the server to initiate the password reset process
    try {
      const response = await apiService.sendPasswordResetOTP(email);

      if (response.status === 200) {
        setOTPSent(true);
        showToastMessage("OTP Sent Successfully");
        setError("");
      } else {
        setError("Failed to send OTP.");
      }
    } catch (err) {
      setError(`An error occurred: ${err.message}`);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    // Validate OTP format
    if (!otp) {
      setError("OTP required!");
      return;
    }

    // Validate password fields
    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    } else if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Send a request to change the password with OTP validation
    try {
      const response = await apiService.changePasswordWithOTP(
        email,
        otp,
        newPassword,
        confirmPassword
      );

      if (response.status === 200) {
        setChangeSuccess(true);
        showToastMessage("Password Changed Successfully!");
        setError("");
      } else {
        setError("Failed to change password. Please check OTP.");
      }
    } catch (err) {
      setError(`An error occurred: ${err.message}`);
    }
  };

  const showToastMessage = (message) => {
    toast.success(message, {
      position: "top-right",
    });
  };

  return (
    <>
      {loading && <Loader />}
      <div className="flex bg-white min-h-full flex-1 flex-col justify-center px-6 py-10 lg:px-8">
        <FormLayout>
          {!otpSent && (
            <FormBody handleSubmit={handleForgotPassword}>
              <FormHeader label={"Forgot Password"} />
              <div>
                <FormField
                  labelFor={email}
                  inputType={email}
                  placeholder={"Enter your email"}
                  onchange={(e) => setEmail(e.target.value)}
                >
                  Email:
                </FormField>
                {error && <FormValidation>{error}</FormValidation>}
              </div>
              <FormSubmit>Send OTP</FormSubmit>
            </FormBody>
          )}
          {otpSent && !changeSuccess && (
            <FormBody handleSubmit={handleChangePassword}>
              <FormHeader label={"Enter OTP and New Password"} />
              <div>
                <FormField
                  labelFor={email}
                  inputType={email}
                  placeholder={"Enter email"}
                  onchange={(e) => setEmail(e.target.value)}
                >
                  Email:
                </FormField>
                <FormField
                  labelFor={otp}
                  inputType={otp}
                  placeholder={"Enter OTP received via email"}
                  onchange={(e) => setOTP(e.target.value)}
                >
                  OTP:
                </FormField>
                <FormField
                  labelFor={newPassword}
                  inputType={newPassword}
                  placeholder={"Enter new password"}
                  onchange={(e) => setNewPassword(e.target.value)}
                >
                  New Password:
                </FormField>
                <FormField
                  labelFor={confirmPassword}
                  inputType={confirmPassword}
                  placeholder={"Confirm new password"}
                  onchange={(e) => setConfirmPassword(e.target.value)}
                >
                  Confirm Password:
                </FormField>
                {error && <FormValidation>{error}</FormValidation>}
              </div>
              <FormSubmit>Submit</FormSubmit>
            </FormBody>
          )}
        </FormLayout>
        <AuthenticationLinks
          message={"Remembered your password?"}
          pagename={"Go back to Login"}
          route={"/"}
        />
        <ToastContainer />
      </div>
    </>
  );
};

export default ForgotPassword;
