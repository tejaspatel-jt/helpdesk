import axios from "axios";

const BaseApi = axios.create({
  baseURL: "http://localhost:7700",
});

export default BaseApi;
