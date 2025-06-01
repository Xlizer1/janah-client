import { api } from "@/lib/api-client";
import type {
  Product,
  ProductCreateData,
  ProductUpdateData,
  ProductFilters,
  ProductsResponse,
  Category,
} from "@/types";

export const productsService = {
  // Get all products with filters
  getProducts: async (
    filters: ProductFilters = {}
  ): Promise<ProductsResponse> => {
    return api.get("/products", filters);
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
    return api.get("/products/search", params);
  },

  // Get products by category
  getProductsByCategory: async (
    identifier: string | number,
    filters: ProductFilters = {}
  ): Promise<
    ProductsResponse & {
      category: { id: number; name: string; slug: string };
    }
  > => {
    return api.get(`/products/category/${identifier}`, filters);
  },

  // Get single product by ID or slug
  getProduct: async (
    identifier: string | number
  ): Promise<{ product: Product }> => {
    return api.get(`/products/${identifier}`);
  },

  // Get product categories
  getCategories: async (): Promise<{ categories: Category[] }> => {
    return api.get("/products/categories");
  },

  // Admin methods
  admin: {
    // Get all products (admin view)
    getAllProducts: async (
      filters: ProductFilters = {}
    ): Promise<ProductsResponse> => {
      return api.get("/products/admin/all", filters);
    },

    // Create product
    createProduct: async (
      data: ProductCreateData
    ): Promise<{ product: Product }> => {
      return api.post("/products", data);
    },

    // Update product
    updateProduct: async (
      id: number,
      data: ProductUpdateData
    ): Promise<{ product: Product }> => {
      return api.put(`/products/${id}`, data);
    },

    // Update product stock
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