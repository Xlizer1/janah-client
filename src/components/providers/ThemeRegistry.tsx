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
      background: {
        default: "#fafafa",
        paper: "#ffffff",
      },
      grey: {
        50: "#f9fafb",
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#4b5563",
        700: "#374151",
        800: "#1f2937",
        900: "#111827",
      },
    },
    typography: {
      fontFamily:
        direction === "rtl"
          ? '"Cairo", "Tajawal", "Amiri", Arial, sans-serif'
          : '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: {
        fontWeight: direction === "rtl" ? 700 : 600,
        lineHeight: direction === "rtl" ? 1.3 : 1.2,
      },
      h2: {
        fontWeight: direction === "rtl" ? 700 : 600,
        lineHeight: direction === "rtl" ? 1.3 : 1.2,
      },
      h3: {
        fontWeight: direction === "rtl" ? 700 : 600,
        lineHeight: direction === "rtl" ? 1.3 : 1.2,
      },
      h4: {
        fontWeight: direction === "rtl" ? 700 : 600,
        lineHeight: direction === "rtl" ? 1.3 : 1.2,
      },
      h5: {
        fontWeight: direction === "rtl" ? 700 : 600,
        lineHeight: direction === "rtl" ? 1.3 : 1.2,
      },
      h6: {
        fontWeight: direction === "rtl" ? 700 : 600,
        lineHeight: direction === "rtl" ? 1.3 : 1.2,
      },
      body1: {
        lineHeight: direction === "rtl" ? 1.7 : 1.5,
      },
      body2: {
        lineHeight: direction === "rtl" ? 1.6 : 1.4,
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
            ...(direction === "rtl" && {
              fontFamily: '"Cairo", "Tajawal", Arial, sans-serif',
            }),
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
              ...(direction === "rtl" && {
                fontFamily: '"Cairo", "Tajawal", Arial, sans-serif',
              }),
            },
            "& .MuiInputLabel-root": {
              ...(direction === "rtl" && {
                fontFamily: '"Cairo", "Tajawal", Arial, sans-serif',
                transformOrigin: "top right",
                left: "auto",
                right: 14,
                "&.MuiInputLabel-shrink": {
                  transformOrigin: "top right",
                },
              }),
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            ...(direction === "rtl" && {
              fontFamily: '"Cairo", "Tajawal", Arial, sans-serif',
            }),
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            ...(direction === "rtl" && {
              fontFamily: '"Cairo", "Tajawal", Arial, sans-serif',
            }),
          },
        },
      },
      // RTL-specific component overrides
      MuiDrawer: {
        styleOverrides: {
          paper: {
            ...(direction === "rtl" && {
              fontFamily: '"Cairo", "Tajawal", Arial, sans-serif',
            }),
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            ...(direction === "rtl" && {
              "& .MuiToolbar-root": {
                flexDirection: "row-reverse",
              },
            }),
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            ...(direction === "rtl" && {
              fontFamily: '"Cairo", "Tajawal", Arial, sans-serif',
            }),
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            ...(direction === "rtl" && {
              fontFamily: '"Cairo", "Tajawal", Arial, sans-serif',
            }),
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            ...(direction === "rtl" && {
              textAlign: "right",
              fontFamily: '"Cairo", "Tajawal", Arial, sans-serif',
            }),
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            ...(direction === "rtl" && {
              marginLeft: 16,
              marginRight: 0,
              "& .MuiFormControlLabel-label": {
                paddingRight: 11,
                paddingLeft: 0,
                fontFamily: '"Cairo", "Tajawal", Arial, sans-serif',
              },
            }),
          },
        },
      },
      MuiBreadcrumbs: {
        styleOverrides: {
          separator: {
            ...(direction === "rtl" && {
              transform: "scaleX(-1)",
            }),
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
            document.body.dir = "rtl";
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
          document.body.dir = "rtl";
        } else {
          // Ensure LTR is set explicitly
          document.documentElement.dir = "ltr";
          document.body.dir = "ltr";
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

    // Listen for custom language change events
    const handleLanguageChange = () => {
      checkRTL();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("languagechange", handleLanguageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languagechange", handleLanguageChange);
    };
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
