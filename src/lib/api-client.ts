import axios, { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import type { ApiResponse, ApiError } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

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

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        toast.error("Request timeout. Please try again.");
      } else if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.");
      } else {
        console.error("Network error:", error.message);
        toast.error("Connection failed. Please try again.");
      }
      return Promise.reject(error);
    }

    const message =
      error.response?.data?.message || error.message || "An error occurred";

    if (error.response?.status) {
      switch (error.response.status) {
        case 401:
          Cookies.remove("auth_token");
          Cookies.remove("user");

          if (!error.config?.url?.includes("/auth/")) {
            toast.error("Session expired. Please log in again.");
            if (typeof window !== "undefined") {
              window.location.href = "/auth/login";
            }
          }
          break;

        case 403:
          toast.error("Access denied");
          break;

        case 404:
          if (
            !error.config?.url?.includes("/auth/") &&
            !error.config?.url?.includes("/products/") &&
            !error.config?.url?.includes("/categories/")
          ) {
            toast.error("Resource not found");
          }
          break;

        case 422:
          break;

        case 429:
          toast.error("Too many requests. Please wait a moment.");
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          toast.error("Server error. Please try again later.");
          break;

        default:
          if (!error.config?.url?.includes("/auth/")) {
            toast.error(message);
          }
      }
    }

    return Promise.reject(error);
  }
);

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

export const api = {
  get: <T = any>(endpoint: string, params?: any): Promise<T> =>
    apiRequest<T>("GET", endpoint, undefined, params),

  post: <T = any>(endpoint: string, data?: any): Promise<T> =>
    apiRequest<T>("POST", endpoint, data),

  put: <T = any>(endpoint: string, data?: any): Promise<T> =>
    apiRequest<T>("PUT", endpoint, data),

  patch: <T = any>(endpoint: string, data?: any): Promise<T> =>
    apiRequest<T>("PATCH", endpoint, data),

  delete: <T = any>(endpoint: string): Promise<T> =>
    apiRequest<T>("DELETE", endpoint),
};

export const authUtils = {
  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      Cookies.set("auth_token", token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }
  },

  getToken: () => {
    if (typeof window !== "undefined") {
      return Cookies.get("auth_token");
    }
    return undefined;
  },

  removeToken: () => {
    if (typeof window !== "undefined") {
      Cookies.remove("auth_token");
      Cookies.remove("user");
    }
  },

  isAuthenticated: () => {
    if (typeof window !== "undefined") {
      return !!Cookies.get("auth_token");
    }
    return false;
  },
};

export default api;
