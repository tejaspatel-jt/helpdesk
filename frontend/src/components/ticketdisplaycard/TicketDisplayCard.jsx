import React, { useEffect, useState } from "react";
import { MyRoutes, TicketStatus, UserRole } from "../../common/common.config";
import { Routes } from "react-router-dom";
import DialogModal from "../modal/DialogModal";

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
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    console.log("user role", userRole);
    setIsApproved(ticket.status === `accepted_${userRole}`);
    setIsRejected(ticket.status === `rejected_${userRole}`);
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
                {new Date(ticket.createdAt).toLocaleString().substring(0, 9)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
          <div className="ticket-status-and-details smallMobile:mt-3 smallMobile:justify-between smallMobile:w-full flex gap-3 items-center min-w-28 text-center">
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
          {userRole !== UserRole.EMPLOYEE && screen !== MyRoutes.MY_TICKETS && (
            <div className="flex smallMobile:mt-2 smallMobile:justify-between sm:w-10 gap-2 w-full md:w-auto">
              <button
                disabled={isApproved || isRejected}
                className={`text-white px-3 py-1 ${
                  isApproved || isRejected
                    ? "bg-gray-300 hover:bg-gray-300"
                    : "bg-green-500 hover:bg-green-600"
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
