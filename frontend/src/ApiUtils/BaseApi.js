import axios from "axios";

const BaseApi = axios.create({
  // baseURL: `${process.env.REACT_APP_Base_Url}`, // Your API base URL
  baseURL: "http://localhost:7000",
});

export default BaseApi;
