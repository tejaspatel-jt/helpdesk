// import React from "react";
// import { PieChart } from "react-minimal-pie-chart";

// const AdminDashboard = () => {
//   const data = [
//     { title: "In Review", value: 40, color: "#F3DE0C" },
//     { title: "Accepted", value: 30, color: "#008000" },
//     { title: "Rejected", value: 20, color: "#F3350C" },
//     { title: "Closed", value: 10, color: "#0C3AF3" },
//   ];

//   return (
//     <div className="font-sans text-gray-800 p-5 bg-gray-100 min-h-screen">
//       <header className="bg-blue-900 p-5 text-white text-center rounded">
//         <h1 className="text-3xl">Admin Dashboard</h1>
//       </header>
//       <main className="mt-5 flex flex-col items-center">
//         <section className="bg-white p-5 rounded shadow-md mb-5 w-full max-w-4xl">
//           <h2 className="text-2xl font-bold mb-4 text-center">
//             Tickets by Status
//           </h2>
//           <div className="flex justify-center items-center">
//             <ul className="mr-10">
//               {data.map((entry, index) => (
//                 <li key={index} className="mb-2 text-lg flex items-center">
//                   <span
//                     className="inline-block w-3 h-3 mr-2"
//                     style={{ backgroundColor: entry.color }}
//                   ></span>
//                   <p className="font-medium">
//                     {entry.title}: {entry.value}%
//                   </p>
//                 </li>
//               ))}
//             </ul>
//             <PieChart
//               data={data}
//               animate
//               animationDuration={500}
//               animationEasing="ease-out"
//               label={({ dataEntry }) => `${Math.round(dataEntry.percentage)} %`}
//               labelStyle={{
//                 fontSize: "5px",
//                 fontColor: "FFFFFA",
//                 fontWeight: "800",
//               }}
//               style={{ height: "300px", width: "300px" }}
//             />
//           </div>
//         </section>
//         <section className="flex justify-around w-full max-w-xl mt-5">
//           <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
//             Add Data
//           </button>
//           <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300">
//             Remove Data
//           </button>
//           <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300">
//             Update Data
//           </button>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;

// src/AdminDashboard.js
import React, { useContext } from "react";
import { PieChart } from "react-minimal-pie-chart";
import Navbar from "../components/navbar/Navbar";
import { MyRoutes } from "../common/common.config";
import { UserContext } from "../components/contexts/UserContextProvider";

const AdminDashboard = () => {
  const { userDetails } = useContext(UserContext);
  const salesData = [
    { title: "In Review", value: 40, color: "#F3DE0C" },
    { title: "Accepted", value: 30, color: "#008000" },
    { title: "Rejected", value: 20, color: "#F3350C" },
    { title: "Closed", value: 10, color: "#0C3AF3" },
  ];

  const stockData = [
    { title: "Master", value: 40, color: "#4CAF50" },
    { title: "Administration", value: 25, color: "#2196F3" },
    { title: "Information Security", value: 15, color: "#FF9800" },
    { title: "Human Resource", value: 35, color: "#C13C97" },
    { title: "Finance", value: 35, color: "#bffa5a" },
  ];

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <Navbar userRole={userDetails.role} />
      <header className=" p-5 text-white text-center rounded">
        <h1 className="text-3xl text-jtBlue">Admin Dashboard</h1>
      </header>
      <main className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Sales Distribution */}
        <section className="bg-white p-5 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Tickets By Status
          </h2>
          <div className="flex justify-center items-center">
            <ul className="mr-10">
              {salesData.map((entry, index) => (
                <li key={index} className="mb-2 text-lg flex items-center">
                  <span
                    className="inline-block w-3 h-3 mr-2"
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <p className="font-medium">
                    {entry.title}: {entry.value}%{" "}
                  </p>
                </li>
              ))}
            </ul>
            <PieChart
              data={salesData}
              animate
              animationDuration={500}
              animationEasing="ease-out"
              label={({ dataEntry }) => `${Math.round(dataEntry.percentage)} %`}
              labelStyle={{
                fontSize: "5px",
                fontColor: "FFFFFA",
                fontWeight: "800",
              }}
              style={{ height: "300px", width: "300px" }}
            />
          </div>
        </section>
        {/* Stock Analysis */}
        <section className="bg-white p-5 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Tickets By Owner
          </h2>
          <div className="flex justify-center items-center">
            <ul className="mr-10">
              {stockData.map((entry, index) => (
                <li key={index} className="mb-2 text-lg flex items-center">
                  <span
                    className="inline-block w-3 h-3 mr-2"
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <p className="font-medium">
                    {entry.title}: {entry.value}%
                  </p>
                </li>
              ))}
            </ul>
            <PieChart
              data={stockData}
              animate
              animationDuration={500}
              animationEasing="ease-out"
              label={({ dataEntry }) => `${Math.round(dataEntry.percentage)} %`}
              labelStyle={{
                fontSize: "5px",
                fontColor: "FFFFFA",
                fontWeight: "800",
              }}
              style={{ height: "300px", width: "300px" }}
            />
          </div>
        </section>
      </main>
      {/* <section className="flex justify-around w-full max-w-xl mt-5">
        <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
          Add Data
        </button>
        <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300">
          Remove Data
        </button>
        <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300">
          Update Data
        </button>
      </section> */}
    </div>
  );
};

export default AdminDashboard;
