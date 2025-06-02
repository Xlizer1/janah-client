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
  FormControlLabel,
  Switch,
  Alert,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  Save,
  Preview,
  CloudUpload,
  Category as CategoryIcon,
  Info,
  Refresh,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/store/auth.store";
import { categoriesService } from "@/services/categories.service";
import type { CategoryCreateData } from "@/types";

// Validation schema
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
});

// Protect admin route
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<CategoryCreateData>({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image_url: "",
      sort_order: 1,
    },
  });

  // Watch name to auto-generate slug
  const watchName = watch("name");
  React.useEffect(() => {
    if (watchName) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setValue("slug", slug);
    }
  }, [watchName, setValue, getValues]);

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: categoriesService.admin.createCategory,
    onSuccess: (data) => {
      toast.success("Category created successfully!");
      router.push(`/admin/categories/${data.category.id}/edit`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create category");
    },
  });

  const onSubmit = (data: CategoryCreateData) => {
    createCategoryMutation.mutate(data);
  };

  const handleSaveAsDraft = () => {
    setIsDraft(true);
    toast.info("Save as draft functionality coming soon");
  };

  const handleImageUpload = () => {
    toast.info("Image upload functionality coming soon");
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
          >
            Preview
          </Button>
          <Button
            variant="outlined"
            onClick={handleSaveAsDraft}
            disabled={createCategoryMutation.isPending}
          >
            Save as Draft
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSubmit(onSubmit)}
            disabled={createCategoryMutation.isPending}
          >
            {createCategoryMutation.isPending
              ? "Creating..."
              : "Create Category"}
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Fill in the category details below to organize your products
        </Typography>
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
                      placeholder="Enter category name"
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
                        "URL-friendly version of the name (auto-generated)"
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
                    startIcon={<CloudUpload />}
                    onClick={handleImageUpload}
                    fullWidth
                  >
                    Upload Image
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Preview />}
                    onClick={handlePreview}
                    fullWidth
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
            <Button startIcon={<ArrowBack />}>Back to Categories</Button>
          </Link>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleSaveAsDraft}
              disabled={createCategoryMutation.isPending}
            >
              Save as Draft
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSubmit(onSubmit)}
              disabled={createCategoryMutation.isPending}
            >
              {createCategoryMutation.isPending
                ? "Creating..."
                : "Create Category"}
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
