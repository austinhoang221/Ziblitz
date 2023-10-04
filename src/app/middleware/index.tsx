import axios from "axios";
import { useNavigate } from "react-router-dom";
import Endpoint from "../api/endpoint";

// Create an Axios instance
export const axiosInstance = axios.create({
  baseURL: Endpoint.baseUrl, // Replace with your API's base URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    if (user) {
      config.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async function (error) {
    if (error?.response?.status === 401) {
      const navigate = useNavigate();
      navigate("/login");
    }
    return Promise.reject(error);
  }
);
