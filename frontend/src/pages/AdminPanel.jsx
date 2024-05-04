import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    ContentType: "application/json",
  };

  useEffect(() => {
    fetchTickets().then((val) => {
      console.log("fetchTikcets called---", val);
    });
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7700/user/ticket/get/all",
        { headers }
      );
      console.log(response.data.data);
      setTickets(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setLoading(false);
    }
  };

  const handleApprove = async (ticketId) => {
    try {
      console.log("Ticket Id", ticketId);
      const response = await axios.patch(
        "http://localhost:7700/user/ticket/update/status",
        {
          ticketId: ticketId,
          ticketStatus: "accepted_admin",
        },
        { headers }
      );
      console.log(response);

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

  const handleReject = async (ticketId) => {
    try {
      const response = await axios.patch(
        "http://localhost:7700/user/ticket/update/status",
        {
          ticketId: ticketId,
          ticketStatus: "rejected_admin",
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
    <div className="mt-2 overflow-x-auto">
      <h2 className="text-center text-2xl text-zinc-800">Tickets</h2>
      <table className="w-full text-left text-zinc-800 border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Department</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
            {/* {"role" == "admin" && <th className="px-4 py-2 border">Actions</th>}  */}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : Array.isArray(tickets) && tickets.length > 0 ? (
            tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td className="px-4 py-2 border">
                  {ticket.createdAt.substring(0, 10)}
                </td>
                <td className="px-4 py-2 border">{ticket.title}</td>
                <td className="px-4 py-2 border">{ticket.description}</td>
                <td className="px-4 py-2 border">{ticket.department}</td>
                <td className="px-4 py-2 border">{ticket.status}</td>
                {/* {"role" == "admin" && (  */}
                <td className="px-4 py-2 border">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded-md shadow-md mr-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={() => handleApprove(ticket._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={() => handleReject(ticket._id)}
                  >
                    Reject
                  </button>
                </td>
                {/*  )}  */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No tickets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
