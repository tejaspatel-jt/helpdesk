import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import ApiService from "../ApiUtils/Api";
import validations from "../styles/validations.module.css";
import FormFields from "../components/form/FormFields.module.css";
import CloseButton from "../components/button/CloseButton";
import { UserContext } from "../components/contexts/UserContextProvider";
import { Link, useNavigate } from "react-router-dom";
import {
  ErrorToastMessage,
  SuccessToastMessage,
} from "../common/commonMehtods";
import { ToastContainer } from "react-toastify";
import Card from "../components/card/Card";

function Home({ onLogout }) {

  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const apiService = new ApiService(setLoading);
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await apiService.fetchUserTickets();
      const sortedTickets = response.data.data.tickets.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setTickets(sortedTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets().then((val) => {
      console.log("fetch tickets called----", val);
    });
  }, []);

  const validateFields = (title, description, department) => {
    const validationErrors = {};

    if (!title) {
      validationErrors.title = "Title is required.";
    }

    if (!description) {
      validationErrors.description = "Description is required.";
    }

    if (!department) {
      validationErrors.department = "Department is required.";
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields(title, description, department);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("department", department);
    if (files) formData.append("attachment", attachments);

    try {
      const response = await apiService.createNewTicket(formData);
      if (response.status === 201) {
        console.log(response);
        SuccessToastMessage("Ticket created successfully!");
        setTitle("");
        setDescription("");
        setShowForm(false);
        fetchTickets();
      } else {
        ErrorToastMessage("Failed to submit the ticket. Please try again.");
      }
    } catch (error) {
      ErrorToastMessage("Error creating ticket");
      console.error("Error submitting ticket:", error);
      setErrors({ form: error.message });
    }
  };

  const handleTicketClick = (ticketData) => {
    navigate("/ticketDetailsPage", { state: { ticketDetail: ticketData } });
  };

  const [files, setFiles] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFiles(true);
      const reader = new FileReader();
      reader.onload = () => {
        setAttachments(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Navbar onLogout={onLogout} userRole={userDetails.role} />
      <button
        className="btn fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow"
        onClick={() => setShowForm(true)}
      >
        + Create New Ticket
      </button>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : tickets.length === 0 ? (
            <p className="text-center">No tickets found.</p>
          ) : Array.isArray(tickets) && tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div
                className="bg-white border border-gray-100 shadow-md rounded-md p-4 mb-4 cursor-pointer"
                onClick={() => {
                  handleTicketClick(ticket);
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="first-part flex items-center gap-3">
                    <h3 className="ticket-number">{ticket.number}</h3>
                    <div className="ticket-heading flex items-center gap-2 max-w-[1000px]">
                      <div className="wrapper">
                        <h3 className="text-lg font-semibold w-[700px] h-[25px] text-ellipsis overflow-hidden text-truncate">
                          {ticket.title}
                        </h3>

                        <span className="font-semibold text-xs">
                          {ticket.createdAt.substring(0, 10)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="second-part">
                    <div className="ticket-status-and-details flex gap-3 items-center min-w-28 text-center">
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
                      <span className="text-md font-medium text-gray-600">
                        {ticket.department.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No tickets found.
              </td>
            </tr>
          )}

          {showForm && (
            // <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            //   <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <Card>
              <div className="flex justify-between items-center">
                <h2 className=" text-2xl font-semibold text-center  text-zinc-800">
                  Create New Ticket
                </h2>
                <CloseButton onclick={() => setShowForm(false)} />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-0.5">
                  <label htmlFor="title" className={FormFields.label}>
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className={FormFields.input}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                {errors.title && (
                  <p className={validations.required}>{errors.title}</p>
                )}
                <div className="mb-0.5 ">
                  <label htmlFor="description" className={FormFields.label}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    maxLength={200}
                    className={FormFields.input}
                    style={{ resize: "none" }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                {errors.description && (
                  <p className={validations.required}>{errors.description}</p>
                )}
                <div className="mb-0.5">
                  <label htmlFor="department" className={FormFields.label}>
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    className={FormFields.input}
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option disabled value="">
                      SELECT DEPARTMENT
                    </option>
                    <option value="is">is</option>
                    <option value="hr">hr</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
                {errors.department && (
                  <p className={validations.required}>{errors.department}</p>
                )}

                <div className="my-1">
                  <label
                    htmlFor="attachments"
                    className={FormFields.label}
                    // className="block text-sm font-medium text-gray-700"
                  >
                    Attachments
                  </label>
                  <input
                    type="file"
                    id="attachments"
                    accept=".jpg, .jpeg, .png, .pdf"
                    name="attachments"
                    className="file-input file-input-bordered file-input-sm w-full max-w-xs"
                    onChange={handleFileInputChange}
                    multiple
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn px-4 py-2 mt-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Create
                  </button>
                  {errors.form && (
                    <p className={validations.required}>{errors.form}</p>
                  )}
                </div>
              </form>
            </Card>
            /* </div> */
            /* </div> */
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default Home;
