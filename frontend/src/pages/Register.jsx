import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../ApiUtils/Api";
import { validateRegisterFields } from "../Validation/Validation";
import FormLayout from "../components/form/FormLayout";
import FormHeader from "../components/form/FormHeader";
import FormBody from "../components/form/FormBody";
import FormSubmit from "../components/form/FormSubmit";
import FormField from "../components/form/FormField";
import FormValidation from "../components/form/FormValidation";
import AuthenticationLinks from "../components/form/AuthenticationLinks";
import PasswordField from "../components/form/PasswordField";
import Layout from "../components/authentication/Layout";
import Loader from "../components/loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOTPSent] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOTP] = useState("");
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiService = new ApiService(setLoading);

  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegisterFields(username, email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await apiService.sendRegisterOTP(
        username,
        email,
        password
      );
      if (response.status === 201) {
        setSuccess(true);
        setOTPSent(true);

        showToastMessage("OTP Sent Successfully ! ");

        setError("");
      } else {
        setError("Failed to send OTP.");
      }
    } catch (err) {
      setError(`An error occurred: ${err.message}`);
    }
  };

  const handleOTPRegister = async (e) => {
    e.preventDefault();
    // Validate OTP format
    if (!otp) {
      setError("OTP required!");
      return;
    }

    // Send a request to change the password with OTP validation
    try {
      const response = await apiService.verifyRegisterOTP(email, otp);

      if (response.status === 200) {
        setSuccess(true);
        setChangeSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);
        showToastMessage("Registered Successfully ! ");
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
      <Layout>
        <FormLayout>
          {!otpSent && (
            <FormBody handleSubmit={handleRegister}>
              <FormHeader label={"Register"} />
              <div>
                <FormField
                  labelFor={username}
                  inputType={username}
                  placeholder={"Enter Username"}
                  onchange={(e) => setUsername(e.target.value)}
                >
                  Username:
                </FormField>
                {errors.username && (
                  <FormValidation>{errors.username}</FormValidation>
                )}
              </div>
              <div>
                <FormField
                  labelFor={email}
                  inputType={email}
                  placeholder={"Enter email"}
                  onchange={(e) => setEmail(e.target.value)}
                >
                  Email:
                </FormField>
                {errors.email && (
                  <FormValidation>{errors.email}</FormValidation>
                )}
              </div>
              <div>
                <PasswordField
                  labelFor={password}
                  value={password}
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  onClick={toggleShowPassword}
                  showPassword={showPassword}
                >
                  Password:
                </PasswordField>
                {errors.password && (
                  <FormValidation> {errors.password}</FormValidation>
                )}
              </div>
              <div>
                <FormSubmit>Send Verification OTP</FormSubmit>

                {error && <FormValidation> {error}</FormValidation>}
              </div>
            </FormBody>
          )}
          {otpSent && !changeSuccess && (
            <FormBody handleSubmit={handleOTPRegister}>
              <FormHeader label={"Enter Received OTP"} />
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
                {error.form && <FormValidation> {error.form}</FormValidation>}
              </div>
              <FormSubmit>Register</FormSubmit>
            </FormBody>
          )}
        </FormLayout>
        <AuthenticationLinks
          message={"Already have an account?"}
          pagename={"Sign In"}
          route={"/"}
        />
        <ToastContainer />
      </Layout>
    </>
  );
}

export default Register;
