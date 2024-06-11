import React from "react";

function FormHeader({ label }) {
  return (
    <>
      <div className="flex  min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
        <h2 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight text-gray-600">
          {label}
        </h2>
      </div>
    </>
  );
}

export default FormHeader;
