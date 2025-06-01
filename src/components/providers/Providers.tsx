"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-toastify";
import { AuthInitializer } from "./AuthInitializer";
import { ThemeRegistry } from "./ThemeRegistry";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder during SSR to avoid hydration mismatch
    return (
      <ThemeRegistry>
        <QueryClientProvider client={queryClient}>
          <AuthInitializer />
          {children}
        </QueryClientProvider>
      </ThemeRegistry>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeRegistry>
        <AuthInitializer />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1f2937",
              color: "#f9fafb",
              borderRadius: "8px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#f9fafb",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#f9fafb",
              },
            },
          }}
        />
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </ThemeRegistry>
    </QueryClientProvider>
  );
}
