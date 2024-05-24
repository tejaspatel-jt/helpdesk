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
} from "../common/commonMethods";
import { ToastContainer } from "react-toastify";
import Card from "../components/card/Card";
import {
  validateCreateNewTicketFields,
  validateEditProfileFields,
} from "../Validation/Validation";
import TicketDisplayCard from "../components/ticketdisplaycard/TicketDisplayCard";
import { MyRoutes } from "../common/common.config";

function MyTickets() {
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
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchTickets().then((val) => {
      console.log("fetch tickets called----", val);
    });
  }, [page]);

  useEffect(() => {
    const handleInfiniteScroll = async (e) => {
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
    try {
      const response = await apiService.fetchUserTickets({ page, perPage });
      const sortedTickets = response.data.data.tickets.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      if (page === 1) {
        setTickets(sortedTickets);
      } else {
        setTickets((pre) => [...pre, ...sortedTickets]);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateCreateNewTicketFields(
      title,
      description,
      department
    );
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
      if (!error.response) {
        setErrors({ form: error.message });
      } else {
        if (error.response.status === 400) {
          if (error.response.data.message.includes("Title")) {
            setErrors({ title: error.response.data.message });
          } else {
            setErrors({ description: error.response.data.message });
          }
        } else {
          console.log(error.message);
        }
      }
    }
  };

  const handleTicketClick = (ticketData) => {
    navigate(MyRoutes.TICKET_DETAILS, { state: { ticketDetail: ticketData } });
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
      <Navbar userRole={userDetails.role} screen={MyRoutes.MY_TICKETS} />
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
              <TicketDisplayCard
                key={ticket._id}
                ticket={ticket}
                handleTicketClick={handleTicketClick}
                userRole={userDetails.role}
                screen={MyRoutes.MY_TICKETS}
              />
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No tickets found.
              </td>
            </tr>
          )}

          {showForm && (
            <Card>
              <div className="flex justify-between items-center">
                <h2 className=" text-2xl font-semibold text-center  text-zinc-800">
                  Create New Ticket
                </h2>
                <CloseButton onclick={() => setShowForm(false)} />
              </div>

              <form onSubmit={handleSubmit} className="space-y-0.5">
                {/* <div className="mb-0.5"> */}
                <div>
                  <label htmlFor="title" className={FormFields.label}>
                    Title <span className="text-red-600">*</span>
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
                {/* <div className="mb-0.5 "> */}
                <div>
                  <label htmlFor="description" className={FormFields.label}>
                    Description <span className="text-red-600">*</span>
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
                {/* <div className="mb-0.5"> */}
                <div>
                  <label htmlFor="department" className={FormFields.label}>
                    Department <span className="text-red-600">*</span>
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
                    <option value="is">IS</option>
                    <option value="hr">HR</option>
                    <option value="admin">ADMIN</option>
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
                    Attachments &#40;Optional&#41;
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

                {errors.form && (
                  <p className={validations.required}>{errors.form}</p>
                )}

                <div className="flex justify-end ">
                  <button
                    type="submit"
                    className="btn px-4 py-2 mt-5 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Create
                  </button>
                </div>
              </form>
            </Card>
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default MyTickets;
