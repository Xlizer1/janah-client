import { api } from "@/lib/api-client";
import type {
  AuthResponse,
  User,
  LoginFormData,
  RegisterFormData,
  VerifyPhoneFormData,
  ResetPasswordFormData,
  ChangePasswordFormData,
  ProfileUpdateFormData,
} from "@/types";

// Interface for activation code flow
export interface ActivateAccountFormData {
  phone_number: string;
  activation_code: string;
}

export const authService = {
  // Updated register - no phone verification required
  register: async (
    data: RegisterFormData
  ): Promise<{
    user: User;
    message: string;
    next_step: "activation" | "login";
  }> => {
    return api.post("/auth/register", data);
  },

  // Updated activation endpoint - matches server expectation
  activateAccount: async (
    data: ActivateAccountFormData
  ): Promise<{
    user: User;
    message: string;
    next_step: string;
  }> => {
    return api.post("/auth/activate", data);
  },

  // Updated login - returns user even if not activated
  login: async (
    data: LoginFormData
  ): Promise<
    AuthResponse & {
      requires_activation?: boolean;
    }
  > => {
    return api.post("/auth/login", data);
  },

  // Keep existing phone verification for other flows (optional)
  verifyPhone: async (
    data: VerifyPhoneFormData
  ): Promise<{ user: User; next_step: string }> => {
    return api.post("/auth/verify-phone", data);
  },

  resendCode: async (data: {
    phone_number: string;
    type?: "registration" | "password_reset";
  }): Promise<{ attempts_left: number }> => {
    return api.post("/auth/resend-code", data);
  },

  logout: async (): Promise<void> => {
    return api.post("/auth/logout");
  },

  forgotPassword: async (data: { phone_number: string }): Promise<void> => {
    return api.post("/auth/forgot-password", data);
  },

  resetPassword: async (data: ResetPasswordFormData): Promise<void> => {
    return api.post("/auth/reset-password", data);
  },

  changePassword: async (data: ChangePasswordFormData): Promise<void> => {
    return api.post("/auth/change-password", data);
  },

  getProfile: async (): Promise<{ user: User }> => {
    return api.get("/auth/profile");
  },

  updateProfile: async (
    data: ProfileUpdateFormData
  ): Promise<{ user: User }> => {
    return api.put("/auth/profile", data);
  },

  // Admin methods for activation code management
  admin: {
    bulkGenerateActivationCode: async (data: {
      quantity: number;
      format?: "JANAH" | "PREMIUM" | "TRIAL" | "CUSTOM";
      expires_in_days?: number;
      notes?: string;
      prefix?: string;
    }): Promise<{
      activation_code: {
        id: number;
        code: string;
        created_by: number;
        expires_at: string;
        notes?: string;
        is_active: boolean;
        used_by?: number;
        used_at?: string;
        created_at: string;
      };
    }> => {
      return api.post("/admin/activation-codes/generate-bulk", {
        ...data,
        prefix: "EVENT",
      });
    },

    generateActivationCode: async (data: {
      format?: "JANAH" | "PREMIUM" | "TRIAL" | "CUSTOM";
      expires_in_days?: number;
      notes?: string;
      custom_code?: string;
    }): Promise<{
      activation_code: {
        id: number;
        code: string;
        created_by: number;
        expires_at: string;
        notes?: string;
        is_active: boolean;
        used_by?: number;
        used_at?: string;
        created_at: string;
      };
    }> => {
      return api.post("/admin/activation-codes/generate", {
        ...data,
        custom_code:
          data.custom_code?.length === 0 ? undefined : data.custom_code,
      });
    },

    getAllActivationCodes: async (params?: {
      page?: number;
      limit?: number;
      status?: "used" | "unused" | "expired";
      created_by?: number;
    }): Promise<{
      codes: Array<{
        id: number;
        code: string;
        created_by: number;
        expires_at: string;
        notes?: string;
        is_active: boolean;
        used_by?: number;
        used_at?: string;
        created_at: string;
        creator_name?: string;
        user_name?: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }> => {
      return api.get("/admin/activation-codes", params);
    },

    getActivationCodeDetails: async (
      code: string
    ): Promise<{
      activation_code: {
        id: number;
        code: string;
        created_by: number;
        expires_at: string;
        notes?: string;
        is_active: boolean;
        used_by?: number;
        used_at?: string;
        created_at: string;
        creator_name?: string;
        user_name?: string;
      };
    }> => {
      return api.get(`/admin/activation-codes/${code}`);
    },

    deactivateActivationCode: async (
      code: string
    ): Promise<{
      activation_code: {
        id: number;
        code: string;
        is_active: boolean;
      };
    }> => {
      return api.put(`/admin/activation-codes/${code}/deactivate`);
    },

    getActivationCodeStats: async (): Promise<{
      statistics: {
        total_codes: number;
        used_codes: number;
        available_codes: number;
        expired_codes: number;
        disabled_codes: number;
      };
    }> => {
      return api.get("/admin/activation-codes/stats");
    },
  },
};

export default authService;
