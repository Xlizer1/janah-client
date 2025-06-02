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
  // Get products by category - FIXED VERSION
  getProductsByCategory: async (
    identifier: string | number,
    filters: ProductFilters = {}
  ): Promise<
    ProductsResponse & {
      category: { id: number; name: string; slug: string };
    }
  > => {
    try {
      // Clean up the filters - remove undefined values that might cause 400 errors
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
      );

      console.log('API Request:', {
        endpoint: `/products/category/${identifier}`,
        filters: cleanFilters
      });

      return api.get(`/products/category/${identifier}`, cleanFilters);
    } catch (error) {
      console.error('Error fetching products by category:', {
        identifier,
        filters,
        error
      });
      throw error;
    }
  },

  // Rest of your existing methods...
  getProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
    );
    return api.get("/products", cleanFilters);
  },

  getFeaturedProducts: async (
    limit = 10
  ): Promise<{ products: Product[]; total: number }> => {
    return api.get("/products/featured", { limit });
  },

  searchProducts: async (params: {
    q: string;
    sort_by?: string;
    sort_order?: string;
    limit?: number;
    category_id?: number;
  }): Promise<ProductsResponse> => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
    );
    return api.get("/products/search", cleanParams);
  },

  getProduct: async (
    identifier: string | number
  ): Promise<{ product: Product }> => {
    return api.get(`/products/${identifier}`);
  },

  getCategories: async (): Promise<{ categories: Category[] }> => {
    return api.get("/products/categories");
  },

  admin: {
    getAllProducts: async (
      filters: ProductFilters = {}
    ): Promise<ProductsResponse> => {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
      );
      return api.get("/products/admin/all", cleanFilters);
    },

    createProduct: async (
      data: ProductCreateData
    ): Promise<{ product: Product }> => {
      return api.post("/products", data);
    },

    updateProduct: async (
      id: number,
      data: ProductUpdateData
    ): Promise<{ product: Product }> => {
      return api.put(`/products/${id}`, data);
    },

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

    deleteProduct: async (id: number): Promise<void> => {
      return api.delete(`/products/${id}`);
    },
  },
};

export default productsService;