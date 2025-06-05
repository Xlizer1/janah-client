import * as yup from "yup";
import type { ProductCreateFormData, ProductEditFormData } from "@/types";

// Create schema - properly typed for ProductCreateFormData
export const productCreateSchema: yup.ObjectSchema<ProductCreateFormData> =
  yup.object({
    name: yup
      .string()
      .required("Product name is required")
      .min(3, "Product name must be at least 3 characters")
      .max(255, "Product name is too long"),
    code: yup
      .string()
      .required("Product code is required")
      .min(3, "Product code must be at least 3 characters")
      .max(50, "Product code is too long")
      .matches(
        /^[A-Z0-9_-]+$/i,
        "Product code can only contain letters, numbers, hyphens, and underscores"
      ),
    slug: yup
      .string()
      .optional()
      .matches(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be lowercase letters, numbers, and hyphens only"
      ),
    description: yup.string().optional().max(5000, "Description is too long"),
    price: yup
      .number()
      .required("Price is required")
      .min(0.01, "Price must be greater than 0")
      .max(999999.99, "Price is too high")
      .test(
        "decimal-places",
        "Price can have at most 2 decimal places",
        (value) => {
          if (value === undefined) return true;
          return /^\d+(\.\d{1,2})?$/.test(value.toString());
        }
      ),
    stock_quantity: yup
      .number()
      .required("Stock quantity is required")
      .min(0, "Stock quantity cannot be negative")
      .integer("Stock quantity must be a whole number")
      .max(999999, "Stock quantity is too high"),
    category_id: yup
      .number()
      .required("Category is required")
      .positive("Please select a valid category"),
    weight: yup
      .number()
      .optional()
      .min(0, "Weight must be positive")
      .max(9999, "Weight is too high")
      .test(
        "decimal-places",
        "Weight can have at most 2 decimal places",
        (value) => {
          if (value === undefined) return true;
          return /^\d+(\.\d{1,2})?$/.test(value.toString());
        }
      ),
    dimensions: yup.string().optional().max(100, "Dimensions text is too long"),
    is_featured: yup.boolean().optional().default(false),
    images: yup
      .array()
      .of(yup.string().required("Image URL is required"))
      .optional()
      .max(5, "Cannot upload more than 5 images")
      .test("valid-images", "All images must be valid", (images) => {
        if (!images || images.length === 0) return true;

        return images.every((image) => {
          // Check if it's a data URL (base64) or regular URL
          if (image.startsWith("data:image/")) {
            try {
              const base64Data = image.split(",")[1];
              if (!base64Data) return false;

              // Test if base64 is valid
              atob(base64Data);

              // Check approximate file size (base64 is ~33% larger than binary)
              const sizeInBytes = (base64Data.length * 3) / 4;
              const maxSize = 10 * 1024 * 1024; // 10MB

              return sizeInBytes <= maxSize;
            } catch {
              return false;
            }
          }

          // For regular URLs, just check basic format
          try {
            new URL(image);
            return true;
          } catch {
            return false;
          }
        });
      }),
  });

// Edit schema - properly typed for ProductEditFormData
export const productEditSchema: yup.ObjectSchema<ProductEditFormData> =
  yup.object({
    product_id: yup.number().required("Product ID is required").positive(),
    name: yup
      .string()
      .required("Product name is required")
      .min(3, "Product name must be at least 3 characters")
      .max(255, "Product name is too long"),
    code: yup
      .string()
      .required("Product code is required")
      .min(3, "Product code must be at least 3 characters")
      .max(50, "Product code is too long")
      .matches(
        /^[A-Z0-9_-]+$/i,
        "Product code can only contain letters, numbers, hyphens, and underscores"
      ),
    slug: yup
      .string()
      .optional()
      .matches(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be lowercase letters, numbers, and hyphens only"
      ),
    description: yup.string().optional().max(5000, "Description is too long"),
    price: yup
      .number()
      .required("Price is required")
      .min(0.01, "Price must be greater than 0")
      .max(999999.99, "Price is too high")
      .test(
        "decimal-places",
        "Price can have at most 2 decimal places",
        (value) => {
          if (value === undefined) return true;
          return /^\d+(\.\d{1,2})?$/.test(value.toString());
        }
      ),
    stock_quantity: yup
      .number()
      .required("Stock quantity is required")
      .min(0, "Stock quantity cannot be negative")
      .integer("Stock quantity must be a whole number")
      .max(999999, "Stock quantity is too high"),
    category_id: yup
      .number()
      .required("Category is required")
      .positive("Please select a valid category"),
    weight: yup
      .number()
      .optional()
      .min(0, "Weight must be positive")
      .max(9999, "Weight is too high")
      .test(
        "decimal-places",
        "Weight can have at most 2 decimal places",
        (value) => {
          if (value === undefined) return true;
          return /^\d+(\.\d{1,2})?$/.test(value.toString());
        }
      ),
    dimensions: yup.string().optional().max(100, "Dimensions text is too long"),
    is_featured: yup.boolean().optional().default(false),
    is_active: yup.boolean().required("Active status is required"),
    images: yup
      .array()
      .of(yup.string().required("Image URL is required"))
      .optional()
      .max(5, "Cannot upload more than 5 images")
      .test("valid-images", "All images must be valid", (images) => {
        if (!images || images.length === 0) return true;

        return images.every((image) => {
          // Check if it's a data URL (base64) or regular URL
          if (image.startsWith("data:image/")) {
            try {
              const base64Data = image.split(",")[1];
              if (!base64Data) return false;

              // Test if base64 is valid
              atob(base64Data);

              // Check approximate file size (base64 is ~33% larger than binary)
              const sizeInBytes = (base64Data.length * 3) / 4;
              const maxSize = 10 * 1024 * 1024; // 10MB

              return sizeInBytes <= maxSize;
            } catch {
              return false;
            }
          }

          // For regular URLs, just check basic format
          try {
            new URL(image);
            return true;
          } catch {
            return false;
          }
        });
      }),
  });

// Stock update schema for quick stock updates
export const stockUpdateSchema = yup.object({
  stock_quantity: yup
    .number()
    .required("Stock quantity is required")
    .min(0, "Stock quantity cannot be negative")
    .integer("Stock quantity must be a whole number")
    .max(999999, "Stock quantity is too high"),
});

// Product search/filter schema
export const productFiltersSchema = yup.object({
  search: yup.string().optional().max(255),
  category_id: yup.number().optional().positive(),
  is_featured: yup.boolean().optional(),
  is_active: yup.boolean().optional(),
  min_price: yup.number().optional().min(0),
  max_price: yup.number().optional().min(0),
  in_stock: yup.boolean().optional(),
  sort_by: yup
    .string()
    .optional()
    .oneOf(["name", "price", "stock_quantity", "created_at", "updated_at"]),
  sort_order: yup.string().optional().oneOf(["asc", "desc"]),
  page: yup.number().optional().min(1),
  limit: yup.number().optional().min(1).max(100),
});
