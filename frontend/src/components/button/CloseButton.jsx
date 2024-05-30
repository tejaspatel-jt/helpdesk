import React from "react";
import { GrClose } from "react-icons/gr";
function CloseButton({ onclick }) {
  return (
    <>
      <button
        onClick={onclick}
        type="button"
        className=" text-black text-lg rounded-md hover:rounded-full p-1.5 hover:bg-gray-200"
      >
        <GrClose />
      </button>
    </>
  );
}

export default CloseButton;

export function CloseButtonWhite({ onclick }) {
  return (
    <>
      <button
        onClick={onclick}
        type="button"
        className="p-4 text-white text-lg rounded-md hover:bg-gray-700"
      >
        <GrClose />
      </button>
    </>
  );
}
