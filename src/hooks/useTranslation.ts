import { useTranslation as useI18nTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = async (language: "en" | "ar") => {
    if (typeof window === "undefined") return;

    try {
      // Change i18n language
      await i18n.changeLanguage(language);

      // Update document direction and lang
      const isRTL = language === "ar";
      document.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.lang = language;

      // Update CSS custom properties for RTL-aware styling
      document.documentElement.style.setProperty(
        "--text-align-start",
        isRTL ? "right" : "left"
      );
      document.documentElement.style.setProperty(
        "--text-align-end",
        isRTL ? "left" : "right"
      );
      document.documentElement.style.setProperty(
        "--margin-start",
        isRTL ? "margin-right" : "margin-left"
      );
      document.documentElement.style.setProperty(
        "--margin-end",
        isRTL ? "margin-left" : "margin-right"
      );
      document.documentElement.style.setProperty(
        "--padding-start",
        isRTL ? "padding-right" : "padding-left"
      );
      document.documentElement.style.setProperty(
        "--padding-end",
        isRTL ? "padding-left" : "padding-right"
      );

      // Force theme re-evaluation by triggering a storage event
      localStorage.setItem("i18nextLng", language);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "i18nextLng",
          newValue: language,
        })
      );

      // Trigger page refresh to ensure all components update
      // This is optional but ensures complete RTL switching
      // window.location.reload();
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  // Return safe defaults during SSR
  const currentLanguage = mounted ? i18n.language : "en";
  const isRTL = mounted ? i18n.language === "ar" : false;

  return {
    t,
    changeLanguage,
    currentLanguage,
    isRTL,
    mounted,
  };
};
