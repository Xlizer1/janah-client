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
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/store/auth.store";
import { categoriesService } from "@/services/categories.service";
import type { CategoryCreateData, CategoryFormData } from "@/types";

const categorySchema = yup.object({
  name: yup
    .string()
    .required("Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must be less than 100 characters"),
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
  image_url: yup.string().url("Image URL must be valid").optional(),
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
  const queryClient = useQueryClient();
  const categoryId = parseInt(params.id as string);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset,
  } = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: "",
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

  const updateCategoryMutation = useMutation({
    mutationFn: (data: CategoryCreateData & { is_active: boolean }) =>
      categoriesService.admin.updateCategory(categoryId, data),
    onSuccess: (data) => {
      toast.success("Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["category", categoryId] });
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update category");
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
        slug: category.slug,
        description: category.description || "",
        image_url: category.image_url || "",
        sort_order: category.sort_order,
        is_active: category.is_active,
      });
    }
  }, [categoryData, reset]);

  const onSubmit = (data: CategoryFormData) => {
    updateCategoryMutation.mutate(data);
  };

  const handleDeleteCategory = () => {
    deleteCategoryMutation.mutate();
    setDeleteDialogOpen(false);
  };

  const handleImageUpload = () => {
    toast.info("Image upload functionality coming soon");
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
          >
            View Live
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSubmit(onSubmit)}
            disabled={updateCategoryMutation.isPending || !isDirty}
          >
            {updateCategoryMutation.isPending ? "Saving..." : "Save Changes"}
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
                      error={!!errors.name}
                      helperText={errors.name?.message}
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
                    />
                  )}
                />
              </CardContent>
            </Card>

            {/* Category Image */}
            <Card>
              <CardHeader title="Category Image" />
              <CardContent>
                <Controller
                  name="image_url"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Image URL"
                      fullWidth
                      error={!!errors.image_url}
                      helperText={
                        errors.image_url?.message ||
                        "Enter image URL or upload below"
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  )}
                />

                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={handleImageUpload}
                    fullWidth
                  >
                    Upload Image
                  </Button>
                </Box>

                {/* Image Preview */}
                {watch("image_url") && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Image Preview:
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
                      }}
                    >
                      <img
                        src={watch("image_url")}
                        alt="Category preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={() => toast.error("Invalid image URL")}
                      />
                    </Box>
                  </Box>
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
                    />
                  )}
                />
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
                    startIcon={<CloudUpload />}
                    onClick={handleImageUpload}
                    fullWidth
                  >
                    Change Image
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Preview />}
                    onClick={handlePreview}
                    fullWidth
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
            <Button startIcon={<ArrowBack />}>Back to Categories</Button>
          </Link>
          <Box sx={{ display: "flex", gap: 2 }}>
            {isDirty && (
              <Typography variant="body2" color="warning.main">
                You have unsaved changes
              </Typography>
            )}
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSubmit(onSubmit)}
              disabled={updateCategoryMutation.isPending || !isDirty}
            >
              {updateCategoryMutation.isPending ? "Saving..." : "Save Changes"}
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
