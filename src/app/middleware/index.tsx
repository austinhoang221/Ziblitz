import axios from "axios";
import Endpoint from "../api/endpoint";

// Create an Axios instance
export const axiosInstance = axios.create({
  baseURL: Endpoint.baseUrl, // Replace with your API's base URL
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    if (error?.response?.status === 401) {
    }
    return Promise.reject(error);
  }
);
