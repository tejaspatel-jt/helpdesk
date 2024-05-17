import React from "react";
import { GrClose } from "react-icons/gr";
function CloseButton({ onclick }) {
  return (
    <>
      <button
        onClick={onclick}
        type="button"
        className="btn py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
      >
        <GrClose />
      </button>
    </>
  );
}

export default CloseButton;
