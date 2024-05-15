import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import { FaCheck, FaArrowRightLong } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { MdOutlineCreate } from "react-icons/md";

// import { ArrowLeftIcon, CheckIcon, XIcon } from "@heroicons/react/outline";

const TicketDetailsPage = ({ onLogout }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const location = useLocation();
  const loading = false;
  const ticketDetail = location.state.ticketDetail;
  const navigate = useNavigate(); // Access navigate function for redirection

  const goBack = () => {
    navigate(-1); // Redirect to previous page
  };

  const statusIcons = {
    pending: <MdOutlineCreate className="w-6 h-6 text-gray-300" />,
    accepted_master: <FaCheck className="w-6 h-6 text-green-500" />,
    rejected_master: <IoMdClose className="w-6 h-6 text-red-500" />,
    accepted_department: <FaCheck className="w-6 h-6 text-green-500" />,
    rejected_department: <IoMdClose className="w-6 h-6 text-red-500" />,
  };
  // Define status labels
  const statusLabels = {
    pending: "Pending",
    accepted_master: "Accepted by Master",
    rejected_master: "Rejected by Master",
    accepted_department: "Accepted by Department",
    rejected_department: "Rejected by Department",
  };
  return (
    <>
      <nav className="bg-gray-800 h-16">
        <div className="flex h-full  max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
          <button
            onClick={goBack}
            className="text-white hover:text-gray-300 flex items-center"
          >
            <ArrowLeftIcon className="w-6 h-6 mr-1" />
            Go Back
          </button>
        </div>
      </nav>

      {/* <----------------------First version of the page ----------------> */}
      <div className="bg-white rounded-lg  p-8">
        <div className="flex items-center p-1 mb-4">
          {ticketDetail.user.avatar ? (
            <img
              src={ticketDetail.user.avatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-200 mr-2"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
          )}
          <div>
            <h1 className="text-2xl font-semibold">{ticketDetail.title}</h1>
            <p className="text-base text-gray-500">
              {ticketDetail.user.username}
            </p>
          </div>
        </div>

        <div className="flex items-center border border-gray-500 p-5 rounded-md justify-center mb-4 space-x-8">
          {Object.keys(statusLabels).map((statusKey, index) => {
            if (
              ticketDetail.status === "accepted_department" ||
              ticketDetail.status === "rejected_department" ||
              ((ticketDetail.status === "accepted_master" ||
                ticketDetail.status === "rejected_master") &&
                index === 0) ||
              index === Object.keys(statusLabels).indexOf(ticketDetail.status)
            ) {
              return (
                <React.Fragment key={statusKey}>
                  {index > 0 && <FaArrowRightLong className="text-gray-500" />}
                  <div className="flex items-center">
                    <div className="relative">
                      {ticketDetail.status === statusKey ? (
                        <FaCheck className="w-6 h-6 text-green-500 animate-pulse" />
                      ) : (
                        <MdOutlineCreate className="w-6 h-6 text-gray-300 animate-pulse" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {statusLabels[statusKey]}
                    </div>
                  </div>
                </React.Fragment>
              );
            }
            return null;
          })}
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Details:</h2>
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
