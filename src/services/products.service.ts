import { api, apiClient } from "@/lib/api-client";
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
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );
    return api.get("/products/search", cleanParams);
  },

  getCategories: async (): Promise<{ categories: Category[] }> => {
    return api.get("/products/categories");
  },

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

  getProduct: async (
    identifier: string | number
  ): Promise<{ product: Product }> => {
    return api.get(`/products/${identifier}`);
  },

  getProductByFullCode: async (
    fullCode: string
  ): Promise<{ product: Product }> => {
    return api.get(`/products/full-code/${fullCode}`);
  },

  admin: {
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

    createProduct: async (
      data: ProductCreateFormData
    ): Promise<{ product: Product }> => {
      const isImageFile = data.image_url?.startsWith("data:image/");

      if (isImageFile) {
        const formData = new FormData();

        const base64Data = data.image_url!.split(",")[1];
        const mimeType = data.image_url!.split(";")[0].split(":")[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const file = new File(
          [blob],
          `product-image.${mimeType.split("/")[1]}`,
          { type: mimeType }
        );

        Object.entries(data).forEach(([key, value]) => {
          if (key !== "image_url" && value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        formData.append("image", file);

        const response = await apiClient.post("/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data.data;
      } else {
        return api.post("/products", data);
      }
    },

    updateProduct: async (
      id: number,
      data: ProductEditFormData
    ): Promise<{ product: Product }> => {
      const isImageFile = data.image_url?.startsWith("data:image/");

      if (isImageFile) {
        const formData = new FormData();

        const base64Data = data.image_url!.split(",")[1];
        const mimeType = data.image_url!.split(";")[0].split(":")[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const file = new File(
          [blob],
          `product-image.${mimeType.split("/")[1]}`,
          { type: mimeType }
        );

        Object.entries(data).forEach(([key, value]) => {
          if (key !== "image_url" && value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        formData.append("image", file);

        const response = await apiClient.put(`/products/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data.data;
      } else {
        return api.put(`/products/${id}`, data);
      }
    },

    uploadProductImage: async (
      productId: number,
      file: File
    ): Promise<{ product: Product; image_url: string }> => {
      const formData = new FormData();
      formData.append("image", file);

      const response = await apiClient.post(
        `/products/${productId}/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.data;
    },

    removeProductImage: async (
      productId: number
    ): Promise<{ product: Product }> => {
      return api.delete(`/products/${productId}/image`);
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
