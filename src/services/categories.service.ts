import { api } from "@/lib/api-client";
import type {
  Category,
  CategoryCreateData,
  CategoryOption,
  CategoryFilters,
  CategoriesResponse,
  CategoryFormData,
} from "@/types";

export const categoriesService = {
  getCategories: async (
    filters: CategoryFilters = {}
  ): Promise<CategoriesResponse> => {
    return api.get("/categories", filters);
  },

  getCategoriesWithCounts: async (
    include_empty = false
  ): Promise<{ categories: Category[] }> => {
    return api.get("/categories/with-counts", { include_empty });
  },

  getCategoryOptions: async (): Promise<{ categories: CategoryOption[] }> => {
    return api.get("/categories/options");
  },

  searchCategories: async (q: string): Promise<{ categories: Category[] }> => {
    return api.get("/categories/search", { q });
  },

  getCategory: async (
    identifier: string | number
  ): Promise<{ category: Category }> => {
    return api.get(`/categories/${identifier}`);
  },

  getCategoryByCode: async (code: string): Promise<{ category: Category }> => {
    return api.get(`/categories/code/${code}`);
  },

  admin: {
    createCategory: async (
      data: CategoryCreateData
    ): Promise<{ category: Category }> => {
      return api.post("/categories", data);
    },

    updateCategory: async (
      id: number,
      data: Partial<CategoryCreateData> & { is_active?: boolean }
    ): Promise<{ category: CategoryFormData }> => {
      return api.put(`/categories/${id}`, data);
    },

    deleteCategory: async (id: number): Promise<void> => {
      return api.delete(`/categories/${id}`);
    },

    updateSortOrders: async (
      categories: Array<{ id: number; sort_order: number }>
    ): Promise<{
      updated: Array<{ id: number; old_order: number; new_order: number }>;
      failed: Array<{ id: number; reason: string }>;
    }> => {
      return api.put("/categories/sort-orders/update", { categories });
    },
  },
};

export default categoriesService;
