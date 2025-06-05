import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  productCreateSchema,
  productEditSchema,
} from "@/schemas/product.schemas";
import type { ProductCreateFormData, ProductEditFormData } from "@/types";

// Create Product Form Hook
export const useProductCreateForm = (
  defaultValues?: Partial<ProductCreateFormData>
) => {
  return useForm<ProductCreateFormData>({
    resolver: yupResolver(productCreateSchema),
    defaultValues: {
      name: "",
      code: "",
      slug: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      category_id: 0,
      weight: 1,
      dimensions: "1x1x1",
      is_featured: false,
      images: [], // Fixed: Ensure this is string[], not (string | undefined)[]
      ...defaultValues,
    },
    mode: "onChange",
  });
};

// Edit Product Form Hook
export const useProductEditForm = (
  defaultValues?: Partial<ProductEditFormData>
) => {
  return useForm<ProductEditFormData>({
    resolver: yupResolver(productEditSchema),
    defaultValues: {
      product_id: 0,
      name: "",
      code: "",
      slug: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      category_id: 0,
      weight: 1,
      dimensions: "1x1x1",
      is_featured: false,
      is_active: true,
      images: [], // Fixed: Ensure this is string[], not (string | undefined)[]
      ...defaultValues,
    },
    mode: "onChange",
  });
};

// Type-safe submit handler types
export type ProductCreateSubmitHandler = SubmitHandler<ProductCreateFormData>;
export type ProductEditSubmitHandler = SubmitHandler<ProductEditFormData>;

// Utility function to prepare form data for submission
export const prepareProductFormData = (
  data: ProductCreateFormData | ProductEditFormData
): ProductCreateFormData | Omit<ProductEditFormData, "product_id"> => {
  // Remove product_id from edit form data when submitting to API
  if ("product_id" in data) {
    const { product_id, ...submitData } = data;
    return submitData;
  }
  return data;
};

// Validation helper to ensure images array is properly typed
export const validateImageArray = (
  images?: (string | undefined)[]
): string[] => {
  if (!images) return [];
  return images.filter(
    (img): img is string => typeof img === "string" && img.length > 0
  );
};

// Helper to generate slug from name
export const generateSlugFromName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};
