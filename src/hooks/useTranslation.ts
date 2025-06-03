import { useTranslation as useI18nTranslation } from "react-i18next";

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation("common");

  const changeLanguage = (language: "en" | "ar") => {
    i18n.changeLanguage(language);
    // Update document direction
    document.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  };

  return {
    t,
    changeLanguage,
    currentLanguage: i18n.language,
    isRTL: i18n.language === "ar",
  };
};
