import React, { useEffect, useState } from "react";
import { MyRoutes, TicketStatus, UserRole } from "../../common/common.config";
import { Routes } from "react-router-dom";

const TicketDisplayCard = ({
  ticket,
  handleTicketClick,
  handleApprove,
  handleReject,
  userRole,
  screen,
}) => {
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  useEffect(() => {
    console.log("user role", userRole);
    setIsApproved(ticket.status === `accepted_${userRole}`);
    // setIsApproved(ticket.status.includes("accepted"));
    setIsRejected(ticket.status === `rejected_${userRole}`);
    // setIsRejected(ticket.status.includes("rejected"));
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
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <h3 className="ticket-number">{ticket.number}</h3>
          <div className="ticket-heading flex items-center gap-2 max-w-[1000px]">
            {userRole != UserRole.EMPLOYEE &&
            screen != MyRoutes.MY_TICKETS &&
            ticket.statusFlow?.fromUser?.updatedBy?.avatar ? (
              <img
                className="border rounded-full h-10 w-10"
                src={ticket.statusFlow.fromUser.updatedBy.avatar}
                alt="photo"
              />
            ) : userRole != UserRole.EMPLOYEE &&
              screen != MyRoutes.MY_TICKETS ? (
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
              <h3 className="text-lg font-semibold w-[700px] h-[25px] text-ellipsis overflow-hidden text-truncate">
                {ticket.title}
              </h3>

              <span className="font-semibold text-xs">
                {new Date(ticket.createdAt).toLocaleString().substring(0, 9)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="ticket-status-and-details flex gap-3 items-center min-w-28 text-center">
            <span
              className={`text-sm font-semibold mr-2 px-2 py-1 border ring-1 ring-gray-300 w-[125px] text-center rounded-badge ${
                ticket.status === TicketStatus.RAISED
                  ? "text-yellow-500"
                  : ticket.status.includes(TicketStatus.ACCEPTED)
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {ticket.status}
            </span>
            <span className="text-md font-medium w-[75px] text-gray-600">
              {ticket.department.toUpperCase()}
            </span>
          </div>
          {userRole != UserRole.EMPLOYEE && screen != MyRoutes.MY_TICKETS && (
            <div className="flex ml-auto min-w-[180px] ">
              <button
                disabled={isApproved || isRejected}
                className={`text-white px-3 py-1 ${
                  isApproved || isRejected
                    ? "bg-gray-300 hover:bg-gray-300"
                    : "bg-green-500 hover:bg-green-600"
                } rounded-md shadow-md mr-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
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
                className={`text-white px-3 py-1 ${
                  isRejected || isApproved
                    ? "bg-gray-300 hover:bg-gray-300"
                    : "bg-red-500 hover:bg-red-600"
                } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                onClick={(event) => {
                  event.stopPropagation();
                  handleReject(ticket._id, setIsRejected);
                }}
              >
                {isRejected
                  ? TicketStatus.BUTTON_REJECTED
                  : TicketStatus.BUTTON_REJECT}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDisplayCard;
