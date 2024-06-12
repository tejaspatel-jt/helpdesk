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
import { validateCreateNewTicketFields } from "../Validation/Validation";
import TicketDisplayCard from "../components/ticketdisplaycard/TicketDisplayCard";
import { MyRoutes } from "../common/common.config";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../components/loader/Loader";

function MyTickets() {
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [hasMore, sethasMore] = useState(true);
  const [files, setFiles] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const apiService = new ApiService(setLoading);
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchTickets();
  }, [page]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await apiService.fetchUserTickets({ page, perPage });
      const sortedTickets = response.data.data.tickets.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      if (sortedTickets.length === 0) {
        sethasMore(false);
      }
      if (page === 1) {
        setTickets(sortedTickets);
      } else {
        setTickets((pre) => [...pre, ...sortedTickets]);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateCreateNewTicketFields(
      title,
      description,
      department,
      category
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("department", department);
    formData.append("category", category);
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
    navigate(MyRoutes.TICKET_DETAILS, {
      state: {
        ticketDetail: ticketData,
        cameFrom: MyRoutes.MY_TICKETS,
      },
    });
  };

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
      {loading && <Loader />}
      <Navbar userRole={userDetails.role} screen={MyRoutes.MY_TICKETS} />
      <div
        className="container mx-auto p-4"
        // style={{
        //   background:
        //     "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(0,74,124,0.5357595919227065) 100%)",
        // }}
      >
        <div className="grid grid-cols-1 gap-4">
          <InfiniteScroll
            dataLength={tickets.length}
            loader={loading ? <p className="text-center">Loading...</p> : ""}
            next={() => setPage((prevPage) => prevPage + 1)}
            hasMore={hasMore}
            endMessage={
              tickets.length === 0 ? (
                <p className="text-center">No more tickets to load.</p>
              ) : (
                ""
              )
            }
          >
            {tickets.map((ticket) => (
              <TicketDisplayCard
                key={ticket._id}
                ticket={ticket}
                handleTicketClick={handleTicketClick}
                userRole={userDetails.role}
                screen={MyRoutes.MY_TICKETS}
              />
            ))}
          </InfiniteScroll>
          {showForm && (
            <Card>
              <div className="flex justify-between items-center">
                <h2 className=" text-2xl font-semibold text-center  text-zinc-800">
                  Create New Ticket
                </h2>
                <CloseButton onclick={() => setShowForm(false)} />
              </div>

              <form onSubmit={handleSubmit} className="space-y-0.5">
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
                      Select Department
                    </option>
                    <option value="is">Information Security (IS)</option>
                    <option value="hr">Human Resource (HR)</option>
                    <option value="admin">Admininstartion (ADMIN)</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
                {!department && errors.department && (
                  <p className={validations.required}>{errors.department}</p>
                )}

                {department ? (
                  <div>
                    {department === "hr" && (
                      <div>
                        <label
                          htmlFor="hrcategory"
                          className={FormFields.label}
                        >
                          Category <span className="text-red-600">*</span>
                        </label>
                        <select
                          id="hrcategory"
                          name="hrcategory"
                          className={FormFields.input}
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option disabled value="">
                            SELECT CATEGORY
                          </option>
                          <option value="Attendance Logs">
                            Attendance Logs
                          </option>
                          <option value="Leave Request">Leave Request</option>
                          <option value="Documents">Documents</option>
                          <option value="JigNect Policy">JigNect Policy</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    )}
                    {department === "is" && (
                      <div>
                        <label
                          htmlFor="iscategory"
                          className={FormFields.label}
                        >
                          Category <span className="text-red-600">*</span>
                        </label>
                        <select
                          id="iscategory"
                          name="iscategory"
                          className={FormFields.input}
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option disabled value="">
                            Select Category
                          </option>
                          <option value="Software Installation Request">
                            Software Installation Request
                          </option>
                          <option value="PC/Keyboard/Mouse related query">
                            PC/Keyboard/Mouse related query
                          </option>
                          <option value="Internet Access Request for specific web">
                            Internet Access Request for specific web
                          </option>
                          <option value="Desk Change">Desk Change</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    )}
                    {department === "admin" && (
                      <div>
                        <label
                          htmlFor="admincategory"
                          className={FormFields.label}
                        >
                          Category <span className="text-red-600">*</span>
                        </label>
                        <select
                          id="admincategory"
                          name="admincategory"
                          className={FormFields.input}
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option disabled value="">
                            SELECT CATEGORY
                          </option>
                          <option value="Stationary">Stationary</option>
                          <option value="Desk Clean Up">Desk Clean Up</option>
                          <option value="Desk / Chair">Desk / Chair</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    )}
                    {department === "finance" && (
                      <div>
                        <label
                          htmlFor="financecategory"
                          className={FormFields.label}
                        >
                          Category <span className="text-red-600">*</span>
                        </label>
                        <select
                          id="financecategory"
                          name="financecategory"
                          className={FormFields.input}
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option disabled value="">
                            SELECT CATEGORY
                          </option>
                          <option value="Payroll">Payroll</option>
                          <option value="PF">PF</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    )}
                  </div>
                ) : (
                  ""
                )}
                {department && !category && errors.category && (
                  <p className={validations.required}>{errors.category}</p>
                )}

                <div className="my-1">
                  <label htmlFor="attachments" className={FormFields.label}>
                    Attachments
                  </label>
                  <input
                    type="file"
                    id="attachments"
                    accept=".jpg, .jpeg, .png, .pdf"
                    name="attachments"
                    className="file-input file-input-bordered file-input-sm w-full max-w-xs "
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
      </div>
      <button
        // className="btn fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow"
        className="btn fixed bottom-4 right-4 bg-jtBlue hover:bg-jtBlue text-white font-bold py-2 px-4 rounded shadow"
        onClick={() => setShowForm(true)}
      >
        + Create New Ticket
      </button>

      <ToastContainer />
    </>
  );
}

export default MyTickets;