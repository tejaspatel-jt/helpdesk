// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../components/contexts/UserContextProvider";
// import Navbar from "../components/navbar/Navbar";
// import { useNavigate } from "react-router-dom";
// import ApiService from "../ApiUtils/Api";
// import {
//   ErrorToastMessage,
//   SuccessToastMessage,
// } from "../common/commonMethods";
// import { ToastContainer } from "react-toastify";
// import { MyRoutes, TicketStatus, UserRole } from "../common/common.config";
// import TicketDisplayCard from "../components/ticketdisplaycard/TicketDisplayCard";
// import InfiniteScroll from "react-infinite-scroll-component";

// const AdminTickets = () => {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const { userDetails } = useContext(UserContext);
//   const apiService = new ApiService(setLoading);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchTickets().then((val) => {
//       console.log("Fetched Tickets --- ", val);
//     });
//   }, [page]);

//   // useEffect(() => {
//   //   const handleInfiniteScroll = async (e) => {
//   //     const scrollHeight = e.target.documentElement.scrollHeight;
//   //     const currentHeight =
//   //       e.target.documentElement.scrollTop + window.innerHeight;
//   //     try {
//   //       if (currentHeight + 1 >= scrollHeight) {
//   //         console.log("v_ UE handleInfiniteScroll IF ---- ");
//   //         setPage((prevpage) => prevpage + 1);
//   //       }
//   //     } catch (error) {
//   //       console.log(error);
//   //     }
//   //   };
//   //   window.addEventListener("scroll", handleInfiniteScroll);
//   //   return () => window.removeEventListener("scroll", handleInfiniteScroll);
//   // }, []);

//   const fetchTickets = async () => {
//     try {
//       const response = await apiService.fetchAllUserTicketsPerPage({
//         page,
//         perPage: 10,
//       });
//       const newTickets = response.data.data.tickets;
//       // const filteredTickets = newTickets.filter((ticket) => {
//       //   const status = ticket.status;
//       //   if (userDetails.role === UserRole.MASTER) {
//       //     return (
//       //       status === TicketStatus.RAISED ||
//       //       status === TicketStatus.ACCEPTED_MASTER ||
//       //       status === TicketStatus.REJECTED_MASTER
//       //     );
//       //   }
//       //   return true;
//       // });

//       if (newTickets.length === 0) {
//         setHasMore(false);
//       } else if (page === 1) {
//         setTickets(newTickets);
//       } else {
//         setTickets((prevTickets) => [...prevTickets, ...newTickets]);
//       }
//     } catch (error) {
//       console.error("Error fetching tickets:", error);
//       setHasMore(false);
//       setLoading(false);
//     }
//   };

//   const handleApprove = async (ticketId, setIsApproved) => {
//     const body = {
//       ticketId: ticketId,
//       ticketStatus: TicketStatus.ACCEPTED,
//     };

//     try {
//       const response = await apiService.handleApproveOrReject(body);
//       if (response.status === 200) {
//         setIsApproved(true);
//         setTickets((prevTickets) =>
//           prevTickets.map((ticket) =>
//             ticket._id === ticketId
//               ? { ...ticket, status: `accepted_${userDetails.role}` }
//               : ticket
//           )
//         );
//         SuccessToastMessage("Ticket approved successfully!");
//       } else {
//         ErrorToastMessage("Failed to approve ticket. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error approving ticket:", error);
//     }
//   };

//   const handleReject = async (ticketId, setIsRejected) => {
//     const body = {
//       ticketId: ticketId,
//       ticketStatus: TicketStatus.REJECTED,
//     };
//     try {
//       const response = await apiService.handleApproveOrReject(body);
//       if (response.status === 200) {
//         setIsRejected(true);
//         setTickets((prevTickets) =>
//           prevTickets.map((ticket) =>
//             ticket._id === ticketId
//               ? { ...ticket, status: `rejected_${userDetails.role}` }
//               : ticket
//           )
//         );
//         SuccessToastMessage("Ticket rejected successfully!");
//       } else {
//         ErrorToastMessage("Failed to reject ticket. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error rejecting ticket:", error);
//       alert("An error occurred while rejecting the ticket.");
//     }
//   };

//   const handleTicketClick = (ticketData) => {
//     navigate(MyRoutes.TICKET_DETAILS, {
//       state: { ticketDetail: ticketData },
//     });
//   };

//   return (
//     <>
//       <InfiniteScroll
//         dataLength={tickets.length}
//         hasMore={hasMore}
//         next={() => setPage((prevPage) => prevPage + 1)}
//         endMessage={<p className="text-center">No more tickets to load.</p>}
//       >
//         <Navbar userRole={userDetails.role} screen={MyRoutes.RAISED_TICKETS} />
//         <div className="container mx-auto p-4">
//           <div className="grid grid-cols-1 gap-4">
//             {loading ? (
//               <p className="text-center">Loading...</p>
//             ) : tickets.length === 0 ? (
//               <p className="text-center">No tickets found.</p>
//             ) : (
//               tickets.map((ticket) => (
//                 <TicketDisplayCard
//                   key={ticket._id}
//                   ticket={ticket}
//                   handleApprove={handleApprove}
//                   handleReject={handleReject}
//                   userRole={userDetails.role}
//                   handleTicketClick={handleTicketClick}
//                 />
//               ))
//             )}
//           </div>
//         </div>
//         <ToastContainer />
//       </InfiniteScroll>
//     </>
//   );
// };

// export default AdminTickets;
// --------------above code is working fine 27May-------------

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
import FilterDropdown from "../components/filterdropdown/FilterDropdown";
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
    fetchTickets();
  }, [page, username]);

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
      state: { ticketDetail: ticketData },
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
        <div className="grid grid-cols-1 gap-4">
          <InfiniteScroll
            dataLength={tickets.length}
            loader={loading ? <p className="text-center">Loading...</p> : ""}
            next={() => setPage((prevPage) => prevPage + 1)}
            hasMore={hasMore}
            endMessage={
              tickets.length === 0 && (
                <p className="text-center">No more tickets to load.</p>
              )
            }
          >
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
          </InfiniteScroll>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminTickets;
