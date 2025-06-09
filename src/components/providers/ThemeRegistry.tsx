import React, { useEffect, useState } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const cacheLtr = createCache({
  key: "muiltr",
});

const createAppTheme = (direction: "ltr" | "rtl") =>
  createTheme({
    direction,
    palette: {
      mode: "light",
      primary: {
        main: "#0ea5e9",
        light: "#38bdf8",
        dark: "#0284c7",
      },
      secondary: {
        main: "#d946ef",
        light: "#e879f9",
        dark: "#c026d3",
      },
      // ... rest of palette
    },
    typography: {
      fontFamily:
        direction === "rtl"
          ? "Cairo, Tajawal, Arial, sans-serif"
          : "Inter, system-ui, sans-serif",
      // ... rest of typography
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 8,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow:
              "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            "&:hover": {
              boxShadow:
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
          size: "medium",
        },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
          },
        },
      },
      // RTL-specific component overrides
      MuiDrawer: {
        styleOverrides: {
          paper: {
            // Ensure drawer behaves correctly in RTL
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            // Ensure app bar elements align correctly
          },
        },
      },
    },
  });

interface ThemeRegistryProps {
  children: React.ReactNode;
}

export function ThemeRegistry({ children }: ThemeRegistryProps) {
  const [mounted, setMounted] = useState(false);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const checkRTL = () => {
      if (typeof window !== "undefined") {
        // Priority 1: Check document direction (set by app)
        const dir = document.documentElement.dir || document.body.dir;
        if (dir === "rtl") {
          setIsRTL(true);
          return;
        }

        // Priority 2: Check stored language preference
        try {
          const storedLang = localStorage.getItem("i18nextLng");
          if (storedLang === "ar") {
            setIsRTL(true);
            // Set document direction if not already set
            document.documentElement.dir = "rtl";
            return;
          }
        } catch (e) {
          // localStorage might not be available
        }

        // Priority 3: Check browser language as fallback
        const browserLang = navigator.language || navigator.languages?.[0];
        if (browserLang?.startsWith("ar")) {
          setIsRTL(true);
          document.documentElement.dir = "rtl";
        } else {
          // Ensure LTR is set explicitly
          document.documentElement.dir = "ltr";
        }
      }
    };

    setMounted(true);
    checkRTL();

    // Listen for language changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "i18nextLng") {
        checkRTL();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Use LTR as default for SSR to prevent hydration mismatch
  const theme = createAppTheme(mounted && isRTL ? "rtl" : "ltr");
  const emotionCache = mounted && isRTL ? cacheRtl : cacheLtr;

  return (
    <AppRouterCacheProvider>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </CacheProvider>
    </AppRouterCacheProvider>
  );
}
