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
        main: "#0ea5e9", // sky-500
        light: "#38bdf8", // sky-400
        dark: "#0284c7", // sky-600
      },
      secondary: {
        main: "#d946ef", // fuchsia-500
        light: "#e879f9", // fuchsia-400
        dark: "#c026d3", // fuchsia-600
      },
      error: {
        main: "#ef4444", // red-500
      },
      warning: {
        main: "#f59e0b", // amber-500
      },
      info: {
        main: "#3b82f6", // blue-500
      },
      success: {
        main: "#10b981", // emerald-500
      },
      background: {
        default: "#ffffff",
        paper: "#ffffff",
      },
      text: {
        primary: "#1f2937", // gray-800
        secondary: "#6b7280", // gray-500
      },
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      h1: {
        fontSize: "2.25rem",
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: "1.875rem",
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: "1.5rem",
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: "1.25rem",
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: "1.125rem",
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 600,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.5,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.4,
      },
      caption: {
        fontSize: "0.75rem",
        lineHeight: 1.3,
      },
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
          contained: {
            "&:hover": {
              boxShadow:
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
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
    },
  });

interface ThemeRegistryProps {
  children: React.ReactNode;
}

export function ThemeRegistry({ children }: ThemeRegistryProps) {
  const [mounted, setMounted] = useState(false);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Check RTL after component mounts to avoid hydration mismatch
    const checkRTL = () => {
      if (typeof window !== "undefined") {
        // Check document direction
        const dir = document.documentElement.dir || document.body.dir;
        if (dir === "rtl") {
          setIsRTL(true);
          return;
        }

        // Check i18n language (if available)
        try {
          const storedLang = localStorage.getItem("i18nextLng");
          if (storedLang === "ar") {
            setIsRTL(true);
            return;
          }
        } catch (e) {
          // localStorage might not be available
        }

        // Check browser language as fallback
        const browserLang = navigator.language || navigator.languages?.[0];
        if (browserLang?.startsWith("ar")) {
          setIsRTL(true);
        }
      }
    };

    setMounted(true);
    checkRTL();
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
