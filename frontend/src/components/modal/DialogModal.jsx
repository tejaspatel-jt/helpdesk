import React from "react";

import Card from "../card/Card";
import CloseButton from "../button/CloseButton";
function DialogModal({
  title,
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
      <Card extraStyle={"p-4"}>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <div className="font-bold text-xl">{title}</div>
            <CloseButton onclick={closeButtonOnClick} />
          </div>
          <div className="mt-4">{message}</div>
        </div>
        <div className="flex justify-end items-end mt-5 ">
          <button
            onClick={button1Click}
            className={`text-xl bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md ${button1StyleExtra}`}
          >
            {button1Name}
          </button>
          <button
            onClick={button2Click}
            className={`text-xl bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md ${button2StyleExtra}`}
          >
            {button2Name}
          </button>
          <button
            onClick={button3Click}
            className={`text-xl bg-gray-500 hover:bg-gray-600 text-white rounded-md shadow-md ${button3StyleExtra}`}
          >
            {button3Name}
          </button>
        </div>
      </Card>
    </>
  );
}

export default DialogModal;
