import React, { useContext, useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import Navbar from "../components/navbar/Navbar";
import { UserContext } from "../components/contexts/UserContextProvider";
import ApiService from "../ApiUtils/Api";

const colors = {
  Approved: "#F3DE0C",
  Resolved: "#F3350C",
  Returned: "#0C3AF3",
  "On Hold": "#008000",
  open: "#FF7F50",
};

const generateDepartmentData = (departmentData) => {
  return Object.keys(departmentData).map((key) => ({
    title: key.charAt(0).toUpperCase() + key.slice(1),
    value: departmentData[key],
    color: colors[key.charAt(0).toUpperCase() + key.slice(1)] || "#000",
    isZero: departmentData[key] === 0, // Flag to indicate if the value is 0
  }));
};

const AdminDashboard = () => {
  const { userDetails } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchAdminDashboardData = async () => {
      try {
        const apiService = new ApiService(setLoading);
        const response = await apiService.getAdminDashboardData();
        setDashboardData(response.data.data.tickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchAdminDashboardData();
  }, []);

  if (!dashboardData) {
    return (
      <div className=" flex h-screen justify-center items-center">
        <span className="font-2xl font-bold">Loading...</span>
      </div>
    );
  }

  const departments = ["admin", "hr", "is", "finance"];

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <Navbar userRole={userDetails.role} />
      <header className="p-5 text-white text-center rounded">
        <h1 className="text-3xl text-jtBlue">Admin Dashboard</h1>
      </header>
      <main className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        {departments.map((department) => {
          const departmentData = generateDepartmentData(
            dashboardData.department[department]
          );
          return (
            <section
              className="bg-white p-5 rounded shadow-md"
              key={department}
            >
              <h2 className="text-2xl font-semibold mb-4 text-center">
                {`${
                  department.charAt(0).toUpperCase() + department.slice(1)
                } Department`}
              </h2>
              <div className="flex justify-center items-center">
                <ul className="mr-10">
                  {departmentData.map((entry, index) => (
                    <li key={index} className="mb-2 text-lg flex items-center">
                      <span
                        className="inline-block w-3 h-3 mr-2"
                        style={{ backgroundColor: entry.color }}
                      ></span>
                      <p className="font-medium">{`${entry.title}: ${entry.value}`}</p>
                    </li>
                  ))}
                </ul>
                <PieChart
                  data={departmentData.filter((entry) => !entry.isZero)} // Filter out entries with a value of 0
                  animate
                  animationDuration={500}
                  animationEasing="ease-out"
                  label={({ dataEntry }) =>
                    `${Math.round(dataEntry.percentage)} %`
                  }
                  labelStyle={{
                    fontSize: "5px",
                    fill: "#FFFFFA",
                    fontWeight: "800",
                  }}
                  style={{ height: "230px", width: "230px" }}
                />
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
};

export default AdminDashboard;
