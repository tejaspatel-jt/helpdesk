import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import Stepper from "../components/stepper/Stepper";
import { getSteps } from "../components/utils/dataProcessing";

const TicketDetailsPage = ({ onLogout }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const location = useLocation();
  const loading = false;
  const ticketDetail = location.state.ticketDetail;
  const navigate = useNavigate(); // Access navigate function for redirection

  const goBack = () => {
    navigate(-1); // Redirect to previous page
  };

  const steps = getSteps(ticketDetail);

  return (
    <>
      {/* ------------------------------Navbar-------------------------------- */}
      <nav className="bg-gray-800 h-16">
        <div className="flex h-full  max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
          <button
            onClick={goBack}
            className="text-white text-xl hover:text-gray-300 flex items-center"
          >
            <ArrowLeftIcon className="w-6 h-6 mr-1" />
            Go Back
          </button>
        </div>
      </nav>

      {/* <----------------------First version of the page ----------------> */}
      <div className="bg-white rounded-lg  p-8">
        <div className="flex items-center p-1 mb-4">
          {ticketDetail.statusFlow.fromUser.updatedBy.avatar ? (
            <img
              src={ticketDetail.statusFlow.fromUser.updatedBy.avatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-200 mr-2"
            />
          ) : (
            <div className="border rounded-full h-10 w-10 flex items-center justify-center bg-gray-200 text-gray-600">
              <span className="text-xl font-semibold">
                {ticketDetail.statusFlow.fromUser.updatedBy.username
                  .charAt(0)
                  .toUpperCase()}
                {ticketDetail.statusFlow.fromUser.updatedBy.username.indexOf(
                  " "
                ) !== -1
                  ? ticketDetail.statusFlow.fromUser.updatedBy.username
                      .charAt(
                        ticketDetail.statusFlow.fromUser.updatedBy.username.indexOf(
                          " "
                        ) + 1
                      )
                      .toUpperCase()
                  : ""}
              </span>
            </div>
          )}
          <div className="ml-2">
            <h1 className="text-2xl  font-semibold">{ticketDetail.title}</h1>
            <p className="text-base text-gray-500">
              {ticketDetail.statusFlow.fromUser.updatedBy.username}
            </p>
          </div>
        </div>

        {/* ---------------------------------Stepper--------------------------------------- */}
        <Stepper steps={steps} />

        <div className="">
          <h2 className="text-xl font-semibold mb-2 mt-5">Details:</h2>
          <ul className="divide-y divide-gray-200">
            <li className="py-2">
              <span className="font-semibold">Title:</span> {ticketDetail.title}
            </li>
            <li className="py-2">
              <span className="font-semibold">Description:</span>{" "}
              {ticketDetail.description}
            </li>
            <li className="py-2">
              <span className="font-semibold">Department:</span>{" "}
              {ticketDetail.department}
            </li>
            <li className="py-2">
              <span className="font-semibold">Created Date:</span>{" "}
              {new Date(ticketDetail.createdAt).toLocaleString()}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default TicketDetailsPage;
