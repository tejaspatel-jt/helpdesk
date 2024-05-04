import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import ApiService from "../ApiUtils/Api";
import validations from "../styles/validations.module.css";
import FormFields from "../components/form/FormFields.module.css";
import CloseButton from "../components/button/CloseButton";
import PageTitle from "../components/title/PageTitle";

function Home({ onLogout }) {
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);

  const apiService = new ApiService(setLoading);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await apiService.fetchTickets();
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

  useEffect(() => {
    fetchTickets();
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

    try {
      const response = await apiService.createNewTicket(
        title,
        description,
        department
      );
      if (response.status === 201) {
        console.log(response);
        alert("Ticket submitted successfully!");
        setTitle("");
        setDescription("");
        fetchTickets();
      } else {
        alert("Failed to submit the ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setErrors({ form: error.message });
    }
  };

  return (
    <>
      <div className="home">
        <Navbar onLogout={onLogout} />

        <button
          className="btn fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow"
          onClick={() => setShowForm(true)}
        >
          + Create New Ticket
        </button>

        <div className="mt-2 overflow-x-auto">
          <PageTitle>My Tickets</PageTitle>
          <table className=" w-full text-left text-zinc-800 border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Department</th>
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
                    <td className="px-4 py-2 border">
                      {ticket.createdAt.substring(0, 10)}
                    </td>
                    <td className="px-4 py-2 border">{ticket.title}</td>
                    <td className="px-4 py-2 border">{ticket.description}</td>
                    <td className="px-4 py-2 border">{ticket.department}</td>
                    <td className="px-4 py-2 border">{ticket.status}</td>
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

        {showForm && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
              <div className="flex justify-between ">
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
                <div className="mb-0.5">
                  <label htmlFor="description" className={FormFields.label}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    className={FormFields.input}
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
                    aria-placeholder="Select a department..."
                    className={FormFields.input}
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="other">Select Department</option>
                    <option value="is">is</option>
                    <option value="hr">hr</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
                {errors.department && (
                  <p className={validations.required}>{errors.department}</p>
                )}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Create
                  </button>
                  {errors.form && (
                    <p className={validations.required}>{errors.form}</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
