// src/app/admin/products/create/page.tsx
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
import type { ProductCreateData } from "@/types";

// Validation schema
const productSchema = yup.object({
  name: yup
    .string()
    .required("Product name is required")
    .min(3, "Product name must be at least 3 characters"),
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
    .min(0, "Price must be positive"),
  stock_quantity: yup
    .number()
    .required("Stock quantity is required")
    .min(0, "Stock quantity must be positive")
    .integer("Stock quantity must be a whole number"),
  category_id: yup.number().optional(),
  sku: yup.string().optional(),
  weight: yup.number().min(0, "Weight must be positive").optional(),
  dimensions: yup.string().optional(),
  is_featured: yup.boolean().optional(),
  image_url: yup.string().url("Image URL must be valid").optional(),
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

function CreateProductContent() {
  const router = useRouter();
  const [isDraft, setIsDraft] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<ProductCreateData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      category_id: undefined,
      sku: "",
      weight: undefined,
      dimensions: "",
      is_featured: false,
      image_url: "",
    },
  });

  // Watch name to auto-generate slug
  const watchName = watch("name");
  React.useEffect(() => {
    if (watchName && !getValues("slug")) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setValue("slug", slug);
    }
  }, [watchName, setValue, getValues]);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getCategories(),
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: productsService.admin.createProduct,
    onSuccess: (data) => {
      toast.success("Product created successfully!");
      router.push(`/admin/products/${data.product.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create product");
    },
  });

  const onSubmit = (data: ProductCreateData) => {
    createProductMutation.mutate(data);
  };

  const handleSaveAsDraft = () => {
    setIsDraft(true);
    toast.info("Save as draft functionality coming soon");
  };

  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    setValue("sku", `PRD-${timestamp}-${random}`);
  };

  const handleImageUpload = () => {
    toast.info("Image upload functionality coming soon");
  };

  return (
    <Box>
      {/* Header */}
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
          >
            Preview
          </Button>
          <Button
            variant="outlined"
            onClick={handleSaveAsDraft}
            disabled={createProductMutation.isPending}
          >
            Save as Draft
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSubmit(onSubmit)}
            disabled={createProductMutation.isPending}
          >
            {createProductMutation.isPending ? "Creating..." : "Create Product"}
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Fill in the product details below to add a new product to your catalog
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
                      label="Product Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      placeholder="Enter product name"
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
                          inputProps={{ min: 0, step: 0.01 }}
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
                          type="number"
                          error={!!errors.stock_quantity}
                          helperText={errors.stock_quantity?.message}
                          inputProps={{ min: 0 }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="sku"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="SKU (Stock Keeping Unit)"
                          fullWidth
                          error={!!errors.sku}
                          helperText={
                            errors.sku?.message || "Unique product identifier"
                          }
                          placeholder="SKU-12345"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={generateSKU}>
                                  <Add />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
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
                          inputProps={{ min: 0, step: 0.01 }}
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
                        alt="Product preview"
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
                          />
                        }
                        label="Featured Product"
                      />
                    )}
                  />

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      New products are active by default. You can change this
                      later.
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
                  >
                    Add Image
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Preview />}
                    onClick={() => toast.info("Preview coming soon")}
                    fullWidth
                  >
                    Preview Product
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Help */}
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
            <Button startIcon={<ArrowBack />}>Back to Products</Button>
          </Link>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleSaveAsDraft}
              disabled={createProductMutation.isPending}
            >
              Save as Draft
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSubmit(onSubmit)}
              disabled={createProductMutation.isPending}
            >
              {createProductMutation.isPending
                ? "Creating..."
                : "Create Product"}
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
