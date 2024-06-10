import React, { useCallback, useContext, useState } from "react";
import { UserContext } from "../contexts/UserContextProvider";
import debounce from "lodash/debounce";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import Example from "../dropdown/Dropdown";

import ApiService from "../../ApiUtils/Api";
const FilterDropdown = ({
  status,
  setStatus,
  department,
  setDepartment,
  username,
  setUsername,
}) => {
  const [loading, setLoading] = useState(false);
  const { userDetails } = useContext(UserContext);
  const [search, setSearch] = useState([]);
  const apiService = new ApiService(setLoading);

  const statusOptions = [
    { value: "", label: "All" },
    { value: "raised", label: "Raised" },
    { value: `accepted_${userDetails.role}`, label: "Accepted" },
    { value: `rejected_${userDetails.role}`, label: "Rejected" },
  ];

  const departmentOptions = [
    { value: "", label: "All" },
    { value: "hr", label: "HR" },
    { value: "is", label: "IS" },
    { value: "admin", label: "Admin" },
  ];

  const handleStatusChange = useCallback(
    (value) => {
      setStatus(value);
    },
    [setStatus]
  );

  const handleDepartmentChange = useCallback(
    (value) => {
      setDepartment(value);
    },
    [setDepartment]
  );

  const handleOnSearch = async (query) => {
    if (query.length === 3) {
      try {
        const response = await apiService.getAllUsernames(query);
        if (response.status === 200) {
          setSearch(
            response.data.data.map((user) => ({
              id: user._id,
              name: user.username,
            }))
          );
        } else {
          setSearch([]);
        }
      } catch (error) {
        console.error("Error fetching usernames", error);
      }
    }
  };

  const debouncedSetUsername = useCallback(debounce(handleOnSearch, 400));

  const handleOnSelect = (item) => {
    setUsername(item.name);
  };

  return (
    <div className=" smallDesktop:flex-row justify-end filter-dropdowns mb-4 flex sticky top-16 gap-4 py-2 z-10 bg-white smallMobile:flex-col">
      <div className="search-bar flex items-center smallMobile:ml-[20px]">
        <label htmlFor="username" className="mr-2">
          Username:
        </label>
        <ReactSearchAutocomplete
          className="w-[200px]"
          items={search}
          onSearch={debouncedSetUsername}
          // onSearch={handleOnSearch}
          onSelect={handleOnSelect}
          autoFocus
          debounce={400}
          styling={{ zIndex: 4, height: "35px", border: "2px solid gray" }} // To ensure the suggestions dropdown is above other elements
        />
      </div>

      <div className="smallMobile:flex-row smallMobile:justify-evenly">
        <div className="dropdown mr-4">
          <label htmlFor="status" className="mr-2">
            Status:
          </label>
          <Example
            label={
              statusOptions.find((opt) => opt.value === status)?.label ||
              "Select Status"
            }
            options={statusOptions}
            selectedOption={status}
            onChange={handleStatusChange}
          />
        </div>
        {userDetails.role === "master" ? (
          <div className="dropdown mr-4">
            <label htmlFor="department" className="mr-2">
              Department:
            </label>
            <Example
              label={
                departmentOptions.find((opt) => opt.value === department)
                  ?.label || "Select Department"
              }
              options={departmentOptions}
              selectedOption={department}
              onChange={handleDepartmentChange}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FilterDropdown;
