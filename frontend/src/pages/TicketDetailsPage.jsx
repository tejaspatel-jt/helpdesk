import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
// import { useRoute } from "@react-navigation/native";

const TicketDetailsPage = ({ onLogout }) => {
  const location = useLocation();
  const loading = false;
  const ticketDetail = location.state.ticketDetail;

  return (
    <>
      {/* <div>{JSON.stringify(ticketDetail)}</div>  */}
      {/* <thead>
        <tr>

          <th>Number</th>
          <th>Title</th>
          <th>Description</th>
          <th>Status</th>
          <th>User ID</th>
          <th>Username</th>
          <th>Department</th>
          <th>Created At</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody> */}
      {/* <tr>
         
          <td>{ticketDetail.number}</td>
          <td>{ticketDetail.title}</td>
          <td>{ticketDetail.description}</td>
          <td>{ticketDetail.status}</td>
          <td>{ticketDetail.user._id}</td>
          <td>{ticketDetail.user.username}</td>
          <td>{ticketDetail.department}</td>
          <td>{ticketDetail.createdAt}</td>
          <td>{ticketDetail.updatedAt}</td>
        </tr>
      </tbody> */}

      <Navbar onLogout={onLogout} />

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : ticketDetail.length === 0 ? (
            <p className="text-center">No tickets found.</p>
          ) : (
            <div className="bg-white shadow-md rounded-md p-4 mb-4 ">
              <div className="flex justify-start items-center mb-2">
                <h3 className="pr-1">{ticketDetail.number}</h3>
                <div className="flex items-center gap-2 max-w-[1000px]">
                  {ticketDetail.avatar ? (
                    <img
                      className="border rounded-full h-10 w-10"
                      src={ticketDetail.avatar}
                      alt="photo"
                    />
                  ) : (
                    <div className="border rounded-full h-10 w-10 flex items-center justify-center bg-gray-200 text-gray-600">
                      <span className="text-xl font-semibold">
                        {ticketDetail.title.charAt(0).toUpperCase()}
                        {ticketDetail.title.indexOf(" ") !== -1
                          ? ticketDetail.title
                              .charAt(ticketDetail.title.indexOf(" ") + 1)
                              .toUpperCase()
                          : ""}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold w-[700px] h-[25px] text-ellipsis overflow-hidden text-truncate">
                      {ticketDetail.title}
                    </h3>
                    <span className="font-semibold text-xs">
                      {ticketDetail.createdAt.substring(0, 10)}
                    </span>
                    <p>{ticketDetail.description}</p>
                  </div>
                  <span
                    className={` text-sm font-semibold mr-2 px-2 py-1 border ring-1 ring-gray-300 w-[125px] text-center rounded-badge ${
                      ticketDetail.status === "pending"
                        ? "text-yellow-500"
                        : ticketDetail.status === `accepted_master`
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {ticketDetail.status}
                  </span>
                </div>
                <div className="min-w-28 text-center">
                  <span className="text-md font-medium text-gray-600">
                    {ticketDetail.department.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TicketDetailsPage;
