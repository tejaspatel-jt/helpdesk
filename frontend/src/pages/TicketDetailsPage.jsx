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
import { CloseButtonWhite } from "../components/button/CloseButton";
import { FaFileDownload } from "react-icons/fa";
import axios from "axios";
import DialogModal from "../components/modal/DialogModal";
import Navbar from "../components/navbar/Navbar";

const TicketDetailsPage = () => {
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { userDetails } = useContext(UserContext);
  const location = useLocation();
  const ticketDetail = location.state.ticketDetail;
  const navigate = useNavigate();
  const apiService = new ApiService(setLoading);

  useEffect(() => {
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

  const handleOpenDialog = (attachment) => {
    setSelectedAttachment(attachment);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedAttachment(null);
    setIsDialogOpen(false);
  };
  const downloadButtonClick = async (selectedAttachment) => {
    await apiService.downloadAttachment(selectedAttachment);
  };

  const renderAttachmentPreview = (attachment) => {
    const fileType = attachment.split(".").pop().toLowerCase();
    const isImage = ["jpg", "jpeg", "png"].includes(fileType);

    return isImage ? (
      <img
        src={attachment}
        alt="attachment"
        className="w-24 h-24 object-cover cursor-pointer"
        onClick={() => handleOpenDialog(attachment)}
      />
    ) : (
      <div
        className="w-24 h-24 bg-gray-200 flex items-center justify-center cursor-pointer"
        onClick={() => handleOpenDialog(attachment)}
      >
        <span className="text-lg font-semibold text-gray-600">PDF</span>
      </div>
    );
  };

  return (
    <>
      <Navbar screen={MyRoutes.TICKET_DETAILS} />

      <div className="bg-white rounded-lg p-8">
        <div className="flex items-baseline p-1 mb-4">
          <div className="h-10 w-10 flex items-center text-gray-700">
            <span className="text-xl font-semibold">{ticketData.ticketNo}</span>
          </div>
          <div className="ml-2">
            <h1 className="text-2xl font-semibold">{ticketDetail.title}</h1>
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

        <div className="px-4 py-2 mt-8  rounded-md shadow-[0_0_10px_0_rgba(0,0,0,0.3)]">
          <h2 className="text-2xl font-semibold mb-2 mt-5">Details:</h2>
          <ul className="divide-y divide-gray-200">
            <li className="py-2">
              <span className=" font-semibold">Title:</span>{" "}
              {ticketDetail.title}
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

        {ticketDetail.attachFile && ticketDetail.attachFile.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Attachments:</h2>
            <div className="flex space-x-4 ">
              {ticketDetail.attachFile.map((attachment, index) => (
                <div
                  key={index}
                  className="w-26 h-26 border-2 border-gray-500 rounded-sm"
                >
                  {renderAttachmentPreview(attachment)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isDialogOpen && (
        <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full overflow-y- h-17/20">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-600 ">
              <button onClick={handleCloseDialog}>
                <CloseButtonWhite />
              </button>
              <button
                onClick={() => {
                  downloadButtonClick(selectedAttachment);
                }}
                className="text-white"
              >
                <div className="flex items-baseline">
                  <span className="font-semibold">Download</span>
                  <FaFileDownload className="mx-2" />
                </div>
              </button>
            </div>
            <div className="p-4">
              {selectedAttachment &&
              /\.(jpg|jpeg|png)$/i.test(selectedAttachment) ? (
                <img
                  src={selectedAttachment}
                  alt="attachment"
                  className="w-full h-auto"
                />
              ) : (
                <iframe
                  src={selectedAttachment}
                  title="attachment"
                  className="w-full min-h-96"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {openModal && (
        <DialogModal
          title={"Confirmation"}
          message={"Are you Sure you want to Reject ?"}
          closeButtonOnClick={() => setOpenModal(false)}
          button1Name={"Reject"}
          button1StyleExtra={"btn"}
          button1Click={() => {
            handleReject(ticketDetail._id, setIsRejected);
            setOpenModal(false);
          }}
        />
      )}

      <ToastContainer />
    </>
  );
};

export default TicketDetailsPage;
