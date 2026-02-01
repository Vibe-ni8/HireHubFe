import axios from "axios"
import { clearToken, getToken } from "../services/Token.service"


const api = axios.create({
  baseURL: "https://localhost:7154/api/"
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.replace("/login");
    }
    return Promise.reject(error)
  }
)

export default api;
