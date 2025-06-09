import React, { useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface RTLProviderProps {
  children: React.ReactNode;
}

export function RTLProvider({ children }: RTLProviderProps) {
  const { isRTL, mounted } = useTranslation();

  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      // Ensure body direction is set correctly
      document.body.dir = isRTL ? "rtl" : "ltr";

      // Add/remove RTL class for additional styling
      if (isRTL) {
        document.body.classList.add("rtl");
        document.body.classList.remove("ltr");
      } else {
        document.body.classList.add("ltr");
        document.body.classList.remove("rtl");
      }
    }
  }, [isRTL, mounted]);

  return <>{children}</>;
}
