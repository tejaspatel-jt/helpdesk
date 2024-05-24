import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../components/stepper/Stepper";
import { getSteps, getTicketDetails } from "../components/utils/dataProcessing";

import { ToastContainer } from "react-toastify";
import {
  ErrorToastMessage,
  SuccessToastMessage,
} from "../common/commonMethods";
import { MyRoutes, TicketStatus, UserRole } from "../common/common.config";
import ApiService from "../ApiUtils/Api";
import { UserContext } from "../components/contexts/UserContextProvider";
import DialogModal from "../components/modal/DialogModal";
import Navbar from "../components/navbar/Navbar";

const TicketDetailsPage = () => {
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { userDetails } = useContext(UserContext);
  const location = useLocation();

  const ticketDetail = location.state.ticketDetail;
  const navigate = useNavigate();
  const apiService = new ApiService(setLoading);

  useEffect(() => {
    console.log("user role", userDetails.role);
    setIsApproved(ticketDetail.status === `accepted_${userDetails.role}`);
    setIsRejected(ticketDetail.status === `rejected_${userDetails.role}`);
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
      <Navbar screen={MyRoutes.TICKET_DETAILS} />

      <div className="bg-white rounded-lg  p-8">
        <div className="flex items-baseline p-1 mb-4">
          <div className=" h-10 w-10 flex items-center  text-gray-700">
            <span className="text-xl font-semibold">{ticketData.ticketNo}</span>
          </div>
          <div className="ml-2">
            <h1 className="text-2xl  font-semibold">{ticketDetail.title}</h1>
            <p className="text-base text-gray-500">{ticketData.username}</p>
          </div>
          {userDetails.role != UserRole.EMPLOYEE && (
            <div className="mt-2 ml-auto flex justify-center space-x-8">
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
                {isApproved
                  ? TicketStatus.BUTTON_APPROVED
                  : TicketStatus.BUTTON_APPROVE}
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
                  setOpenModal(true);
                }}
              >
                {isRejected
                  ? TicketStatus.BUTTON_REJECTED
                  : TicketStatus.BUTTON_REJECT}
              </button>
            </div>
          )}
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

        {openModal && (
          <DialogModal
            message={"Are you Sure you want to Reject ?"}
            closeButtonOnClick={() => setOpenModal(false)}
            button1Name={"Reject"}
            button1StyleExtra={"btn"}
            button1Click={() => handleReject(ticketDetail._id, setIsRejected)}
          />
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default TicketDetailsPage;
