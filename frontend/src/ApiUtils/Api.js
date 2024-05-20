// api.js
import BaseApi from "./BaseApi";
import axios from "axios";
import {
  USER_LOGIN_ENDPOINT,
  USER_VERIFY_REGISTER_ENDPOINT,
  USER_REGISTER_ENDPOINT,
  USER_SEND_OTP_ENDPOINT,
  USER_VERIFY_OTP_ENDPOINT,
  USER_CREATE_NEW_TICEKT_ENDPOINT,
  USER_FETCH_TICEKTS_ENDPOINT,
  USER_CURRENT_USER_DETAILS,
  USER_UPDATE_PROFILE,
  FETCH_ALL_USER_TICKETS,
  USER_TICKET_APPROVE_REJECT,
} from "./ApiEndpoints";

export default class ApiService {
  constructor(setLoading) {
    this.setLoading = setLoading;
  }

  login = async (email, password) => {
    try {
      this.setLoading(true);
      const response = await BaseApi.post(USER_LOGIN_ENDPOINT, {
        email,
        password,
      });

      const accessToken = response.data.data.accessToken;
      console.log("Access Token:", accessToken);

      return response;
    } catch (error) {
      this.setLoading(false);
      console.log(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  sendPasswordResetOTP = async (email) => {
    try {
      this.setLoading(true);
      const response = await BaseApi.patch(USER_SEND_OTP_ENDPOINT, { email });
      return response;
    } catch (error) {
      this.setLoading(false);
      throw new Error(error.response.data.message);
    } finally {
      this.setLoading(false);
    }
  };

  changePasswordWithOTP = async (email, otp, password, confirmPassword) => {
    try {
      const response = await BaseApi.patch(USER_VERIFY_OTP_ENDPOINT, {
        email: email,
        otp: otp,
        password: password,
        confirmPassword: confirmPassword,
      });
      return response;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  sendRegisterOTP = async (username, email, password) => {
    try {
      this.setLoading(true);
      const response = await BaseApi.post(USER_REGISTER_ENDPOINT, {
        username,
        email,
        password,
      });
      return response;
    } catch (error) {
      this.setLoading(false);
      throw new Error(
        `An error occurred during registration: ${error.response.data.message}`
      );
    } finally {
      this.setLoading(false);
    }
  };

  verifyRegisterOTP = async (email, otp) => {
    try {
      const response = await BaseApi.patch(USER_VERIFY_REGISTER_ENDPOINT, {
        email,
        otp,
      });

      return response;
    } catch (error) {
      throw new Error(
        `An error occurred during registration: ${error.response.data.message}`
      );
    }
  };

  createNewTicket = async (formData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        ContentType: "application/json",
      };

      const response = await BaseApi.post(
        USER_CREATE_NEW_TICEKT_ENDPOINT,

        formData,
        { headers }
      );
      return response;
    } catch (error) {
      this.setLoading(false);
      console.error("Error while creating ticket:", error);
    } finally {
      this.setLoading(false);
    }
  };

  fetchUserTickets = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await BaseApi.get(USER_FETCH_TICEKTS_ENDPOINT, {
        headers,
      });
      console.log(response);
      return response;
    } catch (error) {
      this.setLoading(false);
      console.error("Error fetching tickets:", error);
    } finally {
      this.setLoading(false);
    }
  };

  getCurrentUserDetails = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await BaseApi.get(USER_CURRENT_USER_DETAILS, {
        headers,
      });
      console.log(response.data.data);
      return response;
    } catch (error) {
      this.setLoading(false);
      console.error("Error fetching tickets:", error);
    } finally {
      this.setLoading(false);
    }
  };

  // updateUserDetails = async (fullname, contactNo, dob,avatar) => {
  updateUserDetails = async (formData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        ContentType: "multipart/form-data",
      };

      const response = await BaseApi.patch(
        USER_UPDATE_PROFILE,

        formData,
        { headers }
      );
      console.log(response.data.data);
      return response;
    } catch (error) {
      this.setLoading(false);
      console.error("Error updating profile:", error);
    } finally {
      this.setLoading(false);
    }
  };

  fetchAllUserTicketsPerPage = async (params) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        ContentType: "application/json",
      };

      const response = await BaseApi.get(FETCH_ALL_USER_TICKETS, {
        headers,
        params: params,
      });
      console.log("fetch all user tickets called ----", response);
      return response;
    } catch (error) {
      this.setLoading(false);
      console.error("Error fetching tickets:", error);
    } finally {
      this.setLoading(false);
    }
  };

  handleApproveOrReject = async (body) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        ContentType: "application/json",
      };
      const response = await BaseApi.patch(USER_TICKET_APPROVE_REJECT, body, {
        headers,
      });
      return response;
    } catch (error) {
      this.setLoading(false);
      console.error("Error fetching tickets:", error);
    } finally {
      this.setLoading(false);
    }
  };
}
