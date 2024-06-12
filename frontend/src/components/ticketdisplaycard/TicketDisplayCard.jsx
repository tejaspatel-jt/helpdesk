import React, { useEffect, useState } from "react";
import { MyRoutes, TicketStatus, UserRole } from "../../common/common.config";
import { Routes } from "react-router-dom";
import DialogModal from "../modal/DialogModal";
import { getStatus } from "../utils/dataProcessing";

const TicketDisplayCard = ({
  ticket,
  handleTicketClick,
  handleApprove,
  handleReject,
  handleAccept,
  handleReturn,
  userRole,
  screen,
}) => {
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isReturned, setIsReturned] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setIsApproved(ticket.status === "approved");
    setIsRejected(ticket.status === "rejected");
    setIsResolved(ticket.status === "resolved");
    setIsAccepted(ticket.status === "accepted");
  }, [ticket.status]);

  return (
    <div
      className={
        "cursor-pointer border bg-white shadow-md rounded-md p-4 mb-4 hover:bg-gray-200"
      }
      onClick={() => {
        handleTicketClick(ticket);
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start md:items-center mb-2">
        <div className="flex items-center gap-3 mb-2 md:mb-0">
          <h3 className="ticket-number">{ticket.number}</h3>
          <div className="ticket-heading flex items-center gap-2 max-w-full md:max-w-[1000px]">
            {userRole !== UserRole.EMPLOYEE &&
            screen !== MyRoutes.MY_TICKETS &&
            ticket.statusFlow?.fromUser?.updatedBy?.avatar ? (
              <img
                className="border rounded-full h-10 w-10 smallMobile:w-7 smallMobile:h-7"
                src={ticket.statusFlow.fromUser.updatedBy.avatar}
                alt="photo"
              />
            ) : userRole !== UserRole.EMPLOYEE &&
              screen !== MyRoutes.MY_TICKETS ? (
              <div className="border rounded-full h-10 w-10 flex items-center justify-center bg-gray-200 text-gray-600">
                <span className="text-xl font-semibold">
                  {ticket.statusFlow?.fromUser?.updatedBy?.username
                    .charAt(0)
                    .toUpperCase()}
                  {ticket.statusFlow.fromUser.updatedBy.username.indexOf(
                    " "
                  ) !== -1
                    ? ticket.statusFlow.fromUser.updatedBy.username
                        .charAt(
                          ticket.statusFlow.fromUser.updatedBy.username.indexOf(
                            " "
                          ) + 1
                        )
                        .toUpperCase()
                    : ""}
                </span>
              </div>
            ) : null}

            <div className="wrapper">
              <h3 className="text-lg font-semibold w-full md:w-[700px] smallMobile:w-[200px] h-[25px] text-ellipsis overflow-hidden whitespace-nowrap">
                {ticket.title}
              </h3>

              <span className="font-semibold text-xs">
                <p>
                  Created date:
                  {new Date(ticket.createdAt).toLocaleString().substring(0, 9)}
                </p>
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
          <div className="ticket-status-and-details smallMobile:mt-3 smallMobile:justify-between smallMobile:w-full flex gap-3 items-center min-w-28 text-center">
            <span
              className={`text-sm font-semibold mr-2 px-2 py-1 border ring-1 ring-gray-300 min-w-[120px] text-center rounded-badge ${
                ticket.status === TicketStatus.IN_REVIEW ||
                ticket.status === TicketStatus.OPEN
                  ? "text-yellow-500"
                  : ticket.status.includes(TicketStatus.APPROVED)
                  ? "text-jtGreen"
                  : "text-red-500"
              }`}
            >
              {getStatus(ticket.status)}
            </span>
            <span className="text-md font-medium w-[75px] text-gray-600">
              {ticket.department.toUpperCase()}
            </span>
          </div>
          {userRole !== UserRole.EMPLOYEE &&
            screen !== MyRoutes.MY_TICKETS &&
            userRole === UserRole.MASTER && (
              <div className="flex smallMobile:mt-2 smallMobile:justify-between sm:w-10 gap-2 w-full md:w-auto">
                <button
                  disabled={isApproved || isRejected}
                  className={`w-[90px] text-white px-3 py-1 ${
                    isApproved || isRejected
                      ? "bg-gray-300 hover:bg-gray-300"
                      : "bg-jtGreen hover:bg-green-600"
                  } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleApprove(ticket._id, setIsApproved);
                  }}
                >
                  {isApproved
                    ? TicketStatus.BUTTON_APPROVED
                    : TicketStatus.BUTTON_APPROVE}
                </button>
                <button
                  disabled={isApproved || isRejected}
                  className={`w-[90px] text-white px-3 py-1 ${
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

          {userRole !== UserRole.EMPLOYEE && userRole !== UserRole.MASTER && (
            <div className="flex smallMobile:mt-2 smallMobile:justify-between sm:w-10 gap-2 w-full md:w-auto">
              <button
                disabled={isAccepted || isReturned}
                className={`w-[90px] text-white px-3 py-1 ${
                  isAccepted || isReturned
                    ? "bg-gray-300 hover:bg-gray-300"
                    : "bg-jtGreen hover:bg-green-600"
                } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                onClick={(event) => {
                  event.stopPropagation();
                  handleAccept(ticket._id, setIsAccepted);
                }}
              >
                {isAccepted
                  ? TicketStatus.BUTTON_ACCEPTED
                  : TicketStatus.BUTTON_ACCEPT}
              </button>
              <button
                disabled={isAccepted || isReturned}
                className={`w-[90px] text-white px-3 py-1 ${
                  isReturned || isAccepted
                    ? "bg-gray-300 hover:bg-gray-300"
                    : "bg-red-500 hover:bg-red-600"
                } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                onClick={(event) => {
                  event.stopPropagation();
                  handleReturn(ticket._id, setIsReturned);
                }}
              >
                {isRejected
                  ? TicketStatus.BUTTON_RETURNED
                  : TicketStatus.BUTTON_RETURN}
              </button>
            </div>
          )}
        </div>
      </div>

      {openModal && (
        <DialogModal
          title={"Confirmation"}
          message={"Are you Sure you want to Reject ?"}
          closeButtonOnClick={(event) => {
            event.stopPropagation();
            setOpenModal(false);
          }}
          button1Name={"Reject"}
          button1StyleExtra={"btn"}
          button1Click={(event) => {
            event.stopPropagation();
            handleReject(ticket._id, setIsRejected);
            setOpenModal(false);
          }}
        />
      )}
    </div>
  );
};

export default TicketDisplayCard;
