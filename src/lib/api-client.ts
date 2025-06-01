import axios, { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import type { ApiResponse, ApiError } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    const message =
      error.response?.data?.message || error.message || "An error occurred";

    if (error.response?.status) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        // Unauthorized - clear token and redirect to login
        Cookies.remove("auth_token");
        Cookies.remove("user");

        // Don't show toast for auth endpoints
        if (!error.config?.url?.includes("/auth/")) {
          toast.error("Session expired. Please log in again.");
          window.location.href = "/auth/login";
        }
      } else if (error.response?.status === 403) {
        toast.error("Access denied");
      } else if (error.response?.status === 404) {
        toast.error("Resource not found");
      } else if (error.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        // Don't show generic errors for auth endpoints as they're handled in forms
        if (!error.config?.url?.includes("/auth/")) {
          toast.error(message);
        }
      }

      return Promise.reject(error);
    } else {
        console.log("wtf")
    }
  }
);

// Generic API request function
export async function apiRequest<T = any>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  endpoint: string,
  data?: any,
  params?: any
): Promise<T> {
  try {
    const response = await apiClient.request<ApiResponse<T>>({
      method,
      url: endpoint,
      data,
      params,
    });

    return response.data.data;
  } catch (error) {
    throw error;
  }
}

// Specific API methods
export const api = {
  // GET request
  get: <T = any>(endpoint: string, params?: any): Promise<T> =>
    apiRequest<T>("GET", endpoint, undefined, params),

  // POST request
  post: <T = any>(endpoint: string, data?: any): Promise<T> =>
    apiRequest<T>("POST", endpoint, data),

  // PUT request
  put: <T = any>(endpoint: string, data?: any): Promise<T> =>
    apiRequest<T>("PUT", endpoint, data),

  // PATCH request
  patch: <T = any>(endpoint: string, data?: any): Promise<T> =>
    apiRequest<T>("PATCH", endpoint, data),

  // DELETE request
  delete: <T = any>(endpoint: string): Promise<T> =>
    apiRequest<T>("DELETE", endpoint),
};

// Auth token management
export const authUtils = {
  setToken: (token: string) => {
    Cookies.set("auth_token", token, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });
  },

  getToken: () => {
    return Cookies.get("auth_token");
  },

  removeToken: () => {
    Cookies.remove("auth_token");
    Cookies.remove("user");
  },

  isAuthenticated: () => {
    return !!Cookies.get("auth_token");
  },
};

export default api;
