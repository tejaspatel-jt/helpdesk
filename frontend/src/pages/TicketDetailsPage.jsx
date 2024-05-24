import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { CloseButtonWhite } from "../components/button/CloseButton";
import { FaFileDownload } from "react-icons/fa";
import axios from "axios";

const TicketDetailsPage = ({ onLogout }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const { userDetails } = useContext(UserContext);
  // const apiService = new ApiService(setLoading);

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
      <nav className="bg-gray-800 h-16">
        <div className="flex h-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
          <button
            onClick={goBack}
            className="text-white text-xl hover:text-gray-300 flex items-center"
          >
            <ArrowLeftIcon className="w-6 h-6 mr-1" />
            Go Back
          </button>
        </div>
      </nav>

      <div className="bg-white rounded-lg p-8">
        <div className="flex items-baseline p-1 mb-4">
          <div className="h-10 w-10 flex items-center text-gray-700">
            <span className="text-xl font-semibold">{ticketData.ticketNo}</span>
          </div>
          <div className="ml-2">
            <h1 className="text-2xl font-semibold">{ticketDetail.title}</h1>
            <p className="text-base text-gray-500">{ticketData.username}</p>
          </div>
        </div>

        <Stepper steps={steps} />

        <div className="p-2 mt-4  rounded-md shadow-[0_0_10px_0_rgba(0,0,0,0.3)]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full overflow-y-auto h-17/20">
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

      <ToastContainer />
    </>
  );
};

export default TicketDetailsPage;
