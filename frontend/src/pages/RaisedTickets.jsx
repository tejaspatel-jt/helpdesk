import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserContext } from "../components/contexts/UserContextProvider";
import Navbar from "../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import ApiService from "../ApiUtils/Api";
import {
  ErrorToastMessage,
  SuccessToastMessage,
} from "../common/commonMethods";
import { ToastContainer } from "react-toastify";
import { MyRoutes, TicketStatus, UserRole } from "../common/common.config";
import TicketDisplayCard from "../components/ticketdisplaycard/TicketDisplayCard";
import InfiniteScroll from "react-infinite-scroll-component";
import FilterDropdown from "../components/filterdropdown/FIlterDropdown";
import { debounce } from "lodash";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState("");
  const [username, setUsername] = useState("");
  const { userDetails } = useContext(UserContext);
  const apiService = new ApiService(setLoading);
  const navigate = useNavigate();

  const [tempStatus, setTempStatus] = useState("");
  const [tempDepartment, setTempDepartment] = useState("");

  const debouncedFetchTickets = useCallback(
    debounce(() => {
      setPage(1);
      setTickets([]);
      setHasMore(true);
      fetchTickets();
    }, 300),
    [status, department, username]
  );

  // useEffect(() => {
  //   debouncedFetchTickets();
  // }, [username, debouncedFetchTickets]);

  useEffect(() => {
    if (status != tempStatus || department != tempDepartment) {
      setPage(1);
      setTickets([]);
      setHasMore(true);
      setTempStatus(status);
      setTempDepartment(department);
    }
    fetchTickets();
  }, [status, department]);

  useEffect(() => {
    console.log("UE called...");
    fetchTickets();
  }, [page]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = { page, perPage: 10 };
      if (status) params.status = status;
      if (department) params.department = department;
      if (username) params.username = username;
      const response = await apiService.fetchAllUserTicketsPerPage(params);

      const newTickets = response.data.data.tickets;
      if (newTickets.length === 0) {
        setHasMore(false);
      } else if (page === 1) {
        setTickets(newTickets);
      } else {
        setTickets((prevTickets) => [...prevTickets, ...newTickets]);
      }
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

  const handleTicketClick = (ticketData) => {
    navigate(MyRoutes.TICKET_DETAILS, {
      state: {
        ticketDetail: ticketData,
        cameFrom: MyRoutes.RAISED_TICKETS,
      },
    });
  };

  return (
    <>
      <Navbar userRole={userDetails.role} screen={MyRoutes.RAISED_TICKETS} />
      <FilterDropdown
        status={status}
        setStatus={setStatus}
        department={department}
        setDepartment={setDepartment}
        username={username}
        setUsername={setUsername}
      />
      <div className="container mx-auto p-4">
        <InfiniteScroll
          dataLength={tickets.length}
          loader={loading ? <p className="text-center">Loading...</p> : ""}
          next={() => setPage((prevPage) => prevPage + 1)}
          hasMore={hasMore}
          endMessage={<p className="text-center">No more tickets to load.</p>}
        >
          <div className="grid grid-cols-1 gap-4">
            {tickets.map((ticket) => (
              <TicketDisplayCard
                key={ticket._id}
                ticket={ticket}
                handleApprove={handleApprove}
                handleReject={handleReject}
                userRole={userDetails.role}
                handleTicketClick={handleTicketClick}
              />
            ))}
          </div>
        </InfiniteScroll>
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminTickets;
