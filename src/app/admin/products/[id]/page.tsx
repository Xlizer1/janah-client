"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tabs,
  Tab,
  Rating,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Delete,
  Visibility,
  Share,
  ContentCopy,
  Star,
  StarBorder,
  Inventory,
  ShoppingCart,
  TrendingUp,
  CalendarToday,
  Category,
  AttachMoney,
  Scale,
  Straighten,
  ToggleOn,
  ToggleOff,
  Refresh,
  Warning,
  CheckCircle,
  Info,
  Timeline,
  Analytics,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/store/auth.store";
import { productsService } from "@/services/products.service";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

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

function ProductDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const productId = parseInt(params.id as string);

  const [selectedTab, setSelectedTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stockUpdateDialog, setStockUpdateDialog] = useState(false);
  const [newStockQuantity, setNewStockQuantity] = useState(0);

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

  const handleDeleteProduct = () => {
    deleteProductMutation.mutate();
    setDeleteDialogOpen(false);
  };

  const handleStockUpdate = () => {
    updateStockMutation.mutate(newStockQuantity);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/products/${
      product.slug || product.id
    }`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Product URL copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
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
    return <LoadingSpinner fullHeight message="Loading product details..." />;
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

  const analyticsData = {
    views: 1250,
    sales: 47,
    revenue: product.price * 47,
    conversionRate: 3.76,
    averageRating: 4.5,
    totalReviews: 23,
  };

  const activityData = [
    {
      id: 1,
      action: "Stock updated",
      details: `Stock changed from 45 to ${product.stock_quantity}`,
      timestamp: "2024-01-15T10:30:00Z",
      user: "Admin User",
    },
    {
      id: 2,
      action: "Price updated",
      details: `Price changed to ${formatPrice(product.price)}`,
      timestamp: "2024-01-14T15:20:00Z",
      user: "Admin User",
    },
    {
      id: 3,
      action: "Product created",
      details: "Product added to catalog",
      timestamp: product.created_at,
      user: "Admin User",
    },
  ];

  console.log(product.stock_quantity)

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
            Product Details
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => refetch()}
          >
            Refresh
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
            variant="contained"
            startIcon={<Edit />}
            onClick={() => router.push(`/admin/products/${product.id}/edit`)}
          >
            Edit Product
          </Button>
        </Box>

        {/* Product Header Info */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "grey.100",
                }}
              >
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={120}
                    height={120}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "grey.200",
                      color: "text.secondary",
                    }}
                  >
                    <Typography variant="body2">No Image</Typography>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {product.name}
                </Typography>
                {product.is_featured && (
                  <Chip
                    icon={<Star />}
                    label="Featured"
                    color="warning"
                    variant="filled"
                  />
                )}
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                ID: {product.id} • Category:{" "}
                {product.category_name || "Uncategorized"}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip
                  label={getStatusText(product)}
                  color={getStatusColor(product)}
                />
                <Chip
                  label={product.is_active ? "Active" : "Inactive"}
                  color={product.is_active ? "success" : "error"}
                  variant="outlined"
                />
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="h4"
                  color="primary.main"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  {formatPrice(product.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.stock_quantity} units in stock
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <Visibility />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {analyticsData.views.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Views
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    bgcolor: "success.main",
                    color: "white",
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <ShoppingCart />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {analyticsData.sales}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Units Sold
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    bgcolor: "warning.main",
                    color: "white",
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <AttachMoney />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {formatPrice(analyticsData.revenue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    bgcolor: "info.main",
                    color: "white",
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <TrendingUp />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {analyticsData.conversionRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conversion Rate
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ borderRadius: 2 }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
          >
            <Tab icon={<Info />} iconPosition="start" label="Details" />
            <Tab icon={<Analytics />} iconPosition="start" label="Analytics" />
            <Tab icon={<Timeline />} iconPosition="start" label="Activity" />
          </Tabs>
        </Box>

        {/* Details Tab */}
        <TabPanel value={selectedTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Product Information */}
                <Card>
                  <CardHeader title="Product Information" />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          Description
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {product.description || "No description available"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          Specifications
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <Scale />
                            </ListItemIcon>
                            <ListItemText
                              primary="Weight"
                              secondary={
                                product.weight
                                  ? `${product.weight} kg`
                                  : "Not specified"
                              }
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <Straighten />
                            </ListItemIcon>
                            <ListItemText
                              primary="Dimensions"
                              secondary={product.dimensions || "Not specified"}
                            />
                          </ListItem>
                        </List>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          Pricing & Stock
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <AttachMoney />
                            </ListItemIcon>
                            <ListItemText
                              primary="Price"
                              secondary={formatPrice(product.price)}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <Inventory />
                            </ListItemIcon>
                            <ListItemText
                              primary="Stock Quantity"
                              secondary={`${product.stock_quantity} units`}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <Category />
                            </ListItemIcon>
                            <ListItemText
                              primary="Category"
                              secondary={
                                product.category_name || "Uncategorized"
                              }
                            />
                          </ListItem>
                        </List>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Customer Reviews */}
                <Card>
                  <CardHeader title="Customer Reviews" />
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Rating value={analyticsData.averageRating} readOnly />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {analyticsData.averageRating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({analyticsData.totalReviews} reviews)
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Review management functionality coming soon
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Quick Actions */}
                <Card>
                  <CardHeader title="Quick Actions" />
                  <CardContent>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() =>
                          router.push(`/admin/products/${product.id}/edit`)
                        }
                        fullWidth
                      >
                        Edit Product
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Inventory />}
                        onClick={() => setStockUpdateDialog(true)}
                        fullWidth
                      >
                        Update Stock
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Share />}
                        onClick={handleShare}
                        fullWidth
                      >
                        Share Product
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<ContentCopy />}
                        onClick={() =>
                          toast.info("Duplicate functionality coming soon")
                        }
                        fullWidth
                      >
                        Duplicate Product
                      </Button>
                    </Box>
                  </CardContent>
                </Card>

                {/* Product Status */}
                <Card>
                  <CardHeader title="Product Status" />
                  <CardContent>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2">Active Status</Typography>
                        <IconButton
                          color={product.is_active ? "success" : "error"}
                        >
                          {product.is_active ? <ToggleOn /> : <ToggleOff />}
                        </IconButton>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2">Featured</Typography>
                        <IconButton
                          color={product.is_featured ? "warning" : "default"}
                        >
                          {product.is_featured ? <Star /> : <StarBorder />}
                        </IconButton>
                      </Box>

                      {product.stock_quantity <= 5 && (
                        <Alert
                          severity={
                            product.stock_quantity === 0 ? "error" : "warning"
                          }
                        >
                          {product.stock_quantity === 0
                            ? "Product is out of stock"
                            : `Low stock: ${product.stock_quantity} units remaining`}
                        </Alert>
                      )}
                    </Box>
                  </CardContent>
                </Card>

                {/* Product Metadata */}
                <Card>
                  <CardHeader title="Product Metadata" />
                  <CardContent>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CalendarToday />
                        </ListItemIcon>
                        <ListItemText
                          primary="Created"
                          secondary={new Date(
                            product.created_at
                          ).toLocaleString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CalendarToday />
                        </ListItemIcon>
                        <ListItemText
                          primary="Last Updated"
                          secondary={new Date(
                            product.updated_at
                          ).toLocaleString()}
                        />
                      </ListItem>
                    </List>
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
                      Permanently delete this product. This action cannot be
                      undone.
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => setDeleteDialogOpen(true)}
                      fullWidth
                    >
                      Delete Product
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={selectedTab} index={1}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Product Analytics
            </Typography>
            <Alert severity="info">
              Detailed analytics functionality is coming soon. This will include
              sales trends, customer behavior, and performance metrics.
            </Alert>
          </Box>
        </TabPanel>

        {/* Activity Tab */}
        <TabPanel value={selectedTab} index={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Activity History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Action</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activityData.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {activity.action}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {activity.details}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{activity.user}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(activity.timestamp).toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>
      </Paper>

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
    </Box>
  );
}

export default function AdminProductDetailsPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ProductDetailsContent />
      </AdminLayout>
    </AdminGuard>
  );
}
