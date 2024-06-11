import React from "react";

function FormLayout({ children }) {
  return (
    <>
      <div className=" sm:mx-auto sm:w-full sm:max-w-sm place-content-center">
        {children}
      </div>
    </>
  );
}

export default FormLayout;
