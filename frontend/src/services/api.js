import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8080",
   baseURL: "https://electroserve-bzyd.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("================================");
    console.log("REQUEST URL:", config.url);
    console.log("TOKEN:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      console.log(
        "AUTH HEADER:",
        config.headers.Authorization
      );
    } else {
      console.log("NO TOKEN FOUND");
    }

    return config;
  },
  (error) => {
    console.error(
      "REQUEST ERROR:",
      error
    );

    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log(
      "SUCCESS:",
      response.config.url
    );

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
      console.log(
        "401 Unauthorized - Logging out"
      );

      localStorage.clear();

      window.location.href =
        "/login";
    }

    return Promise.reject(error);
  }
);

export default api;