import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import Stepper from "../components/stepper/Stepper";
import { getSteps, getTicketDetails } from "../components/utils/dataProcessing";

import { ToastContainer } from "react-toastify";
import {
  ErrorToastMessage,
  SuccessToastMessage,
} from "../common/commonMethods";
import { TicketStatus } from "../common/common.config";
import ApiService from "../ApiUtils/Api";
import { UserContext } from "../components/contexts/UserContextProvider";

const TicketDetailsPage = ({ onLogout }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userDetails } = useContext(UserContext);

  const location = useLocation();

  const ticketDetail = location.state.ticketDetail;
  const navigate = useNavigate();
  const apiService = new ApiService(setLoading);

  useEffect(() => {
    console.log("user role", userDetails.role);
    setIsApproved(ticketDetail.status === `accepted_${userDetails.role}`);
    // setIsApproved(ticket.status.includes("accepted"));
    setIsRejected(ticketDetail.status === `rejected_${userDetails.role}`);
    // setIsRejected(ticket.status.includes("rejected"));
  }, [ticketDetail.status]);

  const goBack = () => {
    navigate(-1);
  };

  const steps = getSteps(ticketDetail);
  const ticketData = getTicketDetails(ticketDetail);

  const handleApprove = async (ticketId, setIsApproved) => {
    const body = {
      ticketId: ticketId,
      ticketStatus: TicketStatus.ACCEPTED,
    };

    try {
      const response = await apiService.handleApproveOrReject(body);
      if (response.status === 200) {
        setIsApproved(true);

        SuccessToastMessage("Ticket approved successfully!");
        setTimeout(() => {
          goBack();
        }, 2000);
      } else {
        ErrorToastMessage("Failed to approve ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error approving ticket:", error);
      alert("An error occurred while approving the ticket.");
    }
  };

  const handleReject = async (ticketId, setIsRejected) => {
    const body = {
      ticketId: ticketId,
      ticketStatus: TicketStatus.REJECTED,
    };
    try {
      const response = await apiService.handleApproveOrReject(body);
      if (response.status === 200) {
        setIsRejected(true);
        SuccessToastMessage("Ticket rejected successfully!");
        setTimeout(() => {
          goBack();
        }, 2000);
      } else {
        ErrorToastMessage("Failed to reject ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error rejecting ticket:", error);
      alert("An error occurred while rejecting the ticket.");
    }
  };

  return (
    <>
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

      <div className="bg-white rounded-lg  p-8">
        <div className="flex items-baseline p-1 mb-4">
          <div className=" h-10 w-10 flex items-center  text-gray-700">
            <span className="text-xl font-semibold">{ticketData.ticketNo}</span>
          </div>
          <div className="ml-2">
            <h1 className="text-2xl  font-semibold">{ticketDetail.title}</h1>
            <p className="text-base text-gray-500">{ticketData.username}</p>
          </div>
        </div>

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

        <div className="mt-2 flex justify-center space-x-8">
          <button
            disabled={isApproved || isRejected}
            className={`text-white px-3 py-1 ${
              isApproved || isRejected
                ? "bg-gray-300 hover:bg-gray-300"
                : "bg-green-500 hover:bg-green-600"
            } rounded-md shadow-md mr-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
            onClick={(event) => {
              event.stopPropagation();
              handleApprove(ticketDetail._id, setIsApproved);
            }}
          >
            {isApproved ? TicketStatus.APPROVED : TicketStatus.APPROVE}
          </button>
          <button
            disabled={isApproved || isRejected}
            className={`text-white px-3 py-1 ${
              isRejected || isApproved
                ? "bg-gray-300 hover:bg-gray-300"
                : "bg-red-500 hover:bg-red-600"
            } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500`}
            onClick={(event) => {
              event.stopPropagation();
              handleReject(ticketDetail._id, setIsRejected);
            }}
          >
            {isRejected ? TicketStatus.REJECTED : TicketStatus.REJECT}
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default TicketDetailsPage;

// --------------CURRENT WORKING CODE OF TICKET DETAILS PAGE 22May---------------
// import React, { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
// import Stepper from "../components/stepper/Stepper";
// import { getSteps, getTicketDetails } from "../components/utils/dataProcessing";

// const TicketDetailsPage = ({ onLogout }) => {
//   const [currentStep, setCurrentStep] = useState(0);

//   const location = useLocation();
//   const loading = false;
//   const ticketDetail = location.state.ticketDetail;
//   const navigate = useNavigate(); // Access navigate function for redirection

//   const goBack = () => {
//     navigate(-1); // Redirect to previous page
//   };

//   const steps = getSteps(ticketDetail);
//   const ticketData = getTicketDetails(ticketDetail);

//   const handleApprove = () => {
//     alert("Ticket Approved Successfully");
//   };
//   const handleReject = () => {
//     alert("Ticket Rejected Successfully");
//   };

//   return (
//     <>
//       {/* ------------------------------Navbar-------------------------------- */}
//       <nav className="bg-gray-800 h-16">
//         <div className="flex h-full  max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
//           <button
//             onClick={goBack}
//             className="text-white text-xl hover:text-gray-300 flex items-center"
//           >
//             <ArrowLeftIcon className="w-6 h-6 mr-1" />
//             Go Back
//           </button>
//         </div>
//       </nav>

//       {/* <----------------------First version of the page ----------------> */}
//       <div className="bg-white rounded-lg  p-8">
//         <div className="flex items-baseline p-1 mb-4">
//           <div className=" h-10 w-10 flex items-center  text-gray-700">
//             <span className="text-xl font-semibold">{ticketData.ticketNo}</span>
//           </div>
//           <div className="ml-2">
//             <h1 className="text-2xl  font-semibold">{ticketDetail.title}</h1>
//             <p className="text-base text-gray-500">{ticketData.username}</p>
//           </div>
//         </div>

//         {/* ---------------------------------Stepper--------------------------------------- */}
//         <Stepper steps={steps} />

//         <div className="">
//           <h2 className="text-xl font-semibold mb-2 mt-5">Details:</h2>
//           <ul className="divide-y divide-gray-200">
//             <li className="py-2">
//               <span className="font-semibold">Title:</span> {ticketDetail.title}
//             </li>
//             <li className="py-2">
//               <span className="font-semibold">Description:</span>{" "}
//               {ticketDetail.description}
//             </li>
//             <li className="py-2">
//               <span className="font-semibold">Department:</span>{" "}
//               {ticketDetail.department}
//             </li>
//             <li className="py-2">
//               <span className="font-semibold">Created Date:</span>{" "}
//               {new Date(ticketDetail.createdAt).toLocaleString()}
//             </li>
//           </ul>
//         </div>

//         <div className="mt-2 flex justify-center space-x-8">
//           <button
//             onClick={handleApprove}
//             className={` text-white px-3 py-1 w-[100px] bg-green-500 rounded-md shadow-md  focus:outline-none focus:ring-2 focus:ring-green-500`}
//           >
//             Approve
//           </button>
//           <button
//             onClick={handleReject}
//             className={` text-white px-3 py-1 w-[100px] rounded-md shadow-md  bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500`}
//           >
//             Reject
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TicketDetailsPage;
