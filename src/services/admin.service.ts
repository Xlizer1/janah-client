import { api } from "@/lib/api-client";
import { authUtils } from "@/lib/api-client";
import type {
  User,
  AdminStats,
  UsersResponse,
  BulkUpdateResult,
  CategoryAnalytics,
  InventoryData,
} from "@/types";

export const adminService = {
  users: {
    getAllUsers: async (
      params: {
        page?: number;
        limit?: number;
        role?: "user" | "admin";
        is_active?: boolean;
        is_phone_verified?: boolean;
      } = {}
    ): Promise<UsersResponse> => {
      return api.get("/admin/users", params);
    },

    getPendingUsers: async (
      params: {
        page?: number;
        limit?: number;
      } = {}
    ): Promise<UsersResponse> => {
      return api.get("/admin/users/pending", params);
    },

    getUserById: async (userId: number): Promise<{ user: User }> => {
      return api.get(`/admin/users/${userId}`);
    },

    searchUsers: async (params: {
      query: string;
      type?: "phone" | "email" | "id";
    }): Promise<{ user: User | null }> => {
      return api.get("/admin/users/search", params);
    },

    activateUser: async (userId: number): Promise<{ user: User }> => {
      return api.post("/admin/users/activate", { user_id: userId });
    },

    deactivateUser: async (userId: number): Promise<{ user: User }> => {
      return api.post("/admin/users/deactivate", { user_id: userId });
    },

    bulkActivateUsers: async (
      userIds: number[]
    ): Promise<{
      activated: number[];
      failed: Array<{ user_id: number; reason: string }>;
      already_active: number[];
      not_found: number[];
    }> => {
      return api.post("/admin/users/bulk-activate", { user_ids: userIds });
    },
  },

  getStats: async (): Promise<{ stats: AdminStats }> => {
    return api.get("/admin/stats");
  },

  analytics: {
    getCategoryAnalytics: async (params?: {
      startDate?: string;
      endDate?: string;
    }): Promise<{ analytics: CategoryAnalytics[] }> => {
      return api.get("/analytics/categories", params);
    },

    getTopCategories: async (
      limit = 10
    ): Promise<{ categories: CategoryAnalytics[] }> => {
      return api.get("/analytics/top-categories", { limit });
    },

    getInventoryByCategory: async (): Promise<{
      inventory: InventoryData[];
    }> => {
      return api.get("/analytics/inventory");
    },

    getProductsNeedingAttention: async (): Promise<{
      products: Array<{
        id: number;
        name: string;
        slug: string;
        stock_quantity: number;
        category_id: number;
        category_name: string;
        issue_type: string;
      }>;
    }> => {
      return api.get("/analytics/products-needing-attention");
    },
  },

  bulk: {
    updateCategories: async (
      updates: Array<{
        product_id?: number;
        product_code?: string;
        category_id?: number | null;
        category_code?: string;
      }>
    ): Promise<BulkUpdateResult> => {
      return api.put("/bulk/categories", { updates });
    },

    updatePrices: async (params: {
      operation: "set" | "increase" | "decrease" | "percentage";
      updates: Array<{
        product_id?: number;
        product_code?: string;
        value: number;
      }>;
    }): Promise<{
      updated: Array<{
        product_id: number;
        old_price: number;
        new_price: number;
      }>;
      failed: Array<{ product_id: number; reason: string }>;
      not_found: number[];
    }> => {
      return api.put("/bulk/prices", params);
    },

    updateStatus: async (params: {
      product_ids?: number[];
      product_codes?: string[];
      is_active: boolean;
    }): Promise<BulkUpdateResult> => {
      return api.put("/bulk/status", params);
    },

    updateProductCodes: async (
      updates: Array<{
        product_id?: number;
        product_code?: string;
        new_code: string;
      }>
    ): Promise<{
      updated: Array<{
        product_id: number;
        old_code: string;
        new_code: string;
      }>;
      failed: Array<{ product_id: number; reason: string }>;
      not_found: number[];
    }> => {
      return api.put("/bulk/codes", { updates });
    },
  },

  import: {
    importProductsCSV: async (
      file: File,
      options?: {
        dry_run?: boolean;
        skip_errors?: boolean;
      }
    ): Promise<{
      total: number;
      successful: number;
      failed: number;
      errors: Array<{ row: number; data: any; error: string }>;
    }> => {
      const formData = new FormData();
      formData.append("file", file);
      if (options?.dry_run) formData.append("dry_run", "true");
      if (options?.skip_errors) formData.append("skip_errors", "true");

      return api.post("/import/products/csv", formData);
    },

    importCategoriesCSV: async (
      file: File,
      options?: {
        dry_run?: boolean;
        skip_errors?: boolean;
      }
    ): Promise<{
      total: number;
      successful: number;
      failed: number;
      errors: Array<{ row: number; data: any; error: string }>;
    }> => {
      const formData = new FormData();
      formData.append("file", file);
      if (options?.dry_run) formData.append("dry_run", "true");
      if (options?.skip_errors) formData.append("skip_errors", "true");

      return api.post("/import/categories/csv", formData);
    },

    exportProductsCSV: async (options?: {
      category_id?: number;
      is_active?: boolean;
    }): Promise<Blob> => {
      const token = authUtils.getToken();
      const params = new URLSearchParams();
      if (options?.category_id)
        params.append("category_id", options.category_id.toString());
      if (options?.is_active !== undefined)
        params.append("is_active", options.is_active.toString());

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/import/products/csv?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.blob();
    },

    exportCategoriesCSV: async (options?: {
      include_inactive?: boolean;
    }): Promise<Blob> => {
      const token = authUtils.getToken();
      const params = new URLSearchParams();
      if (options?.include_inactive !== undefined) {
        params.append("include_inactive", options.include_inactive.toString());
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/import/categories/csv?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.blob();
    },

    getProductTemplate: async (): Promise<Blob> => {
      const token = authUtils.getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/import/templates/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.blob();
    },

    getCategoryTemplate: async (): Promise<Blob> => {
      const token = authUtils.getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/import/templates/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.blob();
    },
  },
};

export default adminService;
