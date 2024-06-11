import React from "react";

function FormSubmit({ children, onclick }) {
  return (
    <>
      <button
        type="submit"
        className="flex w-full justify-center rounded-md bg-jtBlue px-3 py-1.5 text-base font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={onclick}
      >
        {children}
      </button>
    </>
  );
}

export default FormSubmit;
