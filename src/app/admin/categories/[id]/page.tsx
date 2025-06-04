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
  Alert,
  Tabs,
  Tab,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Delete,
  Visibility,
  Share,
  ContentCopy,
  Inventory,
  TrendingUp,
  CalendarToday,
  Category as CategoryIcon,
  AttachMoney,
  ToggleOn,
  ToggleOff,
  Refresh,
  Warning,
  CheckCircle,
  Timeline,
  Analytics,
  Add,
  BarChart,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/store/auth.store";
import { categoriesService } from "@/services/categories.service";
import { productsService } from "@/services/products.service";
import { useTranslation } from "@/hooks/useTranslation";

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

function CategoryDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const categoryId = parseInt(params.id as string);

  const [selectedTab, setSelectedTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const { data: productsData } = useQuery({
    queryKey: ["categoryProducts", categoryId],
    queryFn: () =>
      productsService.getProductsByCategory(categoryId, { limit: 10 }),
    enabled: !!categoryId,
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

  const handleDeleteCategory = () => {
    deleteCategoryMutation.mutate();
    setDeleteDialogOpen(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/categories/${category.id}/view`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Category URL copied to clipboard");
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

  if (isLoading) {
    return <LoadingSpinner fullHeight message="Loading category details..." />;
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
  const products = productsData?.products || [];

  const analyticsData = {
    totalProducts: category.product_count || 0,
    activeProducts: products.filter((p) => p.is_active).length,
    inStockProducts: products.filter((p) => p.stock_quantity > 0).length,
    avgPrice:
      products.length > 0
        ? products.reduce((sum, p) => sum + p.price, 0) / products.length
        : 0,
    totalValue: products.reduce(
      (sum, p) => sum + p.price * p.stock_quantity,
      0
    ),
    lowStockProducts: products.filter(
      (p) => p.stock_quantity <= 5 && p.stock_quantity > 0
    ).length,
  };

  const activityData = [
    {
      id: 1,
      action: "Category Updated",
      details: "Description modified",
      timestamp: category.updated_at,
      user: "Admin User",
      type: "info",
    },
    {
      id: 2,
      action: "Product Added",
      details: "New product added to category",
      timestamp: category.updated_at,
      user: "Admin User",
      type: "success",
    },
    {
      id: 3,
      action: "Category Created",
      details: "Category was created",
      timestamp: category.created_at,
      user: "Admin User",
      type: "info",
    },
  ];

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
            Category Details
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
              window.open(`/admin/categories/${category.id}/view`, "_blank")
            }
          >
            View Live
          </Button>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => router.push(`/admin/categories/${category.id}/edit`)}
          >
            Edit Category
          </Button>
        </Box>

        {/* Category Header Card */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: category.image_url
                    ? "transparent"
                    : `hsl(${(category.id * 137.5) % 360}, 70%, 60%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    width={120}
                    height={120}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <CategoryIcon sx={{ fontSize: 48 }} />
                )}
              </Box>
            </Grid>
            <Grid item xs>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {category.name}
                </Typography>
                <Chip
                  label={category.is_active ? "Active" : "Inactive"}
                  color={category.is_active ? "success" : "error"}
                />
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                ID: {category.id} • Slug: {category.slug} • Sort Order:{" "}
                {category.sort_order}
              </Typography>
              {category.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {category.description}
                </Typography>
              )}
            </Grid>
            <Grid item>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="h4"
                  color="primary.main"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  {analyticsData.totalProducts}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Products
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
                    bgcolor: "success.main",
                    color: "white",
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <CheckCircle />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {analyticsData.activeProducts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Products
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
                    bgcolor: "primary.main",
                    color: "white",
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <Inventory />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {analyticsData.inStockProducts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Stock
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
                    {formatPrice(analyticsData.avgPrice)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Price
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
                    {formatPrice(analyticsData.totalValue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Value
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
            <Tab
              icon={<CategoryIcon />}
              iconPosition="start"
              label="Overview"
            />
            <Tab icon={<Inventory />} iconPosition="start" label="Products" />
            <Tab icon={<Analytics />} iconPosition="start" label="Analytics" />
            <Tab icon={<Timeline />} iconPosition="start" label="Activity" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={selectedTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Category Information */}
                <Card>
                  <CardHeader title="Category Information" />
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
                          {category.description || "No description available"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          Details
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <CategoryIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Category ID"
                              secondary={category.id}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <Timeline />
                            </ListItemIcon>
                            <ListItemText
                              primary="URL Slug"
                              secondary={category.slug}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <BarChart />
                            </ListItemIcon>
                            <ListItemText
                              primary="Sort Order"
                              secondary={category.sort_order}
                            />
                          </ListItem>
                        </List>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          Statistics
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <Inventory />
                            </ListItemIcon>
                            <ListItemText
                              primary="Total Products"
                              secondary={`${analyticsData.totalProducts} products`}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircle />
                            </ListItemIcon>
                            <ListItemText
                              primary="Active Products"
                              secondary={`${analyticsData.activeProducts} active`}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <AttachMoney />
                            </ListItemIcon>
                            <ListItemText
                              primary="Average Price"
                              secondary={formatPrice(analyticsData.avgPrice)}
                            />
                          </ListItem>
                        </List>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader title="Quick Statistics" />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h4"
                            color="success.main"
                            sx={{ fontWeight: 700 }}
                          >
                            {analyticsData.activeProducts}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Active Products
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h4"
                            color="primary.main"
                            sx={{ fontWeight: 700 }}
                          >
                            {analyticsData.inStockProducts}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            In Stock
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h4"
                            color="warning.main"
                            sx={{ fontWeight: 700 }}
                          >
                            {analyticsData.lowStockProducts}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Low Stock
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
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
                          router.push(`/admin/categories/${category.id}/edit`)
                        }
                        fullWidth
                      >
                        Edit Category
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() =>
                          router.push(
                            `/admin/products/create?category=${category.id}`
                          )
                        }
                        fullWidth
                      >
                        Add Product
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Share />}
                        onClick={handleShare}
                        fullWidth
                      >
                        Share Category
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<ContentCopy />}
                        onClick={() =>
                          toast.info("Duplicate functionality coming soon")
                        }
                        fullWidth
                      >
                        Duplicate Category
                      </Button>
                    </Box>
                  </CardContent>
                </Card>

                {/* Category Status */}
                <Card>
                  <CardHeader title="Category Status" />
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
                          color={category.is_active ? "success" : "error"}
                        >
                          {category.is_active ? <ToggleOn /> : <ToggleOff />}
                        </IconButton>
                      </Box>

                      {analyticsData.lowStockProducts > 0 && (
                        <Alert severity="warning">
                          {analyticsData.lowStockProducts} products have low
                          stock
                        </Alert>
                      )}
                    </Box>
                  </CardContent>
                </Card>

                {/* Category Metadata */}
                <Card>
                  <CardHeader title="Category Metadata" />
                  <CardContent>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CalendarToday />
                        </ListItemIcon>
                        <ListItemText
                          primary="Created"
                          secondary={new Date(
                            category.created_at
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
                            category.updated_at
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
                      Permanently delete this category. Products will be moved
                      to "Uncategorized".
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
        </TabPanel>

        {/* Products Tab */}
        <TabPanel value={selectedTab} index={1}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Category Products
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() =>
                  router.push(`/admin/products/create?category=${category.id}`)
                }
              >
                Add Product
              </Button>
            </Box>

            {products.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.slice(0, 10).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                overflow: "hidden",
                                bgcolor: "grey.100",
                              }}
                            >
                              {product.image_url ? (
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  width={40}
                                  height={40}
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
                                  }}
                                >
                                  <Inventory sx={{ fontSize: 16 }} />
                                </Box>
                              )}
                            </Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600 }}
                            >
                              {product.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatPrice(product.price)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography variant="body2">
                              {product.stock_quantity}
                            </Typography>
                            {product.stock_quantity <= 5 && (
                              <Warning
                                sx={{ fontSize: 16, color: "warning.main" }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={product.is_active ? "Active" : "Inactive"}
                            color={product.is_active ? "success" : "error"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() =>
                              router.push(`/admin/products/${product.id}`)
                            }
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Inventory sx={{ fontSize: 64, color: "grey.300", mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  No products in this category
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Add products to this category to get started.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() =>
                    router.push(
                      `/admin/products/create?category=${category.id}`
                    )
                  }
                >
                  Add First Product
                </Button>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={selectedTab} index={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Category Analytics
            </Typography>
            <Alert severity="info">
              Detailed analytics functionality is coming soon. This will include
              sales trends, product performance, and category insights.
            </Alert>
          </Box>
        </TabPanel>

        {/* Activity Tab */}
        <TabPanel value={selectedTab} index={3}>
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
            Are you sure you want to delete "{category.name}"? This will
            permanently remove the category and move all products to
            "Uncategorized".
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
    </Box>
  );
}

export default function AdminCategoryDetailsPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <CategoryDetailsContent />
      </AdminLayout>
    </AdminGuard>
  );
}
