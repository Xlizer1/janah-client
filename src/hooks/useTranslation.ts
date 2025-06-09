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
      document.body.dir = isRTL ? "rtl" : "ltr";

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
      document.documentElement.style.setProperty(
        "--start",
        isRTL ? "right" : "left"
      );
      document.documentElement.style.setProperty(
        "--end",
        isRTL ? "left" : "right"
      );

      // Update body classes for additional styling
      if (isRTL) {
        document.body.classList.add("rtl");
        document.body.classList.remove("ltr");
      } else {
        document.body.classList.add("ltr");
        document.body.classList.remove("rtl");
      }

      // Force theme re-evaluation by triggering a storage event
      localStorage.setItem("i18nextLng", language);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "i18nextLng",
          newValue: language,
        })
      );

      // Dispatch custom language change event for components that need to react
      window.dispatchEvent(
        new CustomEvent("languagechange", {
          detail: { language, isRTL },
        })
      );

      // Show success message
      const message =
        language === "ar"
          ? "تم تغيير اللغة بنجاح"
          : "Language changed successfully";

      // You can use your toast notification here
      console.log(message);
    } catch (error) {
      console.error("Error changing language:", error);
      // Show error message
      const errorMessage =
        language === "ar" ? "فشل في تغيير اللغة" : "Failed to change language";
      console.error(errorMessage);
    }
  };

  // Helper function to format numbers in Arabic or English
  const formatNumber = (number: number) => {
    if (!mounted) return number.toString();

    const locale = i18n.language === "ar" ? "ar-IQ" : "en-US";
    return new Intl.NumberFormat(locale).format(number);
  };

  // Helper function to format dates
  const formatDate = (
    date: Date | string,
    options?: Intl.DateTimeFormatOptions
  ) => {
    if (!mounted) return new Date(date).toLocaleDateString();

    const locale = i18n.language === "ar" ? "ar-IQ" : "en-US";
    const dateObj = typeof date === "string" ? new Date(date) : date;

    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options,
    };

    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
  };

  // Helper function to format currency
  const formatCurrency = (amount: number, currency: string = "IQD") => {
    if (!mounted) return `${amount} ${currency}`;

    const locale = i18n.language === "ar" ? "ar-IQ" : "en-US";

    // For IQD, we'll format manually since it's not well supported
    if (currency === "IQD") {
      const formatted = formatNumber(amount);
      return i18n.language === "ar" ? `${formatted} د.ع` : `${formatted} IQD`;
    }

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  };

  // Helper function for pluralization
  const pluralize = (count: number, singular: string, plural?: string) => {
    if (!mounted) return `${count} ${singular}`;

    const key = plural || `${singular}s`;
    return t(key, { count });
  };

  // Return safe defaults during SSR
  const currentLanguage = mounted ? i18n.language : "en";
  const isRTL = mounted ? i18n.language === "ar" : false;
  const isLoading = !mounted || i18n.isInitialized === false;

  return {
    t,
    changeLanguage,
    currentLanguage,
    isRTL,
    mounted,
    isLoading,
    formatNumber,
    formatDate,
    formatCurrency,
    pluralize,

    // Convenience properties
    isArabic: currentLanguage === "ar",
    isEnglish: currentLanguage === "en",
    dir: isRTL ? "rtl" : "ltr",
  };
};
