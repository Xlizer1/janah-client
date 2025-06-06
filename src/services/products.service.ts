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

// Helper function to process multiple images
const processMultipleImages = (
  images: string[],
  baseFileName: string = "product-image"
): File[] => {
  try {
    if (images.length === 0) {
      return [];
    }

    if (images.length > 5) {
      throw new Error("Cannot upload more than 5 images");
    }

    return images.map((imageData, index) => {
      return base64ToFile(imageData, `${baseFileName}-${index + 1}`);
    });
  } catch (error) {
    console.error("Multiple images processing error:", error);
    throw error;
  }
};

// Helper function to prepare FormData with proper type handling
const prepareFormData = (
  data: ProductCreateFormData | ProductEditFormData
): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key !== "images" && value !== undefined && value !== null) {
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
      // Fixed: Access images property correctly
      const hasImages = data.images && data.images.length > 0;

      if (hasImages) {
        const formData = new FormData();

        // Add all non-image fields
        Object.entries(data).forEach(([key, value]) => {
          if (key !== "images" && value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        // Process images - now properly typed as string[]
        data.images!.forEach((imageData, index) => {
          if (imageData.startsWith("data:image/")) {
            const file = base64ToFile(imageData, `product-image-${index + 1}`);
            formData.append("images", file);
          }
        });

        const response = await apiClient.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data.data;
      } else {
        // Remove images field if empty
        const { images, ...productData } = data;
        const response = await api.post("/products", productData);
        return response;
      }
    },

    updateProduct: async (
      id: number,
      data: ProductEditFormData
    ): Promise<{ product: Product }> => {
      // Fixed: Access images property correctly
      const hasImages = data.images && data.images.length > 0;
      const { product_id, images, ...updateData } = data;

      console.log("Submitting product update:", data);

      if (hasImages) {
        const formData = new FormData();

        // Add all non-image fields
        Object.entries(updateData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        // NEW: Collect existing images that should be kept
        const existingImagesToKeep: string[] = [];

        // Process images - separate existing from new
        data.images!.forEach((imageData, index) => {
          if (imageData.startsWith("data:image/")) {
            // New base64 image - convert to file and upload
            const file = base64ToFile(imageData, `product-image-${index + 1}`);
            formData.append("images", file);
          } else {
            // Existing image URL - add to keep list
            existingImagesToKeep.push(imageData);
          }
        });

        // NEW: Send the list of existing images to keep
        if (existingImagesToKeep.length > 0) {
          formData.append(
            "existing_images",
            JSON.stringify(existingImagesToKeep)
          );
        }

        console.log("Existing images to keep:", existingImagesToKeep);
        console.log("FormData prepared for:", formData);

        const response = await apiClient.put(`/products/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data.data;
      } else {
        const response = await api.put(`/products/${id}`, updateData);
        return response;
      }
    },

    // Multiple images upload method
    uploadProductImages: async (
      productId: number,
      files: File[]
    ): Promise<{ product: Product; image_urls: string[] }> => {
      try {
        if (files.length === 0) {
          throw new Error("No files provided");
        }

        if (files.length > 5) {
          throw new Error("Cannot upload more than 5 images");
        }

        const formData = new FormData();
        files.forEach((file, index) => {
          console.log(`Adding file ${index + 1}:`, {
            name: file.name,
            size: file.size,
            type: file.type,
          });
          formData.append("images", file);
        });

        const response = await apiClient.post(
          `/products/${productId}/images`,
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
        console.error("Multiple images upload failed:", error);
        throw new Error("Failed to upload images");
      }
    },

    // Keep the original single image upload for backward compatibility
    uploadProductImage: async (
      productId: number,
      file: File
    ): Promise<{ product: Product; image_url: string }> => {
      try {
        // Use the multiple images method but with single file
        const result = await productsService.admin.uploadProductImages(
          productId,
          [file]
        );
        return {
          product: result.product,
          image_url: result.image_urls[0] || "",
        };
      } catch (error) {
        console.error("Single image upload failed:", error);
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
