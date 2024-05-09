import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../components/contexts/UserContextProvider";
import Navbar from "../components/navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";

const AdminTicketCard = ({ ticket, handleApprove, handleReject }) => {
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);

  useEffect(() => {
    setIsApproved(ticket.status === `accepted_${userDetails.role}`);
    // setIsApproved(ticket.status.includes("accepted"));
    setIsRejected(ticket.status === `rejected_${userDetails.role}`);
    // setIsRejected(ticket.status.includes("rejected"));
  }, [ticket.status]);

  const handleTicketClick = (ticketData) => {
    navigate("/ticketDetailsPage", { state: { ticketDetail: ticketData } });
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-4">
      <div className="flex justify-start items-center mb-2">
        <h3>{ticket.number}</h3>
        <div className="flex items-center gap-2 max-w-[1000px]">
          <img className="border rounded-full h-10 w-10" src={""} alt="photo" />
          <div>
            <h3
              onClick={() => {
                handleTicketClick(ticket);
              }}
              className="text-lg font-semibold w-[700px] h-[25px] text-ellipsis overflow-hidden text-truncate hover:underline"
            >
              {ticket.title}
            </h3>
            <span className="font-thin text-xs">
              {ticket.createdAt.substring(0, 10)}
            </span>
          </div>
          <span
            className={` text-sm font-semibold mr-2 px-2 py-1 border ring-1 ring-gray-300 w-[125px] text-center rounded-badge ${
              ticket.status === "pending"
                ? "text-yellow-500"
                : ticket.status === `accepted_${userDetails.role}`
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
        <div className="mt-2 flex ml-auto min-w-[180px]">
          <button
            disabled={isApproved || isRejected}
            className={` text-white px-3 py-1 ${
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

const AdminTickets = ({ onlogout }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { userDetails } = useContext(UserContext);

  const accessToken = localStorage.getItem("accessToken");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    ContentType: "application/json",
  };

  const handleInfiniteScroll = async () => {
    // console.log("scrollheight", document.documentElement.scrollHeight);
    // console.log("innerHeight", window.innerHeight);
    // console.log("scrollTop", document.documentElement.scrollTop);
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        setPage((prevpage) => prevpage + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTickets().then((val) => {
      console.log("Fetched Tickets --- ", val);
    });
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7700/user/ticket/get/all",
        { headers, params: { page: page, perPage: 10 } }
      );

      console.log("Tickets ---- ", page, response.data.data.tickets);
      console.log("Tickets response ---- ", page, response);
      if (page >= 2) {
        setTickets((prev) => [...prev, ...response.data.data]);
      } else {
        setTickets((prev) => [...prev, ...response.data.data.tickets]);
      }
      console.log("Tickets after set ---- ", tickets);
      // setTickets((prev) => [response.data.data.tickets]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setLoading(false);
    }
  };

  const handleApprove = async (ticketId, setIsApproved) => {
    setIsApproved(true);
    try {
      const response = await axios.patch(
        "http://localhost:7700/user/ticket/update/status",
        {
          ticketId: ticketId,
          ticketStatus: `accepted_${userDetails.role}`,
        },
        { headers }
      );
      if (response.status === 200) {
        fetchTickets();
        alert("Ticket approved successfully!");
      } else {
        alert("Failed to approve ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error approving ticket:", error);
      alert("An error occurred while approving the ticket.");
    }
  };

  const handleReject = async (ticketId, setIsRejected) => {
    setIsRejected(true);
    try {
      const response = await axios.patch(
        "http://localhost:7700/user/ticket/update/status",
        {
          ticketId: ticketId,
          ticketStatus: `rejected_${userDetails.role}`,
        },
        { headers }
      );
      if (response.status === 200) {
        fetchTickets();
        alert("Ticket rejected successfully!");
      } else {
        alert("Failed to reject ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error rejecting ticket:", error);
      alert("An error occurred while rejecting the ticket.");
    }
  };

  return (
    <>
      <Navbar onLogout={onlogout} userRole={userDetails.role} />
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
              />
            ))
          )}
        </div>
      </div>
      {/* <h1>Hello</h1>
      {tickets.map((val) => (
        <>
          <div>{val.title}</div>
          <div>{val.description}</div>
        </>
      ))} */}
    </>
  );
};

export default AdminTickets;
