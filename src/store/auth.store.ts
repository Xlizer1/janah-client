import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import type { User, AuthResponse } from "@/types";
import { authUtils } from "@/lib/api-client";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

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
      isLoading: false, // Changed to false to prevent hydration issues
      isInitialized: false,

      login: (authData: AuthResponse) => {
        const { user, token } = authData;

        authUtils.setToken(token);

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      },

      logout: () => {
        authUtils.removeToken();

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      },

      updateUser: (user: User) => {
        set({ user });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initialize: () => {
        // Prevent multiple initializations
        if (get().isInitialized) return;

        set({ isLoading: true });

        try {
          // Only run on client side
          if (typeof window === "undefined") {
            set({ isLoading: false, isInitialized: true });
            return;
          }

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
                isInitialized: true,
              });
            } catch (error) {
              console.error("Error parsing user cookie:", error);
              authUtils.removeToken();
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                isInitialized: true,
              });
            }
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true,
            });
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => {
        // Return a no-op storage for SSR
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({
        user: state.user,
        // Don't persist loading states to prevent hydration issues
      }),
      skipHydration: true, // Skip automatic hydration to prevent mismatches
    }
  )
);

export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,
    isAdmin: store.user?.role === "admin",
    login: store.login,
    logout: store.logout,
    updateUser: store.updateUser,
    setLoading: store.setLoading,
    initialize: store.initialize,
  };
};
