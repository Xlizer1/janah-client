import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "@/hooks/useTranslation";
import { formatPrice } from "@/utils/price";

interface LocalizedTextProps {
  children: React.ReactNode;
  component?: React.ElementType;
  [key: string]: any;
}

/**
 * Component that automatically applies RTL-aware styling
 */
export function LocalizedText({
  children,
  component = "span",
  ...props
}: LocalizedTextProps) {
  const { isRTL } = useTranslation();

  return React.createElement(
    component,
    {
      ...props,
      style: {
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
        ...props.style,
      },
    },
    children
  );
}

interface LocalizedPriceProps {
  price: number;
  variant?:
    | "body1"
    | "body2"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2";
  color?: string;
  compact?: boolean;
  showCurrency?: boolean;
  [key: string]: any;
}

/**
 * Component for displaying localized prices
 */
export function LocalizedPrice({
  price,
  variant = "body1",
  color,
  compact = false,
  showCurrency = true,
  ...props
}: LocalizedPriceProps) {
  const { currentLanguage, formatCurrency } = useTranslation();

  const formattedPrice = formatPrice(price, {
    locale: currentLanguage === "ar" ? "ar-IQ" : "en-US",
    compact,
    showCurrency,
  });

  return (
    <Typography
      variant={variant}
      color={color}
      {...props}
      sx={{
        fontFamily:
          currentLanguage === "ar"
            ? '"Cairo", "Tajawal", Arial, sans-serif'
            : undefined,
        fontWeight: currentLanguage === "ar" ? 600 : undefined,
        ...props.sx,
      }}
    >
      {formattedPrice}
    </Typography>
  );
}

interface LocalizedNumberProps {
  number: number;
  variant?:
    | "body1"
    | "body2"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2";
  [key: string]: any;
}

/**
 * Component for displaying localized numbers
 */
export function LocalizedNumber({
  number,
  variant = "body1",
  ...props
}: LocalizedNumberProps) {
  const { formatNumber, currentLanguage } = useTranslation();

  return (
    <Typography
      variant={variant}
      {...props}
      sx={{
        fontFamily:
          currentLanguage === "ar"
            ? '"Cairo", "Tajawal", Arial, sans-serif'
            : undefined,
        ...props.sx,
      }}
    >
      {formatNumber(number)}
    </Typography>
  );
}

interface LocalizedDateProps {
  date: Date | string;
  options?: Intl.DateTimeFormatOptions;
  variant?:
    | "body1"
    | "body2"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2";
  [key: string]: any;
}

/**
 * Component for displaying localized dates
 */
export function LocalizedDate({
  date,
  options,
  variant = "body1",
  ...props
}: LocalizedDateProps) {
  const { formatDate, currentLanguage } = useTranslation();

  return (
    <Typography
      variant={variant}
      {...props}
      sx={{
        fontFamily:
          currentLanguage === "ar"
            ? '"Cairo", "Tajawal", Arial, sans-serif'
            : undefined,
        ...props.sx,
      }}
    >
      {formatDate(date, options)}
    </Typography>
  );
}

interface DirectionAwareBoxProps {
  children: React.ReactNode;
  reverseInRTL?: boolean;
  [key: string]: any;
}

/**
 * Box component that handles RTL layouts automatically
 */
export function DirectionAwareBox({
  children,
  reverseInRTL = false,
  ...props
}: DirectionAwareBoxProps) {
  const { isRTL } = useTranslation();

  const shouldReverse = reverseInRTL && isRTL;

  return (
    <Box
      {...props}
      sx={{
        ...(shouldReverse && {
          flexDirection: "row-reverse",
        }),
        ...props.sx,
      }}
    >
      {children}
    </Box>
  );
}

interface RTLAwareIconProps {
  children: React.ReactNode;
  flipInRTL?: boolean;
  [key: string]: any;
}

/**
 * Icon wrapper that flips icons in RTL when needed
 */
