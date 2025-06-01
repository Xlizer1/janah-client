import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import type { User, AuthResponse } from "@/types";
import { authUtils } from "@/lib/api-client";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (authData: AuthResponse) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: (authData: AuthResponse) => {
        const { user, token } = authData;

        // Set token in cookies
        authUtils.setToken(token);

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        // Remove token from cookies
        authUtils.removeToken();

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (user: User) => {
        set({ user });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initialize: () => {
        const token = authUtils.getToken();
        const userCookie = Cookies.get("user");

        if (token && userCookie) {
          try {
            const user = JSON.parse(userCookie);
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            // Invalid user data, clear everything
            authUtils.removeToken();
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } else {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        // Don't persist token in localStorage, use cookies instead
      }),
      onRehydrateStorage: () => (state) => {
        // Initialize auth state after rehydration
        if (state) {
          state.initialize();
        }
      },
    }
  )
);

// Helper hooks
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    isAdmin: store.user?.role === "admin",
    login: store.login,
    logout: store.logout,
    updateUser: store.updateUser,
    setLoading: store.setLoading,
    initialize: store.initialize,
  };
};
