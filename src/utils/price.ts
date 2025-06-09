import { useTranslation } from "@/hooks/useTranslation";

function toNumericPrice(price: number | string | null | undefined): number {
  if (price === null || price === undefined || price === "") return 0;
  const parsed = typeof price === "string" ? parseFloat(price) : price;
  return isNaN(parsed) ? 0 : parsed;
}

interface FormatPriceOptions {
  locale?: string;
  currency?: string;
  compact?: boolean;
  showCurrency?: boolean;
}

export function formatPrice(
  price: number | string | null | undefined,
  options?: string | FormatPriceOptions
): string {
  const numericPrice = toNumericPrice(price);

  let locale = "en-US";
  let currency = "IQD";
  let compact = false;
  let showCurrency = true;

  if (typeof options === "string") {
    currency = options;
  } else if (typeof options === "object" && options !== null) {
    locale = options.locale ?? locale;
    currency = options.currency ?? currency;
    compact = options.compact ?? compact;
    showCurrency = options.showCurrency ?? showCurrency;
  }

  let formatted: string;

  if (compact && numericPrice >= 1000) {
    if (numericPrice >= 1_000_000) {
      formatted = `${(numericPrice / 1_000_000).toFixed(1)}M`;
    } else {
      formatted = `${(numericPrice / 1_000).toFixed(1)}K`;
    }
  } else {
    formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(numericPrice));
  }

  return showCurrency ? `${formatted} ${currency}` : formatted;
}

export function formatPriceWithDecimals(
  price: number | string | null | undefined,
  currency: string = "IQD"
): string {
  const { currentLanguage } = useTranslation();
  const locale = currentLanguage === "ar" ? "ar-IQ" : "en-US";
  const numericPrice = toNumericPrice(price);

  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);

  return `${formattedNumber} ${currency}`;
}

export function formatPriceForInput(
  price: number | string | null | undefined
): string {
  return toNumericPrice(price).toString();
}

export function parsePrice(formattedPrice: string): number {
  if (!formattedPrice) return 0;
  const cleanPrice = formattedPrice.replace(/[^\d.-]/g, "").trim();
  const parsed = parseFloat(cleanPrice);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatPriceRange(
  minPrice: number,
  maxPrice: number,
  currency: string = "IQD"
): string {
  return `${formatPrice(minPrice, currency)} - ${formatPrice(
    maxPrice,
    currency
  )}`;
}

export function isValidPrice(price: any): boolean {
  return toNumericPrice(price) >= 0;
}

export function calculatePercentagePrice(
  basePrice: number,
  percentage: number,
  currency: string = "IQD"
): string {
  const calculatedPrice = basePrice * (percentage / 100);
  return formatPrice(calculatedPrice, currency);
}

export function formatPriceCompact(
  price: number,
  currency: string = "IQD"
): string {
  if (price === 0) return `0 ${currency}`;

  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(1)}M ${currency}`;
  }

  if (price >= 1_000) {
    return `${(price / 1_000).toFixed(1)}K ${currency}`;
  }

  return formatPrice(price, currency);
}

export default formatPrice;
