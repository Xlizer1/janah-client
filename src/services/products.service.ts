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

// NEW: Helper function to process multiple images
const processMultipleImages = (
  images: string | string[],
  baseFileName: string = "product-image"
): File[] => {
  try {
    // Handle single image (backward compatibility)
    if (typeof images === "string") {
      return [base64ToFile(images, baseFileName)];
    }

    // Handle multiple images
    if (Array.isArray(images)) {
      if (images.length === 0) {
        return [];
      }

      if (images.length > 5) {
        throw new Error("Cannot upload more than 5 images");
      }

      return images.map((imageData, index) => {
        return base64ToFile(imageData, `${baseFileName}-${index + 1}`);
      });
    }

    return [];
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
    if (
      key !== "image_url" &&
      key !== "image_urls" &&
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

        // NEW: Support both single image (image_url) and multiple images (image_urls)
        const hasImages =
          (data.image_url && typeof data.image_url === "string") ||
          (data.image_urls &&
            Array.isArray(data.image_urls) &&
            data.image_urls.length > 0);

        if (hasImages) {
          console.log("Processing image upload...");

          try {
            const formData = prepareFormData(data);

            // NEW: Process multiple images or single image
            let imageFiles: File[] = [];

            if (
              data.image_urls &&
              Array.isArray(data.image_urls) &&
              data.image_urls.length > 0
            ) {
              // Multiple images
              console.log(`Processing ${data.image_urls.length} images...`);
              imageFiles = processMultipleImages(
                data.image_urls,
                "product-image"
              );

              // Append all images with "images" field name (plural)
              imageFiles.forEach((file, index) => {
                console.log(`Adding image ${index + 1}:`, {
                  name: file.name,
                  size: file.size,
                  type: file.type,
                });
                formData.append("images", file);
              });
            } else if (data.image_url && typeof data.image_url === "string") {
              // Single image (backward compatibility)
              console.log("Processing single image...");
              const isImageFile = data.image_url.startsWith("data:image/");

              if (isImageFile) {
                const file = base64ToFile(data.image_url, "product-image");
                console.log("Single image file created:", {
                  name: file.name,
                  size: file.size,
                  type: file.type,
                });
                formData.append("images", file); // Use "images" for consistency
              }
            }

            const response = await apiClient.post("/products", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              timeout: 60000, // 60 second timeout for image upload
            });

            console.log(
              `Product created successfully with ${imageFiles.length} image(s)`
            );
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

          // Remove image fields if they're empty or invalid
          const { image_url, image_urls, ...productData } = data;

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

        // NEW: Support both single image (image_url) and multiple images (image_urls)
        const hasImages =
          (data.image_url && typeof data.image_url === "string") ||
          (data.image_urls &&
            Array.isArray(data.image_urls) &&
            data.image_urls.length > 0);

        // Remove product_id and image fields from the data sent to API
        const { product_id, image_url, image_urls, ...updateData } = data;

        if (hasImages) {
          console.log("Processing image update...");

          try {
            const formData = new FormData();

            // Add all non-image fields to FormData
            Object.entries(updateData).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                if (typeof value === "number") {
                  formData.append(key, value.toString());
                } else if (typeof value === "boolean") {
                  formData.append(key, value ? "true" : "false");
                } else {
                  formData.append(key, String(value));
                }
              }
            });

            // NEW: Process multiple images or single image
            let imageFiles: File[] = [];

            if (
              data.image_urls &&
              Array.isArray(data.image_urls) &&
              data.image_urls.length > 0
            ) {
              // Multiple images
              console.log(
                `Processing ${data.image_urls.length} images for update...`
              );
              imageFiles = processMultipleImages(
                data.image_urls,
                "product-image"
              );

              // Append all images with "images" field name (plural)
              imageFiles.forEach((file, index) => {
                console.log(`Adding image ${index + 1} for update:`, {
                  name: file.name,
                  size: file.size,
                  type: file.type,
                });
                formData.append("images", file);
              });
            } else if (data.image_url && typeof data.image_url === "string") {
              // Single image (backward compatibility)
              const isImageFile = data.image_url.startsWith("data:image/");

              if (isImageFile) {
                console.log("Processing single image for update...");
                const file = base64ToFile(data.image_url, "product-image");
                console.log("Single image file created for update:", {
                  name: file.name,
                  size: file.size,
                  type: file.type,
                });
                formData.append("images", file); // Use "images" for consistency
              }
            }

            const response = await apiClient.put(`/products/${id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              timeout: 60000, // 60 second timeout for image upload
            });

            console.log(
              `Product updated successfully with ${imageFiles.length} image(s)`
            );
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

    // NEW: Multiple images upload method
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
