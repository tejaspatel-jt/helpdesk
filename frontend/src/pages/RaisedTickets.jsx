import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../components/contexts/UserContextProvider";
import Navbar from "../components/navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../ApiUtils/Api";
import {
  ErrorToastMessage,
  SuccessToastMessage,
} from "../common/commonMehtods";
import { ToastContainer } from "react-toastify";
import { TicketStatus } from "../common/common.config";

const AdminTicketCard = ({ ticket, handleApprove, handleReject, userRole }) => {
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsApproved(ticket.status === `accepted_${userRole}`);
    // setIsApproved(ticket.status.includes("accepted"));
    setIsRejected(ticket.status === `rejected_${userRole}`);
    // setIsRejected(ticket.status.includes("rejected"));
  }, [ticket.status]);

  const handleTicketClick = (ticketData) => {
    navigate("/ticketDetailsPage", { state: { ticketDetail: ticketData } });
  };

  return (
    <div className="cursor-pointer bg-white shadow-md rounded-md p-4 mb-4">
      <div className="flex justify-start items-center mb-2">
        <h3 className="pr-1">{ticket.number}</h3>
        <div className="flex items-center gap-2 max-w-[1000px]">
          {ticket.avatar ? (
            <img
              className="border rounded-full h-10 w-10"
              src={ticket.avatar}
              alt="photo"
            />
          ) : (
            <div className="border rounded-full h-10 w-10 flex items-center justify-center bg-gray-200 text-gray-600">
              <span className="text-xl font-semibold">
                {ticket.title.charAt(0).toUpperCase()}
                {ticket.title.indexOf(" ") !== -1
                  ? ticket.title
                      .charAt(ticket.title.indexOf(" ") + 1)
                      .toUpperCase()
                  : ""}
              </span>
            </div>
          )}

          <div>
            <h3
              onClick={() => {
                handleTicketClick(ticket);
              }}
              className="cursor-pointer text-lg font-semibold w-[700px] h-[25px] text-ellipsis overflow-hidden text-truncate "
            >
              {ticket.title}
            </h3>
            <span className="font-thin text-xs">
              {ticket.createdAt.substring(0, 10)}
            </span>
          </div>
          <span
            className={` text-sm font-semibold mr-2 px-2 py-1 border ring-1 ring-gray-300 w-[125px] text-center rounded-badge ${
              ticket.status === "raised"
                ? "text-yellow-500"
                : ticket.status.includes("accepted")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {ticket.status}
          </span>
        </div>
        <div className="min-w-28 text-center">
          <span className="text-md font-medium text-gray-600">
            {ticket.department.toUpperCase()}
          </span>
        </div>
        <div className="mt-2 flex ml-auto min-w-[180px] ">
          <button
            disabled={isApproved || isRejected}
            className={` text-white px-3 py-1  ${
              isApproved
                ? "bg-gray-300 hover:bg-gray-300"
                : "bg-green-500 hover:bg-green-600"
            } rounded-md shadow-md mr-2  focus:outline-none focus:ring-2 focus:ring-green-500`}
            onClick={() => handleApprove(ticket._id, setIsApproved)}
          >
            {isApproved ? "Approved" : "Approve"}
          </button>
          <button
            disabled={isApproved || isRejected}
            className={` text-white px-3 py-1 ${
              isRejected
                ? "bg-gray-300 hover:bg-gray-300"
                : "bg-red-500 hover:bg-red-600"
            } rounded-md shadow-md  focus:outline-none focus:ring-2 focus:ring-red-500`}
            onClick={() => handleReject(ticket._id, setIsRejected)}
          >
            {isRejected ? "Rejected" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [noMoreTickets, setNoMoreTickets] = useState(false);
  const { userDetails } = useContext(UserContext);
  const apiService = new ApiService(setLoading);

  const accessToken = localStorage.getItem("accessToken");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    ContentType: "application/json",
  };

  useEffect(() => {
    fetchTickets().then((val) => {
      console.log("Fetched Tickets --- ", val);
    });
  }, [page]);

  useEffect(() => {
    const handleInfiniteScroll = async (e) => {
      console.log("v_ UE handleInfiniteScroll ---- ");
      // console.log("scrollheight", document.documentElement.scrollHeight);
      // console.log("innerHeight", window.innerHeight);
      // console.log("scrollTop", document.documentElement.scrollTop);
      const scrollHeight = e.target.documentElement.scrollHeight;
      const currentHeight =
        e.target.documentElement.scrollTop + window.innerHeight;
      try {
        if (currentHeight + 1 >= scrollHeight) {
          console.log("v_ UE handleInfiniteScroll IF ---- ");
          setPage((prevpage) => prevpage + 1);
        }
      } catch (error) {
        console.log(error);
      }
    };
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await apiService.fetchAllUserTicketsPerPage({
        page,
        perPage: 10,
      });
      const newTickets = response.data.data.tickets;
      const filteredTickets = newTickets.filter((ticket) => {
        const status = ticket.status;
        if (userDetails.role === "master") {
          return (
            status === "raised" ||
            status === "accepted_master" ||
            status === "rejected_master"
          );
        }
        return true;
      });

      if (filteredTickets.length === 0 && page === 1) {
        setNoMoreTickets(true);
      }
      if (page === 1) {
        setTickets(filteredTickets);
      } else {
        setTickets((prevTickets) => [...prevTickets, ...filteredTickets]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setLoading(false);
    }
  };

  const handleApprove = async (ticketId, setIsApproved) => {
    const body = {
      ticketId: ticketId,
      ticketStatus: TicketStatus.ACCEPTED,
    };

    try {
      const response = await apiService.handleApproveOrReject(body);
      if (response.status === 200) {
        setIsApproved(true);
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === ticketId
              ? { ...ticket, status: `accepted_${userDetails.role}` }
              : ticket
          )
        );
        SuccessToastMessage("Ticket approved successfully!");
      } else {
        ErrorToastMessage("Failed to approve ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error approving ticket:", error);
      alert("An error occurred while approving the ticket.");
    }
  };

  const handleReject = async (ticketId, setIsRejected) => {
    setIsRejected(true);
    const body = {
      ticketId: ticketId,
      ticketStatus: TicketStatus.ACCEPTED,
    };
    try {
      const response = await apiService.handleApproveOrReject(body);
      if (response.status === 200) {
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === ticketId
              ? { ...ticket, status: `rejected_${userDetails.role}` }
              : ticket
          )
        );
        SuccessToastMessage("Ticket rejected successfully!");
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
      <Navbar userRole={userDetails.role} />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : tickets.length === 0 ? (
            <p className="text-center">No tickets found.</p>
          ) : (
            tickets.map((ticket) => (
              <AdminTicketCard
                key={ticket._id}
                ticket={ticket}
                handleApprove={handleApprove}
                handleReject={handleReject}
                userRole={userDetails.role}
              />
            ))
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminTickets;
