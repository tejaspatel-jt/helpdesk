import React from "react";

function FormLayout({ children }) {
  return (
    <>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm place-content-center">
        {children}
      </div>
    </>
  );
}

export default FormLayout;
