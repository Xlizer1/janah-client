export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  pagination: PaginationMeta;
}

export interface ProductsResponse extends PaginatedResponse<Product> {
  products: Product[];
}

export interface CategoriesResponse extends PaginatedResponse<Category> {
  categories: Category[];
}

export interface UsersResponse extends PaginatedResponse<User> {
  users: User[];
}

export interface User {
  id: number;
  phone_number: string;
  first_name: string;
  last_name: string;
  email?: string;
  is_phone_verified: boolean;
  is_active: boolean;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
  activated_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
}

export interface Product {
  id: number;
  name: string;
  code: string; // Fixed: Added missing code field
  slug: string;
  description?: string;
  price: number;
  stock_quantity: number;
  category_id?: number;
  category_name?: string;
  category_slug?: string;
  weight?: number;
  dimensions?: string;
  is_active: boolean;
  is_featured: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCreateData {
  name: string;
  code: string; // Fixed: Added missing code field
  slug?: string;
  description?: string;
  price: number;
  stock_quantity?: number;
  category_id?: number;
  weight?: number;
  dimensions?: string;
  is_featured?: boolean;
  image_url?: string;
}

export interface ProductUpdateData extends Partial<ProductCreateData> {
  code?: string; // FIXED: Added code field
  is_active?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export interface CategoryCreateData {
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
  sort_order?: number;
}

export interface CategoryOption {
  id: number;
  name: string;
}

export interface SearchSuggestion {
  suggestion: string;
  type: "product" | "category";
  slug: string;
}

export interface GlobalSearchResult {
  query: string;
  products: {
    items: Product[];
    total: number;
  };
  categories: {
    items: Category[];
    total: number;
  };
  total_results: number;
}

export interface FilterOptions {
  price_range: {
    min_price: number;
    max_price: number;
    avg_price: number;
  };
  categories: Array<Category & { product_count: number }>;
  features: {
    featured_count: number;
    total_count: number;
  };
  sort_options: Array<{
    value: string;
    label: string;
  }>;
}

export interface AdminStats {
  total_users: number;
  active_users: number;
  pending_activation: number;
  unverified_phone: number;
  activation_rate: string;
}

export interface BulkUpdateResult {
  updated: number[];
  failed: Array<{
    product_id: number;
    reason: string;
  }>;
  not_found: number[];
}

export interface CategoryAnalytics {
  id: number;
  category_name: string;
  slug: string;
  total_products: number;
  active_products: number;
  featured_products: number;
  avg_price: number;
  min_price: number;
  max_price: number;
  total_stock: number;
  avg_stock: number;
}

export interface InventoryData {
  category_name: string;
  total_products: number;
  in_stock: number;
  out_of_stock: number;
  low_stock: number;
  total_inventory: number;
  avg_stock_per_product: number;
}

export interface LoginFormData {
  phone_number: string;
  password: string;
}

export interface RegisterFormData {
  phone_number: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  email?: string;
}

export interface VerifyPhoneFormData {
  phone_number: string;
  verification_code: string;
}

export interface ResetPasswordFormData {
  phone_number: string;
  verification_code: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ProfileUpdateFormData {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
  is_featured?: boolean;
  sort_by?: "name" | "price" | "created_at" | "stock_quantity";
  sort_order?: "ASC" | "DESC";
  is_active?: boolean;
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  include_inactive?: boolean;
}

export interface ApiError {
  status: boolean;
  message: string;
  errors?: any;
}

export interface LoadingStates {
  [key: string]: boolean;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface ForgotPasswordFormData {
  phone_number: string;
}

export interface ResendCodeFormData {
  phone_number: string;
  type?: "registration" | "password_reset";
}

export interface CategoryFormData {
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
  sort_order?: number;
  is_active: boolean;
}

export interface CategoryCreateFormData {
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
  sort_order?: number;
}

export interface ProductEditFormData {
  product_id: number; // Keep for form identification, but don't send to API
  name: string;
  code: string; // FIXED: Added missing code field
  slug?: string;
  description?: string;
  price: number;
  stock_quantity: number;
  category_id?: number;
  weight?: number;
  dimensions?: string;
  is_featured?: boolean;
  is_active: boolean; // Required for edit forms
  image_url?: string;
}

// Fixed: Made ProductCreateFormData consistent with ProductCreateData
export interface ProductCreateFormData {
  name: string;
  code: string; // Fixed: Added missing code field
  slug?: string;
  description?: string;
  price: number;
  stock_quantity: number;
  category_id?: number;
  weight?: number;
  dimensions?: string;
  is_featured?: boolean;
  image_url?: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready_to_ship"
    | "shipped"
    | "delivered"
    | "cancelled";
  total_amount: number;
  delivery_address: string;
  delivery_notes?: string;
  items?: OrderItem[];
  items_count?: number;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_slug?: string;
  product_image_url?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderCreateData {
  delivery_address: string;
  delivery_notes?: string;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  user_id?: number;
  start_date?: string;
  end_date?: string;
  search?: string;
}

export interface OrdersResponse extends PaginatedResponse<Order> {
  orders: Order[];
}

export interface CheckoutFormData {
  delivery_address: string;
  delivery_notes?: string;
  payment_method?: string;
}
