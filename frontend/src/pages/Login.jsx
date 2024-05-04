import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../ApiUtils/Api";
import { validateLoginFields } from "../Validation/Validation";
import FormLayout from "../components/form/FormLayout";
import FormHeader from "../components/form/FormHeader";
import FormBody from "../components/form/FormBody";
import FormSubmit from "../components/form/FormSubmit";
import FormField from "../components/form/FormField";
import FormValidation from "../components/form/FormValidation";
import image from "../images/1111.jpeg";
import PasswordField from "../components/form/PasswordField";
import AuthenticationLinks from "../components/form/AuthenticationLinks";
import LoginpageLayout from "../components/authentication/LoginpageLayout";
import Loader from "../components/loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// test commit

const LoginPage = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [showPassword, setShowPassword] = useState(false);

  const apiService = new ApiService(setLoading);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Handler function to check screen width on window resize
  const handleResize = () => {
    setIsDesktop(window.innerWidth >= 1024);
  };

  // Add event listener on mount to listen for window resize
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // todo : Remove this static data
    setEmail("kamleshsta@gmail.com");
    setPassword("sdvadsv");
    // todod : end

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLoginFields(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await apiService.login(email, password);
      if (response.status === 200) {
        showToastMessage("Login successfully!");
        setTimeout(() => {
          handleLogin();
          navigate("/home");
        }, 1000);
      } else {
        setErrors({ form: "Invalid credentials" });
      }
    } catch (err) {
      console.log(err);
      setErrors({ form: err.message });
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
      <LoginpageLayout>
        {isDesktop && (
          <div
            className=" flex bg-center mr-[1%] bg-cover min-h-screen w-full bg-white "
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        )}
        <FormLayout>
          <FormBody handleSubmit={handleSubmit}>
            <FormHeader label={"Login"} />
            <div>
              <FormField
                labelFor={email}
                inputType={email}
                placeholder={"Enter your email"}
                onchange={(e) => setEmail(e.target.value)}
              >
                Email:
              </FormField>
              {errors.email && <FormValidation>{errors.email}</FormValidation>}
            </div>
            <div>
              <PasswordField
                labelFor={password}
                placeholder={"Enter your password"}
                value={password}
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                onClick={toggleShowPassword}
                showPassword={showPassword}
              >
                Password:
              </PasswordField>
              {errors.password && (
                <FormValidation>{errors.password}</FormValidation>
              )}
            </div>
            <div>
              <FormSubmit>Login</FormSubmit>
              {errors.form && <FormValidation>{errors.form}</FormValidation>}
            </div>
          </FormBody>

          <AuthenticationLinks
            message={"Don't have an account?"}
            pagename={"Sign up now!"}
            route={"/register"}
          />

          <AuthenticationLinks
            pagename={"Forgot Password ?"}
            route={"/forgotPassword"}
          />

          <ToastContainer closeOnClick />
        </FormLayout>
      </LoginpageLayout>
    </>
  );
};

export default LoginPage;
