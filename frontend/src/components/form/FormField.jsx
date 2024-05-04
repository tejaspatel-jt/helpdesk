import React from "react";

function FormField({ children, labelFor, inputType, onchange, placeholder }) {
  return (
    <>
      <div>
        <label
          htmlFor={labelFor}
          className="block text-sm font-semibold leading-6 text-gray-900"
        >
          {children}
        </label>
        <div>
          <input
            id={`${inputType}`}
            name={`${inputType}`}
            type={`${inputType}`}
            autoComplete={`${inputType}`}
            placeholder={placeholder}
            value={inputType}
            className="block w-full rounded-md p-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={onchange}
          />
        </div>
      </div>
    </>
  );
}

export default FormField;
