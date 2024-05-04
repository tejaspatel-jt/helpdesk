import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function PasswordField({
  children,
  type,
  value,
  onChange,
  onClick,
  showPassword,
  labelFor,
}) {
  return (
    <>
      <div>
        <label
          htmlFor={labelFor}
          className="block text-sm font-semibold leading-6 text-gray-900"
        >
          {children}
        </label>
        <div className="relative w-full">
          <input
            type={type} // Toggle between text and password type
            value={value}
            onChange={onChange}
            placeholder="Enter your password"
            className="block w-full rounded-md p-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />

          {/* Toggle icon */}
          <button
            type="button"
            className="absolute inset-y-0 right-2 flex items-center"
            onClick={onClick}
          >
            {showPassword ? (
              <FaEyeSlash className="text-gray-500" />
            ) : (
              <FaEye className="text-gray-500" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default PasswordField;
