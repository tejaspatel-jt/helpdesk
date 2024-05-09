import React, { useState, useEffect } from "react";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import { Link } from "react-router-dom";
import CloseButton from "../components/button/CloseButton";
import FormFields from "../components/form/FormFields.module.css";
import Card from "../components/card/Card";
import PageTitle from "../components/title/PageTitle";
import ApiService from "../ApiUtils/Api";
const MyProfile = () => {
  // State variables to hold user information and dialog visibility
  const [userDetails, setUserDetails] = useState({
    photo: "",
    username: "",
    email: "",
    contactNo: "",
    dob: "",
    fullname: "",
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log();

    try {
      // Update user details
      const response = await apiService.updateUserDetails(
        userDetails.fullname,
        userDetails.contactNo,
        formatDate(userDetails.dob)
      );
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
    // return response;
  };

  function formatDate(inputDateString) {
    // Parse the input date string into a Date object
    const date = new Date(inputDateString);
    console.log("this is my input date---", inputDateString);

    // Extract day, month, and year from the Date object
    const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero if necessary
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (zero-based index, hence the +1) and pad
    const year = date.getFullYear(); // Get full year

    // Form the desired date format in dd-mm-yyyy
    const formattedDate = `${year}-${month}-${day}`;
    console.log("this is my formatted date---", formattedDate);

    return formattedDate;
  }

  return (
    <>
      <nav className="bg-gray-800 h-16">
        <div className="flex h-full  max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
          <Link
            to="/home"
            // className="flex items-center text-blue-500 hover:text-blue-700"
            className="flex items-center text-xl text-white "
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1 " />
            Go to Homepage
          </Link>
        </div>
      </nav>
      <div className="container mx-auto p-8">
        <PageTitle>My Profile</PageTitle>

        <div className="flex justify-between">
          {/* { User photo } */}
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
          {/* { Edit button } */}
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
            <label className="w-1/4">Full Name:</label>
            <p>{userDetails.fullname}</p>
          </div>
          <div className="flex items-center">
            <label className="w-1/4">Email:</label>
            <p>{userDetails.email}</p>
          </div>
          <div className="flex items-center">
            <label className="w-1/4">Contact Number:</label>
            <p>{userDetails.contactNo}</p>
          </div>
          <div className="flex items-center">
            <label className="w-1/4">Date of Birth:</label>

            {userDetails.dob && <p>{userDetails.dob.substring(0, 10)} </p>}
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
                  Username:
                </label>
                <input
                  type="text"
                  id="name"
                  disabled
                  value={userDetails.username}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, username: e.target.value })
                  }
                  className={FormFields.input}
                />
              </div>

              <div>
                <label htmlFor="city" className={FormFields.label}>
                  Full Name:
                </label>
                <input
                  type="text"
                  id="fullname"
                  value={userDetails.fullname}
                  className={FormFields.input}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, fullname: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="email" className={FormFields.label}>
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  disabled
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
                  value={userDetails.contactNo}
                  minLength={10}
                  maxLength={10}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      contactNo: e.target.value,
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
                  value={userDetails.dob}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, dob: e.target.value })
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
      </div>
    </>
  );
};

export default MyProfile;
