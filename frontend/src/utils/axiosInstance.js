import axios from "axios";
import { BASE_URL } from "./apiPaths";
import { toast } from "react-toastify";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status) {
      switch (status) {
        case 401:
          toast.error("Session expired. Redirecting to login...");
          setTimeout(() => {
            window.location.href = "/login"; // You can replace this with navigate("/login") inside a hook
          }, 1500);
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error(`Error ${status}: ${error.response.data?.message || "Unexpected error."}`);
          break;
      }
    } else if (error.code === "ECONNABORTED") {
      toast.error("Request timeout. Please try again.");
    } else {
      toast.error("Network error. Please check your internet connection.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