export function RTLAwareIcon({
  children,
  flipInRTL = false,
  ...props
}: RTLAwareIconProps) {
  const { isRTL } = useTranslation();

  return (
    <Box
      component="span"
      {...props}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        ...(flipInRTL &&
          isRTL && {
            transform: "scaleX(-1)",
          }),
        ...props.sx,
      }}
    >
      {children}
    </Box>
  );
}

interface BilingualTextProps {
  en: string;
  ar: string;
  fallback?: string;
  component?: React.ElementType;
  [key: string]: any;
}

/**
 * Component that displays different text based on current language
 */
export function BilingualText({
  en,
  ar,
  fallback,
  component = "span",
  ...props
}: BilingualTextProps) {
  const { currentLanguage } = useTranslation();

  const text = currentLanguage === "ar" ? ar : en;
  const displayText = text || fallback || "";

  return React.createElement(
    component,
    {
      ...props,
      style: {
        fontFamily:
          currentLanguage === "ar"
            ? '"Cairo", "Tajawal", Arial, sans-serif'
            : undefined,
        ...props.style,
      },
    },
    displayText
  );
}

interface LanguageSensitiveSpacingProps {
  children: React.ReactNode;
  spacing?: number;
  [key: string]: any;
}

/**
 * Component that applies appropriate spacing based on language
 */
export function LanguageSensitiveSpacing({
  children,
  spacing = 1,
  ...props
}: LanguageSensitiveSpacingProps) {
  const { isRTL } = useTranslation();

  return (
    <Box
      {...props}
      sx={{
        display: "flex",
        gap: spacing,
        alignItems: "center",
        flexDirection: isRTL ? "row-reverse" : "row",
        ...props.sx,
      }}
    >
      {children}
    </Box>
  );
}

/**
 * Hook for getting direction-aware margins and paddings
 */
export function useDirectionalSpacing() {
  const { isRTL } = useTranslation();

  return {
    marginStart: (value: number | string) => ({
      [isRTL ? "marginRight" : "marginLeft"]: value,
    }),
    marginEnd: (value: number | string) => ({
      [isRTL ? "marginLeft" : "marginRight"]: value,
    }),
    paddingStart: (value: number | string) => ({
      [isRTL ? "paddingRight" : "paddingLeft"]: value,
    }),
    paddingEnd: (value: number | string) => ({
      [isRTL ? "paddingLeft" : "paddingRight"]: value,
    }),
    textAlign: isRTL ? ("right" as const) : ("left" as const),
    direction: isRTL ? ("rtl" as const) : ("ltr" as const),
  };
}

/**
 * Utility function to get localized error messages
 */
export function getLocalizedErrorMessage(
  error: any,
  t: (key: string) => string
): string {
  if (typeof error === "string") {
    return error;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  // Try to match common error patterns
  if (error?.response?.status === 401) {
    return t("error.unauthorized");
  }

  if (error?.response?.status === 403) {
    return t("error.forbidden");
  }

  if (error?.response?.status === 404) {
    return t("error.notFound");
  }

  if (error?.response?.status >= 500) {
    return t("error.server");
  }

  if (error?.code === "NETWORK_ERROR" || error?.code === "ERR_NETWORK") {
    return t("error.network");
  }

  return t("error.generic");
}

/**
 * Component for displaying localized loading states
 */
interface LocalizedLoadingProps {
  message?: string;
  size?: "small" | "medium" | "large";
}

export function LocalizedLoading({
  message,
  size = "medium",
}: LocalizedLoadingProps) {
  const { t } = useTranslation();

  const displayMessage = message || t("common.loading");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        py: size === "large" ? 8 : size === "medium" ? 4 : 2,
      }}
    >
      <LocalizedText
        component={Typography}
        variant="body2"
        color="text.secondary"
      >
        {displayMessage}
      </LocalizedText>
    </Box>
  );
}
