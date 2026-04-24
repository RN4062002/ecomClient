import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:7059/api/";

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
});

// Attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Only set application/json if it's not FormData
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  } else {
    // For FormData, let the browser/axios set it with boundary
    delete config.headers["Content-Type"];
  }

  return config;
});

export default axiosInstance;
