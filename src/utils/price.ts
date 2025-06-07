export function formatPrice(price: number | string | null | undefined): string {
  // Handle edge cases
  if (price === null || price === undefined || price === "") {
    return "0 IQD";
  }

  // Convert string to number if needed
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  // Handle invalid numbers
  if (isNaN(numericPrice)) {
    return "0 IQD";
  }

  // Format the number with proper thousand separators
  // Using 'en-US' formatting but with custom IQD suffix since IQD support varies
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0, // IQD typically doesn't use decimals
  }).format(Math.round(numericPrice));

  return `${formattedNumber} IQD`;
}

/**
 * Format price with decimals (for internal calculations)
 */
export function formatPriceWithDecimals(
  price: number | string | null | undefined
): string {
  if (price === null || price === undefined || price === "") {
    return "0.00 IQD";
  }

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numericPrice)) {
    return "0.00 IQD";
  }

  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);

  return `${formattedNumber} IQD`;
}

/**
 * Format price for input fields (returns just the number)
 */
export function formatPriceForInput(
  price: number | string | null | undefined
): string {
  if (price === null || price === undefined || price === "") {
    return "0";
  }

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numericPrice)) {
    return "0";
  }

  return numericPrice.toString();
}

/**
 * Parse price from formatted string back to number
 */
export function parsePrice(formattedPrice: string): number {
  if (!formattedPrice) return 0;

  // Remove IQD suffix and any non-numeric characters except decimal point
  const cleanPrice = formattedPrice
    .replace(/IQD/gi, "")
    .replace(/[^\d.-]/g, "")
    .trim();

  const parsed = parseFloat(cleanPrice);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format price range
 */
export function formatPriceRange(minPrice: number, maxPrice: number): string {
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}

/**
 * Check if a price is valid
 */
export function isValidPrice(price: any): boolean {
  if (price === null || price === undefined || price === "") {
    return false;
  }

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  return !isNaN(numericPrice) && numericPrice >= 0;
}

/**
 * Calculate percentage and format as price
 */
export function calculatePercentagePrice(
  basePrice: number,
  percentage: number
): string {
  const calculatedPrice = basePrice * (percentage / 100);
  return formatPrice(calculatedPrice);
}

/**
 * Format large numbers with K, M suffixes for analytics
 */
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

// Export default formatPrice for easy importing
export default formatPrice;
