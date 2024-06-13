import React from "react";
import "../../styles/stepper.css";
import { GoTriangleRight } from "react-icons/go";

function Step({ details, last }) {
  console.log("details in step -- ", details);
  return (
    <>
      <div className="flex items-center gap-5">
        <div className="flex flex-col items-center border border-gray-500 rounded-md p-3">
          {/* <div className="flex flex-col items-center p-3"> */}
          <div>
            {details.avatar ? (
              <img
                src={details.avatar.base64File}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border border-gray-200 "
              />
            ) : (
              <div className="border rounded-full h-10 w-10 flex items-center justify-center bg-gray-200 text-gray-600">
                <span className="text-xl font-semibold">
                  {details.username.charAt(0).toUpperCase()}
                  {details.username.indexOf(" ") !== -1
                    ? details.username
                        .charAt(details.username.indexOf(" ") + 1)
                        .toUpperCase()
                    : ""}
                </span>
              </div>
            )}
          </div>
          <h1 className="username font-bold">{details.username}</h1>
          <div className="status font-semibold pt-2">{details.status}</div>
          {/* <div className="updatedAt">{details.updatedAt}</div> */}
        </div>
        {!last && (
          <div className="flex items-center">
            <div className="transition-line">
              <span className="content">{details.status}</span>
              <div className="arrow">
                <div className="arrow-tail"></div>
                {/* <div className="arrow-head"></div> */}
              </div>
              <div className="content flex items-center justify-center gap-2 mx-1">
                <div>{details.updatedAt}</div>
              </div>
            </div>
            <svg
              width="35"
              height="50"
              viewBox="0 0 50 50"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="0,0 50,25 0,50" fill="gray" />
            </svg>
          </div>
        )}
      </div>
    </>
  );
}

export default function Stepper({ steps }) {
  console.log("Stepper steps -- ", steps);
  return (
    <div className="flex flex-col  rounded-md shadow-[0_0_10px_0_rgba(0,0,0,0.3)]">
      <div className="text-2xl font-semibold pl-4 py-2">
        <h1>Status Flow:</h1>
      </div>
      <div className="flex p-4 gap-5 justify-center">
        <div></div>
        {steps.map((step, i, arr) => (
          <div>
            <Step details={step} last={i == arr.length - 1} />
          </div>
        ))}
      </div>
    </div>
  );
}
