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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Save,
  Preview,
  CloudUpload,
  Delete,
  Add,
  Remove,
  PhotoCamera,
  Info,
  Warning,
  CheckCircle,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/store/auth.store";
import { productsService } from "@/services/products.service";
import { categoriesService } from "@/services/categories.service";
import type { ProductCreateFormData } from "@/types";
import { ImageUpload } from "@/components/ui/ImageUpload";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

const productCreateSchema = yup.object({
  name: yup
    .string()
    .required("Product name is required")
    .min(3, "Product name must be at least 3 characters"),
  code: yup
    .string()
    .required("Product code is required")
    .min(3, "Product code must be at least 3 characters"),
  slug: yup
    .string()
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only"
    )
    .optional(),
  description: yup.string().optional(),
  price: yup
    .number()
    .required("Price is required")
    .min(0.01, "Price must be greater than 0")
    .max(999999.99, "Price is too high"),
  stock_quantity: yup
    .number()
    .required("Stock quantity is required")
    .min(0, "Stock quantity cannot be negative")
    .integer("Stock quantity must be a whole number")
    .max(999999, "Stock quantity is too high"),
  category_id: yup.number().required(),
  weight: yup
    .number()
    .min(0, "Weight must be positive")
    .max(9999, "Weight is too high")
    .optional(),
  dimensions: yup.string().optional(),
  is_featured: yup.boolean().optional(),
  image_url: yup.string().optional(),
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

function CreateProductContent() {
  const router = useRouter();
  const { t } = useTranslation();
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
  } = useForm<ProductCreateFormData>({
    resolver: yupResolver(productCreateSchema),
    defaultValues: {
      name: "",
      code: "",
      slug: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      category_id: undefined,
      weight: 1,
      dimensions: "1x1x1",
      is_featured: false,
      image_url: "",
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

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getCategories(),
  });

  const createProductMutation = useMutation({
    mutationFn: productsService.admin.createProduct,
    onSuccess: (data) => {
      toast.success("Product created successfully!");
      router.push(`/admin/products/${data.product.id}`);
    },
    onError: (error: any) => {
      console.error("Product creation error:", error);

      // Handle validation errors
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach((field) => {
          setError(field as keyof ProductCreateFormData, {
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
        "Failed to create product";
      toast.error(errorMessage);
    },
  });

  const validateForm = (data: ProductCreateFormData): string[] => {
    const errors: string[] = [];

    if (!data.name?.trim()) {
      errors.push("Product name is required");
    }

    if (!data.code?.trim()) {
      errors.push("Product code is required");
    }

    if (!data.price || data.price <= 0) {
      errors.push("Valid price is required");
    }

    if (data.stock_quantity === undefined || data.stock_quantity < 0) {
      errors.push("Valid stock quantity is required");
    }

    if (data.weight && data.weight < 0) {
      errors.push("Weight cannot be negative");
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

  const onSubmit = async (data: ProductCreateFormData) => {
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

      console.log("Submitting product data:", data);

      // Show loading toast for image uploads
      if (data.image_url && data.image_url.startsWith("data:image/")) {
        toast.info("Uploading image, please wait...");
      }

      await createProductMutation.mutateAsync(data);
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

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Link href="/admin/products">
            <IconButton>
              <ArrowBack />
            </IconButton>
          </Link>
          <Typography variant="h4" sx={{ fontWeight: 700, flex: 1 }}>
            Create New Product
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Preview />}
            onClick={() => toast.info("Preview functionality coming soon")}
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
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Fill in the product details below to add a new product to your catalog
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
                ? "Creating product and uploading image..."
                : "Creating product..."}
            </Typography>
          </Box>
        </Alert>
      )}

      <Grid container spacing={3}>
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
                      label="Product Name"
                      fullWidth
                      required
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      placeholder="Enter product name"
                      disabled={isSubmitting}
                    />
                  )}
                />

                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Product Code"
                      fullWidth
                      required
                      error={!!errors.code}
                      helperText={
                        errors.code?.message ||
                        "Unique identifier for the product"
                      }
                      placeholder="Enter product code (e.g., PROD001)"
                      disabled={isSubmitting}
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
                      placeholder="product-name"
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
                      helperText={errors.description?.message}
                      placeholder="Describe your product in detail..."
                      disabled={isSubmitting}
                    />
                  )}
                />
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card>
              <CardHeader title="Pricing & Inventory" />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="price"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Price"
                          fullWidth
                          required
                          type="number"
                          error={!!errors.price}
                          helperText={errors.price?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                          inputProps={{ min: 0.01, step: 0.01, max: 999999.99 }}
                          disabled={isSubmitting}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="stock_quantity"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Stock Quantity"
                          fullWidth
                          required
                          type="number"
                          error={!!errors.stock_quantity}
                          helperText={errors.stock_quantity?.message}
                          inputProps={{ min: 0, max: 999999 }}
                          disabled={isSubmitting}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader title="Product Details" />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="weight"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Weight"
                          fullWidth
                          type="number"
                          error={!!errors.weight}
                          helperText={errors.weight?.message}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">kg</InputAdornment>
                            ),
                          }}
                          inputProps={{ min: 0, step: 0.01, max: 9999 }}
                          disabled={isSubmitting}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="dimensions"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Dimensions"
                          fullWidth
                          error={!!errors.dimensions}
                          helperText={errors.dimensions?.message}
                          placeholder="L x W x H (cm)"
                          disabled={isSubmitting}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Media */}
            <Card>
              <CardHeader title="Product Images" />
              <CardContent>
                <ImageUpload
                  value={watch("image_url")}
                  onChange={handleImageChange}
                  onError={handleImageError}
                  maxSize={10}
                  label="Upload Product Image"
                  helperText="Max 10MB, PNG or JPG format recommended"
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
            {/* Status */}
            <Card>
              <CardHeader title="Product Status" />
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Controller
                    name="is_featured"
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
                        label="Featured Product"
                      />
                    )}
                  />

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      New products are active by default. You can change this
                      later in the edit page.
                    </Typography>
                  </Alert>
                </Box>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader title="Organization" />
              <CardContent>
                <Controller
                  name="category_id"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.category_id}>
                      <InputLabel>Category</InputLabel>
                      <Select
                        {...field}
                        value={field.value || ""}
                        label="Category"
                        disabled={isSubmitting || categoriesLoading}
                      >
                        <MenuItem value="">
                          <em>No Category</em>
                        </MenuItem>
                        {categoriesData?.categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.category_id && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 1 }}
                        >
                          {errors.category_id.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
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
                    onClick={() => toast.info("Preview coming soon")}
                    fullWidth
                    disabled={isSubmitting}
                  >
                    Preview Product
                  </Button>
                </Box>
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
                      Product Name {watch("name") ? "✓" : "(Required)"}
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
                      Product Code {watch("code") ? "✓" : "(Required)"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {watch("price") && watch("price") > 0 ? (
                      <CheckCircle
                        sx={{ fontSize: 16, color: "success.main" }}
                      />
                    ) : (
                      <Warning sx={{ fontSize: 16, color: "warning.main" }} />
                    )}
                    <Typography variant="body2">
                      Price{" "}
                      {watch("price") && watch("price") > 0
                        ? "✓"
                        : "(Required)"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {watch("stock_quantity") !== undefined &&
                    watch("stock_quantity") >= 0 ? (
                      <CheckCircle
                        sx={{ fontSize: 16, color: "success.main" }}
                      />
                    ) : (
                      <Warning sx={{ fontSize: 16, color: "warning.main" }} />
                    )}
                    <Typography variant="body2">
                      Stock Quantity{" "}
                      {watch("stock_quantity") !== undefined &&
                      watch("stock_quantity") >= 0
                        ? "✓"
                        : "(Required)"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Need Help? */}
            <Card>
              <CardHeader title="Need Help?" />
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Info sx={{ fontSize: 16, color: "info.main" }} />
                    <Typography variant="body2">
                      Product images should be at least 800x800px
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Info sx={{ fontSize: 16, color: "info.main" }} />
                    <Typography variant="body2">
                      Use descriptive names for better SEO
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Info sx={{ fontSize: 16, color: "info.main" }} />
                    <Typography variant="body2">
                      Set accurate stock quantities for inventory tracking
                    </Typography>
                  </Box>
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
          <Link href="/admin/products">
            <Button startIcon={<ArrowBack />} disabled={isSubmitting}>
              Back to Products
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
                Creating product...
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
              {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Bottom spacing for fixed toolbar */}
      <Box sx={{ height: 80 }} />
    </Box>
  );
}

export default function CreateProductPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <CreateProductContent />
      </AdminLayout>
    </AdminGuard>
  );
}
