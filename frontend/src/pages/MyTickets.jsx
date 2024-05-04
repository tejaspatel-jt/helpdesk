import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Link } from "react-router-dom";

import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";

const MyTickets = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axios.get(
        `${process.env.REACT_APP_Base_Url}/user/ticket/get`,
        { headers }
      );
      console.log(response.data.data);
      // setTickets(response.data.data);
      const sortedTickets = response.data.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setTickets(sortedTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Please provide a title and description.");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        ContentType: "application/json",
      };

      const response = await axios.post(
        `${process.env.REACT_APP_Base_Url}/user/ticket/create`,
        {
          title,
          description,
          department: "is",
        },
        { headers }
      );

      if (response.status === 201) {
        alert("Ticket submitted successfully!");
        setTitle("");
        setDescription("");
        fetchTickets();
      } else {
        alert("Failed to submit the ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      alert("An error occurred while submitting the ticket.");
    }
  };

  const openModal = async () => {
    setIsModalOpen(true);
    await fetchTickets();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-200">
      <div className="absolute top-0 left-0 m-4">
        <Link to="/home">
          <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Go Back
          </button>
        </Link>
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          My Tickets
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ticket Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ticket Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Ticket
          </button>
        </form>
        <button
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={openModal}
        >
          Your Tickets
        </button>
      </div>

      {/* Modal for "Your Tickets" section */}
      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog
          onClose={closeModal}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-80"
            aria-hidden="true"
          />
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Your Tickets
                </Dialog.Title>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        {/* <th className="px-4 py-2 border">Ticket ID</th> */}
                        <th className="px-4 py-2 border">Title</th>
                        <th className="px-4 py-2 border">Description</th>
                        <th className="px-4 py-2 border">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4" className="text-center py-4">
                            Loading...
                          </td>
                        </tr>
                      ) : Array.isArray(tickets) && tickets.length > 0 ? (
                        tickets.map((ticket) => (
                          <tr key={ticket._id}>
                            {/* <td className="px-4 py-2 border">{ticket._id}</td> */}
                            <td className="px-4 py-2 border">{ticket.title}</td>
                            <td className="px-4 py-2 border">
                              {ticket.description}
                            </td>
                            <td className="px-4 py-2 border">
                              {ticket.status}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center py-4">
                            No tickets found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default MyTickets;
