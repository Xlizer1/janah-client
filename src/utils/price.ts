// Enhanced price formatting utility with localization support

export interface PriceFormatOptions {
  locale?: string;
  currency?: string;
  showCurrency?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  compact?: boolean;
}

/**
 * Format price with localization support
 */
export function formatPrice(
  price: number,
  options: PriceFormatOptions = {}
): string {
  const {
    locale = "en-US",
    currency = "IQD",
    showCurrency = true,
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    compact = false,
  } = options;

  // Handle invalid prices
  if (typeof price !== "number" || isNaN(price)) {
    return showCurrency ? `0 ${currency}` : "0";
  }

  try {
    // For compact formatting (e.g., 1.2K, 1.5M)
    if (compact && price >= 1000) {
      const formatter = new Intl.NumberFormat(locale, {
        notation: "compact",
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      });
      const formatted = formatter.format(price);
      return showCurrency ? `${formatted} ${currency}` : formatted;
    }

    // Regular number formatting
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits,
      maximumFractionDigits,
    });

    const formatted = formatter.format(price);

    if (!showCurrency) {
      return formatted;
    }

    // Handle currency display based on locale
    if (currency === "IQD") {
      // For Iraqi Dinar, position based on locale
      return locale.startsWith("ar") ? `${formatted} د.ع` : `${formatted} IQD`;
    }

    // For other currencies, use Intl.NumberFormat with currency
    const currencyFormatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    });

    return currencyFormatter.format(price);
  } catch (error) {
    console.error("Error formatting price:", error);
    // Fallback formatting
    const formatted = price.toLocaleString();
    return showCurrency ? `${formatted} ${currency}` : formatted;
  }
}

/**
 * Format price for specific locales
 */
export function formatPriceArabic(
  price: number,
  options?: Omit<PriceFormatOptions, "locale">
): string {
  return formatPrice(price, { ...options, locale: "ar-IQ" });
}

export function formatPriceEnglish(
  price: number,
  options?: Omit<PriceFormatOptions, "locale">
): string {
  return formatPrice(price, { ...options, locale: "en-US" });
}

/**
 * Format price range
 */
export function formatPriceRange(
  minPrice: number,
  maxPrice: number,
  options: PriceFormatOptions = {}
): string {
  const { locale = "en-US" } = options;

  const min = formatPrice(minPrice, options);
  const max = formatPrice(maxPrice, options);

  // Use locale-appropriate range separator
  const separator = locale.startsWith("ar") ? " - " : " - ";

  return `${min}${separator}${max}`;
}

/**
 * Calculate and format discount percentage
 */
export function formatDiscountPercentage(
  originalPrice: number,
  discountedPrice: number,
  locale: string = "en-US"
): string {
  if (originalPrice <= discountedPrice) {
    return "";
  }

  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formatted = formatter.format(discount);
  return locale.startsWith("ar") ? `%${formatted}-` : `-${formatted}%`;
}

/**
 * Format profit margin percentage
 */
export function formatProfitMargin(
  cost: number,
  sellingPrice: number,
  locale: string = "en-US"
): string {
  if (sellingPrice <= cost) {
    return locale.startsWith("ar") ? "%0" : "0%";
  }

  const margin = ((sellingPrice - cost) / sellingPrice) * 100;
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const formatted = formatter.format(margin);
  return locale.startsWith("ar") ? `%${formatted}` : `${formatted}%`;
}

/**
 * Calculate profit amount
 */
export function calculateProfit(
  cost: number,
  sellingPrice: number,
  quantity: number = 1
): number {
  if (sellingPrice <= cost) {
    return 0;
  }
  return (sellingPrice - cost) * quantity;
}

/**
 * Format profit amount
 */
export function formatProfit(
  cost: number,
  sellingPrice: number,
  quantity: number = 1,
  options: PriceFormatOptions = {}
): string {
  const profit = calculateProfit(cost, sellingPrice, quantity);
  return formatPrice(profit, options);
}

/**
 * Parse price string back to number (useful for form inputs)
 */
export function parsePrice(priceString: string): number {
  if (!priceString) return 0;

  // Remove currency symbols and non-numeric characters except decimal points
  const cleaned = priceString.replace(/[^\d.-]/g, "").replace(/,/g, "");

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Validate price input
 */
export function isValidPrice(price: any): boolean {
  const num = typeof price === "string" ? parsePrice(price) : price;
  return typeof num === "number" && !isNaN(num) && num >= 0;
}

/**
 * Get price display options based on current locale
 */
export function getPriceFormatOptions(locale: string): PriceFormatOptions {
  return {
    locale,
    currency: "IQD",
    showCurrency: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };
}

export function formatPriceCompact(price: number): string {
  if (price === 0) return "0 IQD";

  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M IQD`;
  }

  if (price >= 1000) {
    return `${(price / 1000).toFixed(1)}K IQD`;
  }

  return formatPrice(price);
}

/**
 * Legacy function for backward compatibility
 */
export { formatPrice as default };

// Export commonly used presets
export const priceFormats = {
  standard: {
    showCurrency: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
  compact: { showCurrency: true, compact: true },
  withDecimals: {
    showCurrency: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  noLarge: { showCurrency: false },
} as const;
