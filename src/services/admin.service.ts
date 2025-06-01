import { api } from "@/lib/api-client";
import type {
  User,
  AdminStats,
  UsersResponse,
  BulkUpdateResult,
  CategoryAnalytics,
  InventoryData,
} from "@/types";

export const adminService = {
  // User management
  users: {
    // Get all users
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

    // Get pending users
    getPendingUsers: async (
      params: {
        page?: number;
        limit?: number;
      } = {}
    ): Promise<UsersResponse> => {
      return api.get("/admin/users/pending", params);
    },

    // Get user by ID
    getUserById: async (userId: number): Promise<{ user: User }> => {
      return api.get(`/admin/users/${userId}`);
    },

    // Activate user
    activateUser: async (userId: number): Promise<{ user: User }> => {
      return api.post("/admin/users/activate", { user_id: userId });
    },

    // Deactivate user
    deactivateUser: async (userId: number): Promise<{ user: User }> => {
      return api.post("/admin/users/deactivate", { user_id: userId });
    },

    // Bulk activate users
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

    // Search users
    searchUsers: async (params: {
      query: string;
      type?: "phone" | "email" | "id";
    }): Promise<{ user: User | null }> => {
      return api.get("/admin/users/search", params);
    },
  },

  // Statistics
  getStats: async (): Promise<{ stats: AdminStats }> => {
    return api.get("/admin/stats");
  },

  // Analytics
  analytics: {
    // Get category analytics
    getCategoryAnalytics: async (params?: {
      startDate?: string;
      endDate?: string;
    }): Promise<{ analytics: CategoryAnalytics[] }> => {
      return api.get("/analytics/categories", params);
    },

    // Get top categories
    getTopCategories: async (
      limit = 10
    ): Promise<{ categories: CategoryAnalytics[] }> => {
      return api.get("/analytics/top-categories", { limit });
    },

    // Get inventory by category
    getInventoryByCategory: async (): Promise<{
      inventory: InventoryData[];
    }> => {
      return api.get("/analytics/inventory");
    },

    // Get products needing attention
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

  // Bulk operations
  bulk: {
    // Bulk update categories
    updateCategories: async (
      updates: Array<{
        product_id: number;
        category_id: number | null;
      }>
    ): Promise<BulkUpdateResult> => {
      return api.put("/bulk/categories", { updates });
    },

    // Bulk update prices
    updatePrices: async (params: {
      operation: "set" | "increase" | "decrease" | "percentage";
      updates: Array<{ product_id: number; value: number }>;
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

    // Bulk update status
    updateStatus: async (params: {
      product_ids: number[];
      is_active: boolean;
    }): Promise<BulkUpdateResult> => {
      return api.put("/bulk/status", params);
    },
  },

  // Import/Export
  import: {
    // Import products from CSV
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

    // Export products to CSV
    exportProductsCSV: async (options?: {
      category_id?: number;
      is_active?: boolean;
    }): Promise<Blob> => {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/import/products/csv?${new URLSearchParams(options as any)}`,
        {
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("auth_token=")[1]?.split(";")[0]
            }`,
          },
        }
      );
      return response.blob();
    },
  },
};

export default adminService;