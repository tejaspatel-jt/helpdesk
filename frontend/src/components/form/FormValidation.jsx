import React from "react";

function FormValidation({ children }) {
  return (
    <>
      <p className={`text-red-500 text-sm sm:w-full lg:[60%] mt-2`}>
        {children}
      </p>
    </>
  );
}

export default FormValidation;
