import { api, apiClient } from "@/lib/api-client";
import { toast } from "react-toastify";
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

// Helper function to validate base64 image
const validateBase64Image = (
  dataUrl: string
): { isValid: boolean; error?: string } => {
  try {
    if (!dataUrl || typeof dataUrl !== "string") {
      return { isValid: false, error: "Invalid image data" };
    }

    if (!dataUrl.startsWith("data:image/")) {
      return { isValid: false, error: "Not a valid image data URL" };
    }

    const parts = dataUrl.split(",");
    if (parts.length !== 2) {
      return { isValid: false, error: "Invalid base64 format" };
    }

    const header = parts[0];
    const base64Data = parts[1];

    if (!header.includes("base64")) {
      return { isValid: false, error: "Not base64 encoded" };
    }

    // Test if base64 is valid
    try {
      const decoded = atob(base64Data);
      if (decoded.length === 0) {
        return { isValid: false, error: "Empty image data" };
      }
    } catch (e) {
      return { isValid: false, error: "Invalid base64 encoding" };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: "Image validation failed" };
  }
};

// Helper function to convert base64 to File with proper error handling
const base64ToFile = (
  dataUrl: string,
  fileName: string = "product-image"
): File => {
  try {
    const validation = validateBase64Image(dataUrl);
    if (!validation.isValid) {
      throw new Error(validation.error || "Invalid image");
    }

    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];

    if (!mime) {
      throw new Error("Could not determine image type");
    }

    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    // Determine file extension from MIME type
    const extension = mime.split("/")[1] || "jpg";
    const fullFileName = `${fileName}.${extension}`;

    const file = new File([u8arr], fullFileName, { type: mime });

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("Image size too large (max 10MB)");
    }

    return file;
  } catch (error) {
    console.error("Base64 to File conversion error:", error);
    throw new Error(
      `Image processing failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Helper function to prepare FormData with proper type handling
const prepareFormData = (
  data: ProductCreateFormData | ProductEditFormData
): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key !== "image_url" && value !== undefined && value !== null) {
      // Handle different data types properly for FormData
      if (typeof value === "number") {
        formData.append(key, value.toString());
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "true" : "false");
      } else {
        formData.append(key, String(value));
      }
    }
  });

  return formData;
};

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
      try {
        console.log("Creating product with data:", data);

        // Validate required fields
        if (!data.name || !data.code) {
          throw new Error("Product name and code are required");
        }

        if (!data.price || data.price <= 0) {
          throw new Error("Valid price is required");
        }

        if (data.stock_quantity === undefined || data.stock_quantity < 0) {
          throw new Error("Valid stock quantity is required");
        }

        const isImageFile =
          data.image_url && data.image_url.startsWith("data:image/");

        if (isImageFile) {
          console.log("Processing image upload...");

          try {
            const formData = prepareFormData(data);
            const file = base64ToFile(data.image_url!, "product-image");

            console.log("Image file created:", {
              name: file.name,
              size: file.size,
              type: file.type,
            });

            formData.append("image", file);

            const response = await apiClient.post("/products", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              timeout: 60000, // 60 second timeout for image upload
            });

            console.log("Product created successfully with image");
            return response.data.data;
          } catch (imageError) {
            console.error("Image processing error:", imageError);

            if (imageError instanceof Error) {
              throw new Error(`Image upload failed: ${imageError.message}`);
            }
            throw new Error("Image upload failed: Unknown error");
          }
        } else {
          console.log("Creating product without image...");

          // Remove image_url if it's empty or invalid
          const { image_url, ...productData } = data;

          const response = await api.post("/products", productData);
          console.log("Product created successfully without image");
          return response;
        }
      } catch (error) {
        console.error("Product creation failed:", error);

        // Handle different types of errors
        if (error instanceof Error) {
          throw error;
        }

        // Handle axios errors
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as any;
          const message =
            axiosError.response?.data?.message || "Failed to create product";
          throw new Error(message);
        }

        throw new Error("Failed to create product: Unknown error");
      }
    },

    updateProduct: async (
      id: number,
      data: ProductEditFormData
    ): Promise<{ product: Product }> => {
      try {
        console.log("Updating product with data:", data);

        // Validate required fields
        if (!data.name) {
          throw new Error("Product name is required");
        }

        if (!data.code) {
          throw new Error("Product code is required");
        }

        if (!data.price || data.price <= 0) {
          throw new Error("Valid price is required");
        }

        if (data.stock_quantity === undefined || data.stock_quantity < 0) {
          throw new Error("Valid stock quantity is required");
        }

        const isImageFile =
          data.image_url && data.image_url.startsWith("data:image/");

        // FIXED: Remove product_id from the data sent to API
        const { product_id, ...updateData } = data;

        if (isImageFile) {
          console.log("Processing image update...");

          try {
            const formData = new FormData();

            // FIXED: Properly handle the update data without product_id
            Object.entries(updateData).forEach(([key, value]) => {
              if (
                key !== "image_url" &&
                value !== undefined &&
                value !== null
              ) {
                // Handle different data types properly for FormData
                if (typeof value === "number") {
                  formData.append(key, value.toString());
                } else if (typeof value === "boolean") {
                  formData.append(key, value ? "true" : "false");
                } else {
                  formData.append(key, String(value));
                }
              }
            });

            const file = base64ToFile(data.image_url!, "product-image");

            console.log("Image file created for update:", {
              name: file.name,
              size: file.size,
              type: file.type,
            });

            formData.append("image", file);

            const response = await apiClient.put(`/products/${id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              timeout: 60000, // 60 second timeout for image upload
            });

            console.log("Product updated successfully with image");
            return response.data.data;
          } catch (imageError) {
            console.error("Image processing error during update:", imageError);

            if (imageError instanceof Error) {
              throw new Error(`Image update failed: ${imageError.message}`);
            }
            throw new Error("Image update failed: Unknown error");
          }
        } else {
          console.log("Updating product without image changes...");

          // FIXED: Send updateData (without product_id) instead of full data
          const response = await api.put(`/products/${id}`, updateData);
          console.log("Product updated successfully without image");
          return response;
        }
      } catch (error) {
        console.error("Product update failed:", error);

        // Handle different types of errors
        if (error instanceof Error) {
          throw error;
        }

        // Handle axios errors
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as any;
          const message =
            axiosError.response?.data?.message || "Failed to update product";
          throw new Error(message);
        }

        throw new Error("Failed to update product: Unknown error");
      }
    },

    uploadProductImage: async (
      productId: number,
      file: File
    ): Promise<{ product: Product; image_url: string }> => {
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await apiClient.post(
          `/products/${productId}/image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            timeout: 60000,
          }
        );

        return response.data.data;
      } catch (error) {
        console.error("Image upload failed:", error);
        throw new Error("Failed to upload image");
      }
    },

    removeProductImage: async (
      productId: number
    ): Promise<{ product: Product }> => {
      try {
        return api.delete(`/products/${productId}/image`);
      } catch (error) {
        console.error("Image removal failed:", error);
        throw new Error("Failed to remove image");
      }
    },

    updateStock: async (
      id: number,
      stock_quantity: number
    ): Promise<{
      product: Product;
      old_stock: number;
      new_stock: number;
    }> => {
      try {
        if (stock_quantity < 0) {
          throw new Error("Stock quantity cannot be negative");
        }

        return api.patch(`/products/${id}/stock`, { stock_quantity });
      } catch (error) {
        console.error("Stock update failed:", error);
        throw new Error("Failed to update stock");
      }
    },

    deleteProduct: async (id: number): Promise<void> => {
      try {
        return api.delete(`/products/${id}`);
      } catch (error) {
        console.error("Product deletion failed:", error);
        throw new Error("Failed to delete product");
      }
    },
  },
};

export default productsService;
