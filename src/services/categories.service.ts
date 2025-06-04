import { api, apiClient } from "@/lib/api-client";
import type {
  Category,
  CategoryCreateData,
  CategoryOption,
  CategoryFilters,
  CategoriesResponse,
  CategoryFormData,
  CategoryCreateFormData,
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
  fileName: string = "category-image"
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
  data: CategoryCreateFormData | CategoryFormData
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

export const categoriesService = {
  getCategories: async (
    filters: CategoryFilters = {}
  ): Promise<CategoriesResponse> => {
    return api.get("/categories", filters);
  },

  getCategoriesWithCounts: async (
    include_empty = false
  ): Promise<{ categories: Category[] }> => {
    return api.get("/categories/with-counts", { include_empty });
  },

  getCategoryOptions: async (): Promise<{ categories: CategoryOption[] }> => {
    return api.get("/categories/options");
  },

  searchCategories: async (q: string): Promise<{ categories: Category[] }> => {
    return api.get("/categories/search", { q });
  },

  getCategory: async (
    identifier: string | number
  ): Promise<{ category: Category }> => {
    return api.get(`/categories/${identifier}`);
  },

  getCategoryByCode: async (code: string): Promise<{ category: Category }> => {
    return api.get(`/categories/code/${code}`);
  },

  admin: {
    createCategory: async (
      data: CategoryCreateFormData
    ): Promise<{ category: Category }> => {
      try {
        console.log("Creating category with data:", data);

        // Validate required fields
        if (!data.name || !data.name.trim()) {
          throw new Error("Category name is required");
        }

        const isImageFile =
          data.image_url && data.image_url.startsWith("data:image/");

        if (isImageFile) {
          console.log("Processing image upload...");

          try {
            const formData = prepareFormData(data);
            const file = base64ToFile(data.image_url!, "category-image");

            console.log("Image file created:", {
              name: file.name,
              size: file.size,
              type: file.type,
            });

            formData.append("image", file);

            const response = await apiClient.post("/categories", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              timeout: 60000, // 60 second timeout for image upload
            });

            console.log("Category created successfully with image");
            return response.data.data;
          } catch (imageError) {
            console.error("Image processing error:", imageError);

            if (imageError instanceof Error) {
              throw new Error(`Image upload failed: ${imageError.message}`);
            }
            throw new Error("Image upload failed: Unknown error");
          }
        } else {
          console.log("Creating category without image...");

          // Remove image_url if it's empty or invalid
          const { image_url, ...categoryData } = data;

          const response = await api.post("/categories", categoryData);
          console.log("Category created successfully without image");
          return response;
        }
      } catch (error) {
        console.error("Category creation failed:", error);

        // Handle different types of errors
        if (error instanceof Error) {
          throw error;
        }

        // Handle axios errors
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as any;
          const message =
            axiosError.response?.data?.message || "Failed to create category";
          throw new Error(message);
        }

        throw new Error("Failed to create category: Unknown error");
      }
    },

    updateCategory: async (
      id: number,
      data:
        | (Partial<CategoryCreateData> & { is_active?: boolean })
        | CategoryFormData
    ): Promise<{ category: Category }> => {
      try {
        console.log("Updating category with data:", data);

        // Validate required fields if name is provided
        if ("name" in data && (!data.name || !data.name.trim())) {
          throw new Error("Category name is required");
        }

        const isImageFile =
          "image_url" in data &&
          data.image_url &&
          data.image_url.startsWith("data:image/");

        if (isImageFile) {
          console.log("Processing image update...");

          try {
            const formData = new FormData();

            // Add all form fields except image_url
            Object.entries(data).forEach(([key, value]) => {
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

            const file = base64ToFile(data.image_url!, "category-image");

            console.log("Image file created for update:", {
              name: file.name,
              size: file.size,
              type: file.type,
            });

            formData.append("image", file);

            const response = await apiClient.put(
              `/categories/${id}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                timeout: 60000, // 60 second timeout for image upload
              }
            );

            console.log("Category updated successfully with image");
            return response.data.data;
          } catch (imageError) {
            console.error("Image processing error during update:", imageError);

            if (imageError instanceof Error) {
              throw new Error(`Image update failed: ${imageError.message}`);
            }
            throw new Error("Image update failed: Unknown error");
          }
        } else {
          console.log("Updating category without image changes...");

          // Remove image_url if it's empty or invalid for regular API call
          const { image_url, ...updateData } = data as any;
          const response = await api.put(`/categories/${id}`, updateData);
          console.log("Category updated successfully without image");
          return response;
        }
      } catch (error) {
        console.error("Category update failed:", error);

        // Handle different types of errors
        if (error instanceof Error) {
          throw error;
        }

        // Handle axios errors
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as any;
          const message =
            axiosError.response?.data?.message || "Failed to update category";
          throw new Error(message);
        }

        throw new Error("Failed to update category: Unknown error");
      }
    },

    uploadCategoryImage: async (
      categoryId: number,
      file: File
    ): Promise<{ category: Category; image_url: string }> => {
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await apiClient.post(
          `/categories/${categoryId}/image`,
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

    removeCategoryImage: async (
      categoryId: number
    ): Promise<{ category: Category }> => {
      try {
        return api.delete(`/categories/${categoryId}/image`);
      } catch (error) {
        console.error("Image removal failed:", error);
        throw new Error("Failed to remove image");
      }
    },

    deleteCategory: async (id: number): Promise<void> => {
      try {
        return api.delete(`/categories/${id}`);
      } catch (error) {
        console.error("Category deletion failed:", error);
        throw new Error("Failed to delete category");
      }
    },

    updateSortOrders: async (
      categories: Array<{ id: number; sort_order: number }>
    ): Promise<{
      updated: Array<{ id: number; old_order: number; new_order: number }>;
      failed: Array<{ id: number; reason: string }>;
    }> => {
      return api.put("/categories/sort-orders/update", { categories });
    },
  },
};

export default categoriesService;
