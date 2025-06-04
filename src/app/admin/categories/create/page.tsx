"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Save,
  Preview,
  CloudUpload,
  Category as CategoryIcon,
  Info,
  Refresh,
  PhotoCamera,
  Warning,
  CheckCircle,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useAuth } from "@/store/auth.store";
import { categoriesService } from "@/services/categories.service";
import type { CategoryCreateFormData } from "@/types";

const categorySchema = yup.object({
  name: yup
    .string()
    .required("Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must be less than 100 characters"),
  code: yup
    .string()
    .required("Category code is required")
    .min(2, "Category code must be at least 2 characters")
    .max(20, "Category code must be less than 20 characters")
    .matches(
      /^[A-Z0-9_-]+$/,
      "Code must be uppercase letters, numbers, underscores, or hyphens only"
    ),
  slug: yup
    .string()
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only"
    )
    .optional(),
  description: yup
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  image_url: yup.string().optional(),
  sort_order: yup
    .number()
    .min(0, "Sort order must be positive")
    .integer("Sort order must be a whole number")
    .optional(),
});

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullHeight />;
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <Box sx={{ p: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          You don't have permission to access this page.
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}

function CreateCategoryContent() {
  const router = useRouter();
  const [isDraft, setIsDraft] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    watch,
    setValue,
    getValues,
    clearErrors,
    setError,
  } = useForm<CategoryCreateFormData>({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: "",
      code: "",
      slug: "",
      description: "",
      image_url: "",
      sort_order: 1,
    },
  });

  const watchName = watch("name");
  React.useEffect(() => {
    if (watchName && watchName.length > 0) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      if (slug !== getValues("slug")) {
        setValue("slug", slug);
      }
    }
  }, [watchName, setValue, getValues]);

  const validateForm = (data: CategoryCreateFormData): string[] => {
    const errors: string[] = [];

    if (!data.name?.trim()) {
      errors.push("Category name is required");
    }

    if (!data.code?.trim()) {
      errors.push("Category code is required");
    }

    if (data.sort_order && data.sort_order < 0) {
      errors.push("Sort order cannot be negative");
    }

    // Validate image if provided
    if (data.image_url && data.image_url.startsWith("data:image/")) {
      try {
        const base64Data = data.image_url.split(",")[1];
        if (!base64Data || base64Data.length === 0) {
          errors.push("Invalid image data");
        }

        // Check if base64 is valid
        atob(base64Data);

        // Check image size (approximate)
        const sizeInBytes = (base64Data.length * 3) / 4;
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (sizeInBytes > maxSize) {
          errors.push("Image size too large (max 10MB)");
        }
      } catch (e) {
        errors.push("Invalid image format");
      }
    }

    return errors;
  };

  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryCreateFormData) => {
      try {
        console.log("Creating category with data:", data);

        // Validate required fields
        if (!data.name?.trim()) {
          throw new Error("Category name is required");
        }

        const isImageFile =
          data.image_url && data.image_url.startsWith("data:image/");

        if (isImageFile) {
          console.log("Processing image upload...");

          try {
            // Convert base64 to File
            const base64ToFile = (
              dataUrl: string,
              fileName: string = "category-image"
            ): File => {
              const arr = dataUrl.split(",");
              const mime = arr[0].match(/:(.*?);/)?.[1];
              const bstr = atob(arr[1]);
              let n = bstr.length;
              const u8arr = new Uint8Array(n);

              while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
              }

              const extension = mime?.split("/")[1] || "jpg";
              const fullFileName = `${fileName}.${extension}`;
              return new File([u8arr], fullFileName, { type: mime });
            };

            const formData = new FormData();

            // Add all form fields except image_url
            Object.entries(data).forEach(([key, value]) => {
              if (
                key !== "image_url" &&
                value !== undefined &&
                value !== null
              ) {
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
            console.log("Image file created:", {
              name: file.name,
              size: file.size,
              type: file.type,
            });

            formData.append("image", file);

            // Use the API client directly for FormData
            const { apiClient } = await import("@/lib/api-client");
            const response = await apiClient.post("/categories", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              timeout: 60000, // 60 second timeout for image upload
            });

            if (!response.data) {
              throw new Error("Failed to create category");
            }

            const result = response.data;
            console.log("Category created successfully with image");
            return result.data;
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
          const response = await categoriesService.admin.createCategory(
            categoryData
          );
          console.log("Category created successfully without image");
          return response;
        }
      } catch (error) {
        console.error("Category creation failed:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("Category created successfully!");
      router.push(`/admin/categories/${data.category.id}/edit`);
    },
    onError: (error: any) => {
      console.error("Category creation error:", error);

      // Handle validation errors
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach((field) => {
          setError(field as keyof CategoryCreateFormData, {
            type: "server",
            message: Array.isArray(serverErrors[field])
              ? serverErrors[field][0]
              : serverErrors[field],
          });
        });
      }

      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        "Failed to create category";
      toast.error(errorMessage);
    },
  });

  const onSubmit = async (data: CategoryCreateFormData) => {
    try {
      // Clear previous validation errors
      setValidationErrors([]);
      clearErrors();

      // Validate form data
      const errors = validateForm(data);
      if (errors.length > 0) {
        setValidationErrors(errors);
        toast.error("Please fix the validation errors");
        return;
      }

      console.log("Submitting category data:", data);

      // Show loading toast for image uploads
      if (data.image_url && data.image_url.startsWith("data:image/")) {
        toast.info("Uploading image, please wait...");
      }

      await createCategoryMutation.mutateAsync(data);
    } catch (error) {
      console.error("Form submission error:", error);
      // Error handling is done in the mutation's onError
    }
  };

  const handleSaveAsDraft = () => {
    setIsDraft(true);
    toast.info("Save as draft functionality coming soon");
  };

  const handleImageUpload = () => {
    toast.info("Use the image upload component below");
  };

  const handleImageError = (error: string) => {
    console.error("Image upload error:", error);
    toast.error(error);
    setError("image_url", {
      type: "manual",
      message: error,
    });
  };

  const handleImageChange = (imageUrl: string) => {
    setValue("image_url", imageUrl, { shouldValidate: true });
    clearErrors("image_url");
  };

  const handlePreview = () => {
    const formData = getValues();
    if (!formData.name) {
      toast.error("Please enter a category name to preview");
      return;
    }
    toast.info("Preview functionality coming soon");
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Link href="/admin/categories">
            <IconButton>
              <ArrowBack />
            </IconButton>
          </Link>
          <Typography variant="h4" sx={{ fontWeight: 700, flex: 1 }}>
            Create New Category
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Preview />}
            onClick={handlePreview}
            disabled={isSubmitting}
          >
            Preview
          </Button>
          <Button
            variant="outlined"
            onClick={handleSaveAsDraft}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? "Creating..." : "Create Category"}
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Fill in the category details below to organize your products
        </Typography>
      </Box>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Please fix the following errors:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Loading State */}
      {isSubmitting && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CircularProgress size={20} />
            <Typography>
              {watch("image_url") &&
              watch("image_url")?.startsWith("data:image/")
                ? "Creating category and uploading image..."
                : "Creating category..."}
            </Typography>
          </Box>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Basic Information */}
            <Card>
              <CardHeader title="Basic Information" />
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 3 }}
              >
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Category Name"
                      fullWidth
                      required
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      placeholder="Enter category name"
                      disabled={isSubmitting}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CategoryIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />

                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Category Code"
                      fullWidth
                      required
                      error={!!errors.code}
                      helperText={
                        errors.code?.message ||
                        "Unique identifier for the category (e.g., ELEC, COMP)"
                      }
                      placeholder="Enter category code"
                      disabled={isSubmitting}
                      onChange={(e) => {
                        // Auto-uppercase the code
                        const value = e.target.value.toUpperCase();
                        field.onChange(value);
                      }}
                    />
                  )}
                />

                <Controller
                  name="slug"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="URL Slug"
                      fullWidth
                      error={!!errors.slug}
                      helperText={
                        errors.slug?.message ||
                        "URL-friendly version of the name (auto-generated)"
                      }
                      placeholder="category-name"
                      disabled={isSubmitting}
                    />
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      fullWidth
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={
                        errors.description?.message ||
                        "Optional description for this category"
                      }
                      placeholder="Describe this category and what products it contains..."
                      disabled={isSubmitting}
                    />
                  )}
                />
              </CardContent>
            </Card>

            {/* Category Image */}
            <Card>
              <CardHeader title="Category Image" />
              <CardContent>
                <ImageUpload
                  value={watch("image_url")}
                  onChange={handleImageChange}
                  onError={handleImageError}
                  maxSize={10}
                  label="Upload Category Image"
                  helperText="Max 10MB, PNG or JPG format recommended. Category images should be at least 400x400px"
                  variant="dropzone"
                  disabled={isSubmitting}
                />

                {errors.image_url && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {errors.image_url.message}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Organization */}
            <Card>
              <CardHeader title="Organization" />
              <CardContent>
                <Controller
                  name="sort_order"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Sort Order"
                      type="number"
                      fullWidth
                      error={!!errors.sort_order}
                      helperText={
                        errors.sort_order?.message ||
                        "Lower numbers appear first"
                      }
                      inputProps={{ min: 0 }}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </CardContent>
            </Card>

            {/* Validation Status */}
            <Card>
              <CardHeader title="Validation Status" />
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {watch("name") ? (
                      <CheckCircle
                        sx={{ fontSize: 16, color: "success.main" }}
                      />
                    ) : (
                      <Warning sx={{ fontSize: 16, color: "warning.main" }} />
                    )}
                    <Typography variant="body2">
                      Category Name {watch("name") ? "✓" : "(Required)"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {watch("code") ? (
                      <CheckCircle
                        sx={{ fontSize: 16, color: "success.main" }}
                      />
                    ) : (
                      <Warning sx={{ fontSize: 16, color: "warning.main" }} />
                    )}
                    <Typography variant="body2">
                      Category Code {watch("code") ? "✓" : "(Required)"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {watch("slug") ? (
                      <CheckCircle
                        sx={{ fontSize: 16, color: "success.main" }}
                      />
                    ) : (
                      <Info sx={{ fontSize: 16, color: "info.main" }} />
                    )}
                    <Typography variant="body2">
                      URL Slug {watch("slug") ? "✓" : "(Auto-generated)"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {watch("image_url") ? (
                      <CheckCircle
                        sx={{ fontSize: 16, color: "success.main" }}
                      />
                    ) : (
                      <Info sx={{ fontSize: 16, color: "info.main" }} />
                    )}
                    <Typography variant="body2">
                      Category Image {watch("image_url") ? "✓" : "(Optional)"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {watch("sort_order") != null &&
                    watch("sort_order")! >= 0 ? (
                      <CheckCircle
                        sx={{ fontSize: 16, color: "success.main" }}
                      />
                    ) : (
                      <Info sx={{ fontSize: 16, color: "info.main" }} />
                    )}
                    <Typography variant="body2">
                      Sort Order{" "}
                      {watch("sort_order") != null && watch("sort_order")! >= 0
                        ? "✓"
                        : "(Optional)"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader title="Category Settings" />
              <CardContent>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    New categories are active by default. You can change this
                    after creation.
                  </Typography>
                </Alert>

                <Typography variant="body2" color="text.secondary">
                  Additional settings will be available after the category is
                  created.
                </Typography>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader title="Category Guidelines" />
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Info sx={{ fontSize: 16, color: "info.main" }} />
                    <Typography variant="body2">
                      Use clear, descriptive names
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Info sx={{ fontSize: 16, color: "info.main" }} />
                    <Typography variant="body2">
                      Category images should be at least 400x400px
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Info sx={{ fontSize: 16, color: "info.main" }} />
                    <Typography variant="body2">
                      Keep descriptions concise and helpful
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Info sx={{ fontSize: 16, color: "info.main" }} />
                    <Typography variant="body2">
                      Use sort order to organize category display
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader title="Quick Actions" />
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<PhotoCamera />}
                    onClick={handleImageUpload}
                    fullWidth
                    disabled={isSubmitting}
                  >
                    Add Image
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Preview />}
                    onClick={handlePreview}
                    fullWidth
                    disabled={isSubmitting}
                  >
                    Preview Category
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Fixed Bottom Actions */}
      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          bgcolor: "background.paper",
          borderTop: 1,
          borderColor: "divider",
          zIndex: 1200,
        }}
      >
        <Box
          sx={{
            maxWidth: "xl",
            mx: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link href="/admin/categories">
            <Button startIcon={<ArrowBack />} disabled={isSubmitting}>
              Back to Categories
            </Button>
          </Link>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {isDirty && !isSubmitting && (
              <Typography variant="body2" color="warning.main">
                You have unsaved changes
              </Typography>
            )}
            {isSubmitting && (
              <Typography variant="body2" color="info.main">
                Creating category...
              </Typography>
            )}
            <Button
              variant="contained"
              startIcon={
                isSubmitting ? <CircularProgress size={20} /> : <Save />
              }
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? "Creating..." : "Create Category"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Bottom spacing for fixed toolbar */}
      <Box sx={{ height: 80 }} />
    </Box>
  );
}

export default function CreateCategoryPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <CreateCategoryContent />
      </AdminLayout>
    </AdminGuard>
  );
}
