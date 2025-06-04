import { api } from '@/lib/api-client';
import type {
  AuthResponse,
  User,
  LoginFormData,
  RegisterFormData,
  VerifyPhoneFormData,
  ResetPasswordFormData,
  ChangePasswordFormData,
  ProfileUpdateFormData,
} from '@/types';

export const authService = {
  register: async (data: RegisterFormData): Promise<{ user: User; next_step: string }> => {
    return api.post('/auth/register', data);
  },

  verifyPhone: async (data: VerifyPhoneFormData): Promise<{ user: User; next_step: string }> => {
    return api.post('/auth/verify-phone', data);
  },

  resendCode: async (data: { phone_number: string; type?: 'registration' | 'password_reset' }): Promise<{ attempts_left: number }> => {
    return api.post('/auth/resend-code', data);
  },

  login: async (data: LoginFormData): Promise<AuthResponse> => {
    return api.post('/auth/login', data);
  },

  logout: async (): Promise<void> => {
    return api.post('/auth/logout');
  },

  forgotPassword: async (data: { phone_number: string }): Promise<void> => {
    return api.post('/auth/forgot-password', data);
  },

  resetPassword: async (data: ResetPasswordFormData): Promise<void> => {
    return api.post('/auth/reset-password', data);
  },

  changePassword: async (data: ChangePasswordFormData): Promise<void> => {
    return api.post('/auth/change-password', data);
  },

  getProfile: async (): Promise<{ user: User }> => {
    return api.get('/auth/profile');
  },

  updateProfile: async (data: ProfileUpdateFormData): Promise<{ user: User }> => {
    return api.put('/auth/profile', data);
  },
};

export default authService;