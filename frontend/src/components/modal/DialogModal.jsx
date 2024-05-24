import React from "react";

import Card from "../card/Card";
import CloseButton from "../button/CloseButton";
function DialogModal({
  message,
  closeButtonOnClick,
  button1Name,
  button1StyleExtra,
  button1Click,
  button2Name,
  button2StyleExtra,
  button2Click,
  button3Name,
  button3Click,
  button3StyleExtra,
  canDismissed = false,
}) {
  return (
    <>
      <Card>
        <div className="flex justify-between items-center">
          {message}
          <CloseButton onclick={closeButtonOnClick} />
        </div>
        <div className="flex justify-end items-end mt-3 ">
          <button
            onClick={button1Click}
            className={` bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md ${button1StyleExtra}`}
          >
            {button1Name}
          </button>
          <button
            onClick={button2Click}
            className={` bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md ${button2StyleExtra}`}
          >
            {button2Name}
          </button>
          <button
            onClick={button3Click}
            className={` bg-gray-500 hover:bg-gray-600 text-white rounded-md shadow-md ${button3StyleExtra}`}
          >
            {button3Name}
          </button>
        </div>
      </Card>
    </>
  );
}

export default DialogModal;
