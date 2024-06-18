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
import DialogModal from "../components/modal/DialogModal";
import Navbar from "../components/navbar/Navbar";

const TicketDetailsPage = () => {
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isReturned, setIsReturned] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [fileAttachment, setFileAttachment] = useState("");
  const [onHold, setOnHold] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [returnModal, setReturnModal] = useState(false);
  const { userDetails } = useContext(UserContext);
  const location = useLocation();
  const ticketDetail = location.state.ticketDetail;
  const cameFrom = location.state.cameFrom;
  const navigate = useNavigate();
  const apiService = new ApiService(setLoading);

  useEffect(() => {
    setIsApproved(ticketDetail.status === TicketStatus.APPROVED_MASTER);
    setIsRejected(ticketDetail.status === TicketStatus.REJECTED_MASTER);
    setIsResolved(ticketDetail.status === TicketStatus.RESOLVED);
    setIsAccepted(ticketDetail.status === TicketStatus.OPEN);
    setIsReturned(ticketDetail.status === TicketStatus.RETURNED);
    setOnHold(ticketDetail.status === TicketStatus.ON_HOLD);
  }, [ticketDetail.status]);

  useEffect(() => {
    getAttachedFile(
      ticketDetail.attachFile ||
        ticketDetail.statusFlow?.fromMaster?.updatedBy?.avatar
    );
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  const steps = getSteps(ticketDetail);
  const ticketData = getTicketDetails(ticketDetail);

  const handleApprove = async (ticketId, setIsApproved) => {
    const body = {
      ticketId: ticketId,
      ticketStatus: TicketStatus.APPROVED,
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
      ticketStatus: TicketStatus.REJECTED_MASTER,
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

  const handleAccept = async (ticketId, setIsAccepted) => {
    const body = {
      ticketId: ticketId,
      ticketStatus: TicketStatus.APPROVED,
    };

    try {
      const response = await apiService.handleApproveOrReject(body);
      if (response.status === 200) {
        setIsAccepted(true);

        // setTickets((prevTickets) =>
        //   prevTickets.map((ticket) =>
        //     ticket._id === ticketId ? { ...ticket, status: "approved" } : ticket
        //   )
        // );
        SuccessToastMessage("Ticket accepted successfully!");
      } else {
        ErrorToastMessage("Failed to accepted ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error accepting ticket:", error);
    }
  };

  const handleReturn = async (ticketId, setIsReturned) => {
    const body = {
      ticketId: ticketId,
      ticketStatus: TicketStatus.RETURNED,
    };
    try {
      const response = await apiService.handleApproveOrReject(body);
      if (response.status === 200) {
        setIsReturned(true);
        // setTickets((prevTickets) =>
        //   prevTickets.map((ticket) =>
        //     ticket._id === ticketId ? { ...ticket, status: "returned" } : ticket
        //   )
        // );
        SuccessToastMessage("Ticket returned successfully!");
      } else {
        ErrorToastMessage("Failed to return ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error returning ticket:", error);
      alert("An error occurred while returning the ticket.");
    }
  };

  const handleOnHold = async (ticketId, setOnHold) => {
    const body = {
      ticketId: ticketId,
      ticketStatus: TicketStatus.ON_HOLD,
    };

    try {
      const response = await apiService.handleApproveOrReject(body);
      if (response.status === 200) {
        setOnHold(true);
        // setTickets((prevTickets) =>
        //   prevTickets.map((ticket) =>
        //     ticket._id === ticketId ? { ...ticket, status: "on_hold" } : ticket
        //   )
        // );
        SuccessToastMessage("Ticket is On Hold !");
      } else {
        ErrorToastMessage("Failed to hold the ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error accepting ticket:", error);
    }
  };

  const handleResolve = async (ticketId, setIsResolved) => {
    const body = {
      ticketId: ticketId,
      ticketStatus: TicketStatus.RESOLVED,
    };
    try {
      const response = await apiService.handleApproveOrReject(body);
      if (response.status === 200) {
        setIsResolved(true);
        // setTickets((prevTickets) =>
        //   prevTickets.map((ticket) =>
        //     ticket._id === ticketId ? { ...ticket, status: "resolved" } : ticket
        //   )
        // );
        SuccessToastMessage("Ticket resolved successfully!");
      } else {
        ErrorToastMessage("Failed to resolve the ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error resolving ticket:", error);
      alert("An error occurred while returning the ticket.");
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
    const fileType = attachment.fileType;
    const isImage = ["jpg", "jpeg", "png", "image"].includes(fileType);

    return isImage ? (
      <img
        src={attachment.base64File}
        alt="attachment"
        className="w-24 h-24 object-cover cursor-pointer"
        onClick={() => handleOpenDialog(attachment.base64File)}
      />
    ) : (
      <div
        className="w-24 h-24 bg-gray-200 flex items-center justify-center cursor-pointer"
        onClick={() => handleOpenDialog(attachment.base64File)}
      >
        <span className="text-lg font-semibold text-gray-600">PDF</span>
      </div>
    );
  };

  const getAttachedFile = async (attachedFileId) => {
    try {
      console.log("ye hei file id---", attachedFileId);
      const response = await apiService.getAttachedFile(attachedFileId);
      if (response.status == 200) {
        console.log("ye hei resonse.data.data---", response.data.data);
        setFileAttachment(response.data.data);
      } else {
        console.log("error:", response);
      }
    } catch (error) {
      console.log("error getting the attachment: ", error);
    }
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

          {/* //FOR MASTER VIEW  */}
          {userDetails.role === UserRole.MASTER &&
            userDetails.role !== UserRole.EMPLOYEE &&
            cameFrom == MyRoutes.RAISED_TICKETS &&
            ticketDetail.status === TicketStatus.IN_REVIEW && (
              <div className="mt-2 ml-auto flex justify-center space-x-2">
                <button
                  disabled={isApproved || isRejected || isReturned}
                  className={`text-white px-3 py-1 ${
                    isApproved || isRejected || isReturned
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
                  disabled={isApproved || isRejected || isReturned}
                  className={`text-white px-3 py-1 ${
                    isRejected || isApproved || isReturned
                      ? "bg-gray-300 hover:bg-gray-300"
                      : "bg-red-500 hover:bg-red-600"
                  } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setRejectModal(true);
                  }}
                >
                  {isRejected
                    ? TicketStatus.BUTTON_REJECTED
                    : TicketStatus.BUTTON_REJECT}
                </button>

                <button
                  disabled={isReturned || isRejected || isApproved || onHold}
                  className={`text-white px-3 py-1 ${
                    onHold
                      ? "bg-yellow-300 hover:bg-yellow-300"
                      : "bg-black text-white "
                  } rounded-md shadow-md mr-2 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleOnHold(ticketDetail._id, setOnHold);
                  }}
                >
                  {onHold
                    ? TicketStatus.BUTTON_ON_HOLD
                    : TicketStatus.BUTTON_ON_HOLD}
                </button>

                <button
                  disabled={isReturned || isRejected || isApproved}
                  className={` text-white px-3 py-1 ${
                    isReturned || isRejected || isApproved
                      ? "bg-gray-300 hover:bg-gray-300"
                      : "bg-red-500 hover:bg-red-600"
                  } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setReturnModal(true);
                  }}
                >
                  {isReturned
                    ? TicketStatus.BUTTON_RETURNED
                    : TicketStatus.BUTTON_RETURN}
                </button>
              </div>
            )}

          {/* //FOR DEPARTMENT VIEW */}
          {userDetails.role !== UserRole.EMPLOYEE &&
            userDetails.role !== UserRole.MASTER && (
              <div className="flex ml-auto smallMobile:mt-2 smallMobile:justify-between sm:w-10 gap-2 w-full md:w-auto">
                <button
                  disabled={
                    isAccepted ||
                    isReturned ||
                    isResolved ||
                    isRejected ||
                    onHold
                  }
                  className={`w-[90px] text-white px-3 py-1 ${
                    isAccepted ||
                    isReturned ||
                    isResolved ||
                    isRejected ||
                    onHold
                      ? "bg-gray-300 hover:bg-gray-300"
                      : "bg-jtGreen hover:bg-green-600"
                  } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleAccept(ticketDetail._id, setIsAccepted);
                  }}
                >
                  {isAccepted
                    ? TicketStatus.BUTTON_ACCEPTED
                    : TicketStatus.BUTTON_ACCEPT}
                </button>

                <button
                  disabled={isReturned || isResolved || isRejected}
                  className={`text-white px-3 py-1 ${
                    onHold
                      ? "bg-yellow-300 hover:bg-yellow-300"
                      : "bg-black text-white "
                  } rounded-md shadow-md mr-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleOnHold(ticketDetail._id, setOnHold);
                  }}
                >
                  {onHold
                    ? TicketStatus.BUTTON_ON_HOLD
                    : TicketStatus.BUTTON_ON_HOLD}
                </button>

                <button
                  disabled={isReturned || isResolved || isRejected}
                  className={`w-[90px] text-white px-3 py-1 ${
                    isReturned || isResolved || isRejected
                      ? "bg-gray-300 hover:bg-gray-300"
                      : "bg-red-500 hover:bg-red-600"
                  } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setReturnModal(true);
                  }}
                >
                  {isReturned
                    ? TicketStatus.BUTTON_RETURNED
                    : TicketStatus.BUTTON_RETURN}
                </button>

                <button
                  disabled={isReturned || isResolved || isRejected}
                  className={`text-white px-3 py-1 ${
                    isReturned || isResolved || isRejected
                      ? "bg-gray-300 hover:bg-gray-300"
                      : "bg-jtGreen hover:bg-green-600"
                  } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleResolve(ticketDetail._id, setIsResolved);
                  }}
                >
                  {isResolved
                    ? TicketStatus.BUTTON_RESOLVED
                    : TicketStatus.BUTTON_RESOLVE}
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
              <span className="font-semibold">Category:</span>{" "}
              {ticketDetail.category}
            </li>
            <li className="py-2">
              <span className="font-semibold">Department:</span>{" "}
              {ticketDetail.department.toUpperCase()}
            </li>
            <li className="py-2">
              <span className="font-semibold">Created Date:</span>{" "}
              {new Date(ticketDetail.createdAt)
                .toLocaleString()
                .substring(0, 10)}
            </li>
          </ul>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Attachments:</h2>
          <div className="flex space-x-4 ">
            <div className="w-26 h-26 border-2 border-gray-500 rounded-sm">
              {renderAttachmentPreview(fileAttachment)}
            </div>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-600 p-2">
              <button onClick={handleCloseDialog}>
                <CloseButtonWhite />
              </button>
              <button
                onClick={() => {
                  downloadButtonClick(selectedAttachment);
                }}
                className="text-white p-3 rounded-md hover:bg-gray-700"
              >
                <div className="flex items-baseline ">
                  <span className="font-semibold">Download</span>
                  <FaFileDownload className="ml-2" />
                </div>
              </button>
            </div>
            <div className="p-4">
              {selectedAttachment &&
              /\.(jpg|jpeg|png|pdf)$/i.test(selectedAttachment.fileType) ? (
                <img
                  src={selectedAttachment}
                  alt="attachment"
                  className="w-auto max-h-[75vh] mx-auto"
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

      {rejectModal && (
        <DialogModal
          title={"Confirmation"}
          message={"Are you Sure you want to Reject ?"}
          closeButtonOnClick={(event) => {
            event.stopPropagation();
            setRejectModal(false);
          }}
          button1Name={"Reject"}
          button1StyleExtra={"btn"}
          button1Click={(event) => {
            event.stopPropagation();
            handleReject(ticketDetail._id, setIsRejected);
            setRejectModal(false);
          }}
        />
      )}

      {returnModal && (
        <DialogModal
          title={"Confirmation"}
          message={"Are you Sure you want to Return ?"}
          closeButtonOnClick={(event) => {
            event.stopPropagation();
            setReturnModal(false);
          }}
          button1Name={"Return"}
          button1StyleExtra={"btn"}
          button1Click={(event) => {
            event.stopPropagation();
            handleReturn(ticketDetail._id, setIsReturned);
            setReturnModal(false);
          }}
        />
      )}

      <ToastContainer />
    </>
  );
};

export default TicketDetailsPage;
