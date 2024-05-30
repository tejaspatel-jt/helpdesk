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
    <Card extraStyle="p-4 bg-white rounded-md shadow-md">
      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>
          <CloseButton onClick={closeButtonOnClick} />
        </div>
        <p className="text-gray-700">{message}</p>
      </div>
      <div className="flex justify-end mt-4">
        {button3Name && (
          <button
            onClick={button3Click}
            className={`bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md shadow-md ${button3StyleExtra}`}
          >
            {button3Name}
          </button>
        )}
        {button2Name && (
          <button
            onClick={button2Click}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md ${button2StyleExtra}`}
          >
            {button2Name}
          </button>
        )}
        {button1Name && (
          <button
            onClick={button1Click}
            className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-md ${button1StyleExtra}`}
          >
            {button1Name}
          </button>
        )}
      </div>
    </Card>
  );
}

export default DialogModal;
