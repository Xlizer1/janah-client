import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslations from "../locales/en/common";
import arTranslations from "../locales/ar/common";

const resources = {
  en: {
    common: enTranslations,
  },
  ar: {
    common: arTranslations,
  },
};

// Check if we're on the client side
const isClient = typeof window !== "undefined";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    defaultNS: "common",
    lng: "en", // Set default language for SSR consistency

    interpolation: {
      escapeValue: false,
    },

    detection: {
      // Only detect on client side
      order: isClient ? ["localStorage", "navigator", "htmlTag"] : [],
      caches: isClient ? ["localStorage"] : [],
      // Don't lookup from localStorage during SSR
      lookupLocalStorage: isClient ? "i18nextLng" : undefined,
    },

    // Disable suspense to prevent hydration issues
    react: {
      useSuspense: false,
    },

    // Only use client-side detection
    initImmediate: isClient,
  });

export default i18n;
