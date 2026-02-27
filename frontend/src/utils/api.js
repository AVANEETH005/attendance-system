import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

/* ==========================
   REQUEST INTERCEPTOR
========================== */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["x-auth-token"] = token;  // ✅ keep this
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ==========================
   RESPONSE INTERCEPTOR
========================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only logout if token actually invalid
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized - Token invalid or expired");
    }

    return Promise.reject(error);
  }
);

export default api;