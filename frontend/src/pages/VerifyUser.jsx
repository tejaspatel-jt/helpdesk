import React from "react";

export default function VerifyUser() {
  return (
    <>
      {loading && <Loader />}
      <div className="flex bg-white min-h-full flex-1 flex-col justify-center px-6 py-10 lg:px-8">
        <FormLayout>
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
}
