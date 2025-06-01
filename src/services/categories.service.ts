import { api } from "@/lib/api-client";
import type {
  Category,
  CategoryCreateData,
  CategoryOption,
  CategoryFilters,
  PaginatedResponse,
} from "@/types";

export const categoriesService = {
  // Get all categories
  getCategories: async (
    filters: CategoryFilters = {}
  ): Promise<PaginatedResponse<Category>> => {
    return api.get("/categories", filters);
  },

  // Get categories with product counts
  getCategoriesWithCounts: async (
    include_empty = false
  ): Promise<{ categories: Category[] }> => {
    return api.get("/categories/with-counts", { include_empty });
  },

  // Get category options for dropdowns
  getCategoryOptions: async (): Promise<{ categories: CategoryOption[] }> => {
    return api.get("/categories/options");
  },

  // Search categories
  searchCategories: async (q: string): Promise<{ categories: Category[] }> => {
    return api.get("/categories/search", { q });
  },

  // Get single category by ID or slug
  getCategory: async (
    identifier: string | number
  ): Promise<{ category: Category }> => {
    return api.get(`/categories/${identifier}`);
  },

  // Admin methods
  admin: {
    // Create category
    createCategory: async (
      data: CategoryCreateData
    ): Promise<{ category: Category }> => {
      return api.post("/categories", data);
    },

    // Update category
    updateCategory: async (
      id: number,
      data: Partial<CategoryCreateData> & { is_active?: boolean }
    ): Promise<{ category: Category }> => {
      return api.put(`/categories/${id}`, data);
    },

    // Delete category
    deleteCategory: async (id: number): Promise<void> => {
      return api.delete(`/categories/${id}`);
    },

    // Update sort orders
    updateSortOrders: async (
      categories: Array<{ id: number; sort_order: number }>
    ): Promise<void> => {
      return api.put("/categories/sort-orders/update", { categories });
    },
  },
};

export default categoriesService;
