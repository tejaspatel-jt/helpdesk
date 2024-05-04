import React from "react";
import { GrClose } from "react-icons/gr";
function CloseButton({ onclick }) {
  return (
    <>
      <button
        onClick={onclick}
        type="button"
        className="btn mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
      >
        <GrClose />
      </button>
    </>
  );
}

export default CloseButton;
