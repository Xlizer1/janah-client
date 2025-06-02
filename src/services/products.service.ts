// src/services/products.service.ts - Complete implementation
import { api } from "@/lib/api-client";
import type {
  Product,
  ProductCreateData,
  ProductUpdateData,
  ProductFilters,
  ProductsResponse,
  Category,
  ProductCreateFormData,
  ProductEditFormData,
} from "@/types";

export const productsService = {
  // Get all products
  getProducts: async (
    filters: ProductFilters = {}
  ): Promise<ProductsResponse> => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );
    return api.get("/products", cleanFilters);
  },

  // Get featured products
  getFeaturedProducts: async (
    limit = 10
  ): Promise<{ products: Product[]; total: number }> => {
    return api.get("/products/featured", { limit });
  },

  // Search products
  searchProducts: async (params: {
    q: string;
    sort_by?: string;
    sort_order?: string;
    limit?: number;
    category_id?: number;
  }): Promise<ProductsResponse> => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );
    return api.get("/products/search", cleanParams);
  },

  // Get product categories
  getCategories: async (): Promise<{ categories: Category[] }> => {
    return api.get("/products/categories");
  },

  // Get products by category (ID or slug)
  getProductsByCategory: async (
    identifier: string | number,
    filters: ProductFilters = {}
  ): Promise<
    ProductsResponse & {
      category: { id: number; name: string; slug: string };
    }
  > => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );
    return api.get(`/products/category/${identifier}`, cleanFilters);
  },

  // 🆕 Get products by category code
  getProductsByCategoryCode: async (
    categoryCode: string,
    filters: ProductFilters = {}
  ): Promise<ProductsResponse> => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );
    return api.get(`/products/category-code/${categoryCode}`, cleanFilters);
  },

  // Get single product by ID or slug
  getProduct: async (
    identifier: string | number
  ): Promise<{ product: Product }> => {
    return api.get(`/products/${identifier}`);
  },

  // 🆕 Get product by full code
  getProductByFullCode: async (
    fullCode: string
  ): Promise<{ product: Product }> => {
    return api.get(`/products/full-code/${fullCode}`);
  },

  // Admin methods
  admin: {
    // Get all products (admin view)
    getAllProducts: async (
      filters: ProductFilters = {}
    ): Promise<ProductsResponse> => {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      );
      return api.get("/products/admin/all", cleanFilters);
    },

    // Create product
    createProduct: async (
      data: ProductCreateFormData
    ): Promise<{ product: Product }> => {
      return api.post("/products", data);
    },

    // Update product
    updateProduct: async (
      id: number,
      data: ProductEditFormData
    ): Promise<{ product: Product }> => {
      return api.put(`/products/${id}`, data);
    },

    // Update stock
    updateStock: async (
      id: number,
      stock_quantity: number
    ): Promise<{
      product: Product;
      old_stock: number;
      new_stock: number;
    }> => {
      return api.patch(`/products/${id}/stock`, { stock_quantity });
    },

    // Delete product
    deleteProduct: async (id: number): Promise<void> => {
      return api.delete(`/products/${id}`);
    },
  },
};

export default productsService;
