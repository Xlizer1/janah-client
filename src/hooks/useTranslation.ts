import { useTranslation as useI18nTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = (language: "en" | "ar") => {
    if (typeof window === "undefined") return;

    i18n.changeLanguage(language);
    document.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  };

  // Return safe defaults during SSR
  const currentLanguage = mounted ? i18n.language : "en";
  const isRTL = mounted ? i18n.language === "ar" : false;

  return {
    t,
    changeLanguage,
    currentLanguage,
    isRTL,
    mounted, // Expose mounted state for components that need it
  };
};
