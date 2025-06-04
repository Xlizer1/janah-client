"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Alert,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Save,
  Preview,
  CloudUpload,
  Delete,
  Refresh,
  Info,
  Visibility,
  Category as CategoryIcon,
  PhotoCamera,
  Warning,
  CheckCircle,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useAuth } from "@/store/auth.store";
import { categoriesService } from "@/services/categories.service";
import type { CategoryCreateData, CategoryFormData } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

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
  is_active: yup.boolean().required(),
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

function EditCategoryContent() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const categoryId = parseInt(params.id as string);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    watch,
    setValue,
    reset,
    clearErrors,
    setError,
  } = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: "",
      code: "",
      slug: "",
      description: "",
      image_url: "",
      sort_order: 1,
      is_active: true,
    },
  });

  const {
    data: categoryData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => categoriesService.getCategory(categoryId),
    enabled: !!categoryId,
  });

  const validateForm = (data: CategoryFormData): string[] => {
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

  const updateCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      try {
        console.log("Updating category with data:", data);

        // Validate required fields
        if (!data.name?.trim()) {
          throw new Error("Category name is required");
        }

        const isImageFile =
          data.image_url && data.image_url.startsWith("data:image/");

        if (isImageFile) {
          console.log("Processing image update...");

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
            console.log("Image file created for update:", {
              name: file.name,
              size: file.size,
              type: file.type,
            });

            formData.append("image", file);

            // Use apiClient for FormData upload (it will handle auth automatically)
            const { apiClient } = await import("@/lib/api-client");
            const response = await apiClient.put(
              `/categories/${categoryId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                timeout: 60000,
              }
            );

            if (!response.data) {
              throw new Error("Failed to update category");
            }

            const result = response.data;
            console.log("Category updated successfully with image");
            return result.data;
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
          const { image_url, ...updateData } = data;
          const response = await categoriesService.admin.updateCategory(
            categoryId,
            updateData
          );
          console.log("Category updated successfully without image");
          return response;
        }
      } catch (error) {
        console.error("Category update failed:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["category", categoryId] });
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
    },
    onError: (error: any) => {
      console.error("Category update error:", error);

      // Handle validation errors
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach((field) => {
          setError(field as keyof CategoryFormData, {
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
        "Failed to update category";
      toast.error(errorMessage);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: () => categoriesService.admin.deleteCategory(categoryId),
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      router.push("/admin/categories");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
  });

  useEffect(() => {
    if (categoryData?.category) {
      const category = categoryData.category;
      reset({
        name: category.name,
        code: category.code,
        slug: category.slug,
        description: category.description || "",
        image_url: category.image_url || "",
        sort_order: category.sort_order,
        is_active: category.is_active,
      });
    }
  }, [categoryData, reset]);

  const onSubmit = async (data: CategoryFormData) => {
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

      console.log("Submitting category update:", data);

      // Show loading toast for image uploads
      if (data.image_url && data.image_url.startsWith("data:image/")) {
        toast.info("Uploading image, please wait...");
      }

      await updateCategoryMutation.mutateAsync(data);
    } catch (error) {
      console.error("Form submission error:", error);
      // Error handling is done in the mutation's onError
    }
  };

  const handleDeleteCategory = () => {
    deleteCategoryMutation.mutate();
    setDeleteDialogOpen(false);
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
    const category = categoryData?.category;
    if (category?.slug) {
      window.open(`/admin/categories/${category.id}/view`, "_blank");
    } else {
      toast.error("Category must be saved before preview");
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullHeight message="Loading category..." />;
  }

  if (error || !categoryData?.category) {
    return (
      <Box sx={{ p: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>
          Category not found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The category you're looking for doesn't exist or has been removed.
        </Typography>
        <Link href="/admin/categories">
          <Button variant="contained">Back to Categories</Button>
        </Link>
      </Box>
    );
  }

  const category = categoryData.category;

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
            Edit Category
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Visibility />}
            onClick={handlePreview}
            disabled={isSubmitting}
          >
            View Live
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => refetch()}
            disabled={isSubmitting}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Category ID: {category.id}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Created: {new Date(category.created_at).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Products: {category.product_count || 0}
          </Typography>
        </Box>
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
                ? "Updating category and uploading image..."
                : "Updating category..."}
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
                        "URL-friendly version of the name"
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
                {/* Show existing image if it's an HTTP URL */}
                {watch("image_url") &&
                  !watch("image_url")?.startsWith("data:image/") && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Current Image:
                      </Typography>
                      <Box
                        sx={{
                          width: 200,
                          height: 200,
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 2,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "grey.50",
                          position: "relative",
                        }}
                      >
                        <img
                          src={watch("image_url")}
                          alt="Current category image"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={() => console.error("Failed to load image")}
                        />
                        <IconButton
                          onClick={() => setValue("image_url", "")}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "rgba(255,255,255,0.9)",
                            color: "error.main",
                            "&:hover": {
                              bgcolor: "rgba(255,255,255,1)",
                              color: "error.dark",
                            },
                          }}
                          size="small"
                          disabled={isSubmitting}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  )}

                {/* Only show ImageUpload component if no existing image or user wants to change it */}
                {(!watch("image_url") ||
                  watch("image_url")?.startsWith("data:image/")) && (
                  <ImageUpload
                    value={
                      watch("image_url")?.startsWith("data:image/")
                        ? watch("image_url")
                        : ""
                    }
                    onChange={handleImageChange}
                    onError={handleImageError}
                    maxSize={10}
                    label="Upload Category Image"
                    helperText="Max 10MB, PNG or JPG format recommended. Category images should be at least 400x400px"
                    variant="dropzone"
                    disabled={isSubmitting}
                  />
                )}

                {/* Button to change existing image */}
                {watch("image_url") &&
                  !watch("image_url")?.startsWith("data:image/") && (
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCamera />}
                      onClick={() => setValue("image_url", "")}
                      fullWidth
                      disabled={isSubmitting}
                      sx={{ mt: 2 }}
                    >
                      Change Image
                    </Button>
                  )}

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
            {/* Status */}
            <Card>
              <CardHeader title="Category Status" />
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={field.onChange}
                            disabled={isSubmitting}
                          />
                        }
                        label="Category Active"
                      />
                    )}
                  />

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Inactive categories won't be displayed to customers but
                      products remain accessible via direct links.
                    </Typography>
                  </Alert>
                </Box>
              </CardContent>
            </Card>

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
                      URL Slug {watch("slug") ? "✓" : "(Optional)"}
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

            {/* Category Info */}
            <Card>
              <CardHeader title="Category Information" />
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body2">
                      {new Date(category.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body2">
                      {new Date(category.updated_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Products
                    </Typography>
                    <Typography variant="body2">
                      {category.product_count || 0} products
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
                    Change Image
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
                  <Button
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() =>
                      router.push(`/admin/categories/${category.id}`)
                    }
                    fullWidth
                    disabled={isSubmitting}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card sx={{ border: 1, borderColor: "error.main" }}>
              <CardHeader
                title="Danger Zone"
                titleTypographyProps={{ color: "error.main" }}
              />
              <CardContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Deleting this category will permanently remove it. Products
                  will be moved to "Uncategorized".
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => setDeleteDialogOpen(true)}
                  fullWidth
                  disabled={isSubmitting}
                >
                  Delete Category
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone!
          </Alert>
          <Typography>
            Are you sure you want to delete "{category.name}"?
            {category.product_count && category.product_count > 0 && (
              <span>
                {" "}
                This category contains {category.product_count} products that
                will be moved to "Uncategorized".
              </span>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteCategory}
            color="error"
            variant="contained"
            disabled={deleteCategoryMutation.isPending}
          >
            {deleteCategoryMutation.isPending
              ? "Deleting..."
              : "Delete Category"}
          </Button>
        </DialogActions>
      </Dialog>

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
                Updating category...
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Bottom spacing for fixed toolbar */}
      <Box sx={{ height: 80 }} />
    </Box>
  );
}

export default function EditCategoryPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <EditCategoryContent />
      </AdminLayout>
    </AdminGuard>
  );
}
