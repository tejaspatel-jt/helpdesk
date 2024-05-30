import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContextProvider";
import debounce from "lodash/debounce";
const FilterDropdown = ({
  status,
  setStatus,
  department,
  setDepartment,
  username,
  setUsername,
}) => {
  const { userDetails } = useContext(UserContext);
  const [inputValue, setInputValue] = useState("");

  const handleStatusChange = useCallback(
    (e) => {
      setStatus(e.target.value);
    },
    [setStatus]
  );

  const handleDepartmentChange = useCallback(
    (e) => {
      setDepartment(e.target.value);
    },
    [setDepartment]
  );
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSetUsername(value);
  };

  // Debounce function to set the username state
  const debouncedSetUsername = useCallback(
    debounce((value) => {
      setUsername(value);
    }, 300),
    [setUsername]
  );

  return (
    <div className=" justify-end filter-dropdowns mb-4 flex sticky top-16 gap-4 pt-2 z-10 bg-white">
      <div className="search-bar">
        <label htmlFor="username" className="mr-2">
          Username:
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="dropdown mr-4">
        <label htmlFor="status" className="mr-2">
          Status:
        </label>
        <select
          id="status"
          value={status}
          // onChange={(e) => setStatus(e.target.value)}
          onChange={handleStatusChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All</option>
          <option value={"raised"}>Raised</option>
          <option value={`accepted_${userDetails.role}`}>Accepted</option>
          <option value={`rejected_${userDetails.role}`}>Rejected</option>
        </select>
      </div>
      {userDetails.role === "master" ? (
        <div className="dropdown mr-4">
          <label htmlFor="department" className="mr-2">
            Department:
          </label>
          <select
            id="department"
            value={department}
            // onChange={(e) => setDepartment(e.target.value)}
            onChange={handleDepartmentChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">All</option>
            <option value="hr">HR</option>
            <option value="is">IS</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default FilterDropdown;
