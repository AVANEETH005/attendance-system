import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["x-auth-token"] = token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
=================================================
 RESPONSE INTERCEPTOR
 Handles unauthorized errors
=================================================
*/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Token expired or invalid
      if (error.response.status === 401) {
        console.warn("Unauthorized - Token invalid or expired");
        
        // Optional: auto logout
        // localStorage.removeItem("token");
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;