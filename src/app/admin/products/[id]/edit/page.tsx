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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Breadcrumbs,
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
  Visibility,
  Warning,
  Refresh,
  ToggleOn,
  ToggleOff,
  CheckCircle,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/store/auth.store";
import { productsService } from "@/services/products.service";
import { categoriesService } from "@/services/categories.service";
import type { ProductEditFormData } from "@/types";
import { ImageUpload } from "@/components/ui/ImageUpload";

const productSchema = yup.object({
  product_id: yup.number().required(),
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
  is_active: yup.boolean().required(),
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

function EditProductContent() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const productId = parseInt(params.id as string);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stockUpdateDialog, setStockUpdateDialog] = useState(false);
  const [newStockQuantity, setNewStockQuantity] = useState(0);
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
  } = useForm<ProductEditFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      product_id: productId,
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
      is_active: true,
      image_url: "",
    },
  });

  const {
    data: productData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productsService.getProduct(productId),
    enabled: !!productId,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getCategories(),
  });

  const updateProductMutation = useMutation({
    mutationFn: (data: ProductEditFormData) =>
      productsService.admin.updateProduct(productId, data),
    onSuccess: (data) => {
      toast.success("Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
    onError: (error: any) => {
      console.error("Product update error:", error);

      // Handle validation errors
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach((field) => {
          setError(field as keyof ProductEditFormData, {
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
        "Failed to update product";
      toast.error(errorMessage);
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: (stock_quantity: number) =>
      productsService.admin.updateStock(productId, stock_quantity),
    onSuccess: (data) => {
      toast.success(
        `Stock updated from ${data.old_stock} to ${data.new_stock}`
      );
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setStockUpdateDialog(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update stock");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: () => productsService.admin.deleteProduct(productId),
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      router.push("/admin/products");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete product");
    },
  });

  useEffect(() => {
    if (productData?.product) {
      const product = productData.product;
      reset({
        product_id: productId,
        name: product.name,
        code: product.code || "", // Handle missing code
        slug: product.slug,
        description: product.description || "",
        price: product.price,
        stock_quantity: product.stock_quantity,
        category_id: product.category_id || undefined,
        weight: product.weight || 1,
        dimensions: product.dimensions || "1x1x1",
        is_featured: product.is_featured,
        is_active: product.is_active,
        image_url: product.image_url || "",
      });
      setNewStockQuantity(product.stock_quantity);
    }
  }, [productData, reset, productId]);

  const validateForm = (data: ProductEditFormData): string[] => {
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

  const onSubmit = async (data: ProductEditFormData) => {
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

      console.log("Submitting product update:", data);

      // Show loading toast for image uploads
      if (data.image_url && data.image_url.startsWith("data:image/")) {
        toast.info("Uploading image, please wait...");
      }

      await updateProductMutation.mutateAsync(data);
    } catch (error) {
      console.error("Form submission error:", error);
      // Error handling is done in the mutation's onError
    }
  };

  const handleDeleteProduct = () => {
    deleteProductMutation.mutate();
    setDeleteDialogOpen(false);
  };

  const handleStockUpdate = () => {
    updateStockMutation.mutate(newStockQuantity);
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

  const getStatusColor = (product: any) => {
    if (!product.is_active) return "error";
    if (product.stock_quantity === 0) return "warning";
    if (product.stock_quantity <= 5) return "info";
    return "success";
  };

  const getStatusText = (product: any) => {
    if (!product.is_active) return "Inactive";
    if (product.stock_quantity === 0) return "Out of Stock";
    if (product.stock_quantity <= 5) return "Low Stock";
    return "In Stock";
  };

  if (isLoading) {
    return <LoadingSpinner fullHeight message="Loading product..." />;
  }

  if (error || !productData?.product) {
    return (
      <Box sx={{ p: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>
          Product not found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The product you're looking for doesn't exist or has been removed.
        </Typography>
        <Link href="/admin/products">
          <Button variant="contained">Back to Products</Button>
        </Link>
      </Box>
    );
  }

  const product = productData.product;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/admin">
            <Typography color="text.secondary" sx={{ cursor: "pointer" }}>
              Admin
            </Typography>
          </Link>
          <Link href="/admin/products">
            <Typography color="text.secondary" sx={{ cursor: "pointer" }}>
              Products
            </Typography>
          </Link>
          <Typography color="primary.main">{product.name}</Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Edit Product
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Chip
                label={getStatusText(product)}
                color={getStatusColor(product) as any}
                size="medium"
                sx={{ fontWeight: 600 }}
              />
              {product.is_featured && (
                <Chip label="Featured" color="warning" size="small" />
              )}
              <Typography variant="body2" color="text.secondary">
                ID: {product.id}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => router.push("/admin/products")}
            >
              Back to Products
            </Button>
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() =>
                router.push(`/products/${product.slug || product.id}`)
              }
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
                ? "Updating product and uploading image..."
                : "Updating product..."}
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
                      label="Product Name"
                      fullWidth
                      required
                      error={!!errors.name}
                      helperText={errors.name?.message}
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
                        "URL-friendly version of the name"
                      }
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
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setStockUpdateDialog(true)}
                                  title="Quick stock update"
                                  disabled={isSubmitting}
                                >
                                  <Refresh />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
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
                          alt="Current product image"
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
                    label="Upload Product Image"
                    helperText="Max 10MB, PNG or JPG format recommended"
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
              <CardHeader title="Product Status" />
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
                        label="Product Active"
                      />
                    )}
                  />

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

                  {product.stock_quantity <= 5 &&
                    product.stock_quantity > 0 && (
                      <Alert severity="warning">
                        Low stock! Only {product.stock_quantity} items
                        remaining.
                      </Alert>
                    )}

                  {product.stock_quantity === 0 && (
                    <Alert severity="error">
                      This product is out of stock.
                    </Alert>
                  )}
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
                    startIcon={<Refresh />}
                    onClick={() => setStockUpdateDialog(true)}
                    fullWidth
                    disabled={isSubmitting}
                  >
                    Update Stock
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() =>
                      router.push(`/products/${product.slug || product.id}`)
                    }
                    fullWidth
                    disabled={isSubmitting}
                  >
                    View Live Product
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PhotoCamera />}
                    onClick={handleImageUpload}
                    fullWidth
                    disabled={isSubmitting}
                  >
                    Change Image
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

            {/* Product Info */}
            <Card>
              <CardHeader title="Product Information" />
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body2">
                      {new Date(product.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body2">
                      {new Date(product.updated_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Current Stock
                    </Typography>
                    <Typography variant="body2">
                      {product.stock_quantity} units
                    </Typography>
                  </Box>
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
                  Deleting this product will permanently remove it from your
                  catalog. This action cannot be undone.
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => setDeleteDialogOpen(true)}
                  fullWidth
                  disabled={isSubmitting}
                >
                  Delete Product
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Stock Update Dialog */}
      <Dialog
        open={stockUpdateDialog}
        onClose={() => setStockUpdateDialog(false)}
      >
        <DialogTitle>Update Stock Quantity</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Current stock: {product.stock_quantity} units
          </Typography>
          <TextField
            autoFocus
            label="New Stock Quantity"
            type="number"
            fullWidth
            value={newStockQuantity}
            onChange={(e) => setNewStockQuantity(parseInt(e.target.value) || 0)}
            inputProps={{ min: 0 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStockUpdateDialog(false)}>Cancel</Button>
          <Button
            onClick={handleStockUpdate}
            variant="contained"
            disabled={updateStockMutation.isPending}
          >
            {updateStockMutation.isPending ? "Updating..." : "Update Stock"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone!
          </Alert>
          <Typography>
            Are you sure you want to delete "{product.name}"? This will
            permanently remove the product from your catalog.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteProduct}
            color="error"
            variant="contained"
            disabled={deleteProductMutation.isPending}
          >
            {deleteProductMutation.isPending ? "Deleting..." : "Delete Product"}
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
                Updating product...
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

export default function EditProductPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <EditProductContent />
      </AdminLayout>
    </AdminGuard>
  );
}
