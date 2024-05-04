import React, { useState, useEffect } from "react";
import axios from "axios";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import { Link } from "react-router-dom";
import CloseButton from "../components/button/CloseButton";
import FormFields from "../components/form/FormFields.module.css";
import Card from "../components/card/Card";
import PageTitle from "../components/title/PageTitle";
import ApiService from "../ApiUtils/Api";
const MyProfile = ({ userId }) => {
  // State variables to hold user information and dialog visibility
  const [userDetails, setUserDetails] = useState({
    photo: "",
    name: "",
    email: "",
    contactNumber: "",
    dateOfBirth: "",
    city: "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiService = new ApiService(setLoading);

  // Function to fetch user details
  const fetchUserDetails = async () => {
    try {
      const response = await apiService.getCurrentUserDetails();
      setUserDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Fetch user details when the component mounts
  useEffect(() => {
    fetchUserDetails().then((val) => {
      console.log("hello from profile----", val);
    });
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update user details
      const response = await axios.put(`/api/users/${userId}`, userDetails);
      if (response.status === 200) {
        // Successfully updated user details
        setIsDialogOpen(false);
        fetchUserDetails(); // Reload profile details
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="absolute top-0 left-0 m-4">
        <Link
          to="/home"
          // className="flex items-center text-blue-500 hover:text-blue-700"
          className="flex items-center  hover:text-blue-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Go to Homepage
        </Link>
      </div>
      <PageTitle>My Profile</PageTitle>

      <div className="flex justify-between">
        {/* User photo */}
        <div className=" justify-start mb-8">
          <img
            //   src={userDetails.photo}
            src={
              "https://media.istockphoto.com/id/469986766/photo/close-up-portrait-of-child-looking-up.jpg?s=170667a&w=0&k=20&c=7s9KHlN5E-ZfndTEJN70th0f5pnaOl47vta85mK7A5I="
            }
            alt="User Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
        {/* Edit button */}
        <div className=" justify-end mb-4">
          <button
            className="btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow"
            // className="btn  text-white p-3  font-bold shadow-md bg-blue-500 hover:bg-blue-600 focus:outline-none "
            onClick={() => setIsDialogOpen(true)}
          >
            ✎ Edit Profile
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <label className="w-1/4">Name:</label>
          <p>{userDetails.username}</p>
        </div>
        <div className="flex items-center">
          <label className="w-1/4">Email:</label>
          <p>{userDetails.email}</p>
        </div>
        <div className="flex items-center">
          <label className="w-1/4">Contact Number:</label>
          <p>{userDetails.contact}</p>
        </div>
        <div className="flex items-center">
          <label className="w-1/4">Date of Birth:</label>
          <p>{userDetails.dob}</p>
        </div>
        <div className="flex items-center">
          <label className="w-1/4">Role:</label>
          <p>{userDetails.role}</p>
        </div>
      </div>

      {isDialogOpen && (
        <Card>
          <div className="flex justify-between ">
            <h2 className="text-2xl font-semibold text-center  text-zinc-800">
              Edit My Profile
            </h2>
            <CloseButton onclick={() => setIsDialogOpen(false)} />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className={FormFields.label}>
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={userDetails.name}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, name: e.target.value })
                }
                className={FormFields.input}
              />
            </div>
            <div>
              <label htmlFor="email" className={FormFields.label}>
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={userDetails.email}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, email: e.target.value })
                }
                className={FormFields.input}
              />
            </div>
            <div>
              <label htmlFor="contactNumber" className={FormFields.label}>
                Contact Number:
              </label>
              <input
                type="text"
                id="contactNumber"
                value={userDetails.contactNumber}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    contactNumber: e.target.value,
                  })
                }
                className={FormFields.input}
              />
            </div>
            <div>
              <label htmlFor="dateOfBirth" className={FormFields.label}>
                Date of Birth:
              </label>
              <input
                type="date"
                id="dateOfBirth"
                value={userDetails.dateOfBirth}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    dateOfBirth: e.target.value,
                  })
                }
                className={FormFields.input}
              />
            </div>
            <div>
              <label htmlFor="city" className={FormFields.label}>
                City:
              </label>
              <input
                type="text"
                id="city"
                value={userDetails.city}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, city: e.target.value })
                }
                className={FormFields.input}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="btn px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Update Profile
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <Dialog.Panel className="bg-white p-8 rounded shadow-lg w-full max-w-md">
          <Dialog.Title className="text-lg font-bold mb-4">
            Edit Profile
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={userDetails.name}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, name: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={userDetails.email}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, email: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Number:
              </label>
              <input
                type="text"
                id="contactNumber"
                value={userDetails.contactNumber}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    contactNumber: e.target.value,
                  })
                }
                className="mt-1 w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date of Birth:
              </label>
              <input
                type="date"
                id="dateOfBirth"
                value={userDetails.dateOfBirth}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    dateOfBirth: e.target.value,
                  })
                }
                className="mt-1 w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City:
              </label>
              <input
                type="text"
                id="city"
                value={userDetails.city}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, city: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Profile
            </button>

          
            <button
              type="button"
              className="mt-4 w-full bg-red-500 text-white py-2 rounded shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </button>
          </form>
        </Dialog.Panel>
      </Dialog> */}
    </div>
  );
};

export default MyProfile;
