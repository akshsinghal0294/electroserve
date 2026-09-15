import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  // baseURL: "https://electroserve-bzyd.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      console.log("REQUEST:", config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    console.error("REQUEST ERROR:", error);

    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log("SUCCESS:", response.config.url);
    }

    return response;
  },
  (error) => {
    console.error(
      "API ERROR:",
      error.response?.status,
      error.config?.url
    );

    if (
      error.response &&
      error.response.status === 401
    ) {
      localStorage.clear();

      window.location.href =
        "/login";
    }

    return Promise.reject(error);
  }
);

export default api;