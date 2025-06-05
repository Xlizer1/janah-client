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
      images: [],
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
      images: [],
      ...defaultValues,
    },
    mode: "onChange",
  });
};

// Type-safe submit handler types
export type ProductCreateSubmitHandler = SubmitHandler<ProductCreateFormData>;
export type ProductEditSubmitHandler = SubmitHandler<ProductEditFormData>;

// Example usage in components:
/*
// In create component:
const form = useProductCreateForm();
const onSubmit: ProductCreateSubmitHandler = async (data) => {
  await productsService.admin.createProduct(data);
};

// In edit component:
const form = useProductEditForm();
const onSubmit: ProductEditSubmitHandler = async (data) => {
  await productsService.admin.updateProduct(data.product_id, data);
};
*/
