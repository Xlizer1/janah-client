"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Checkbox,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  Grid,
  Card,
  CardContent,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Fab,
} from "@mui/material";
import {
  Search,
  FilterList,
  MoreVert,
  Add,
  Edit,
  Visibility,
  Delete,
  ContentCopy,
  Star,
  StarBorder,
  Inventory,
  Warning,
  CheckCircle,
  Refresh,
  GetApp,
  CloudUpload,
  ToggleOn,
  ToggleOff,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/store/auth.store";
import { productsService } from "@/services/products.service";
import { categoriesService } from "@/services/categories.service";
import type { ProductFilters, Product } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingSpinner fullHeight />;
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <Box sx={{ p: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          {t("admin.accessDenied")}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {t("admin.noPermission")}
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}

function ProductsManagementContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10,
    is_active: undefined,
  });

  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [bulkActionDialog, setBulkActionDialog] = useState<{
    open: boolean;
    action: "activate" | "deactivate" | "delete" | null;
  }>({ open: false, action: null });

  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminProducts", filters],
    queryFn: () => productsService.admin.getAllProducts(filters),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getCategories(),
  });

  const deleteProductMutation = useMutation({
    mutationFn: productsService.admin.deleteProduct,
    onSuccess: () => {
      toast.success(t("admin.success"));
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("admin.error"));
    },
  });

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleActionMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    productId: number
  ) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedProductId(productId);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedProductId(null);
  };

  const handleProductAction = (
    action: "view" | "edit" | "delete" | "duplicate" | "toggle_featured"
  ) => {
    if (!selectedProductId) return;

    switch (action) {
      case "view":
        router.push(`/admin/products/${selectedProductId}`);
        break;
      case "edit":
        router.push(`/admin/products/${selectedProductId}/edit`);
        break;
      case "delete":
        if (confirm("Are you sure you want to delete this product?")) {
          deleteProductMutation.mutate(selectedProductId);
        }
        break;
      case "duplicate":
        toast.info(t("admin.comingSoon"));
        break;
      case "toggle_featured":
        toast.info(t("admin.comingSoon"));
        break;
    }
    handleActionMenuClose();
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allProductIds =
        productsData?.products.map((product) => product.id) || [];
      setSelectedProducts(allProductIds);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkAction = (action: "activate" | "deactivate" | "delete") => {
    if (selectedProducts.length === 0) {
      toast.error("Please select products first");
      return;
    }
    setBulkActionDialog({ open: true, action });
  };

  const confirmBulkAction = () => {
    toast.info(t("admin.comingSoon"));
    setBulkActionDialog({ open: false, action: null });
  };

  const getStatusColor = (product: Product) => {
    if (!product.is_active) return "error";
    if (product.stock_quantity === 0) return "warning";
    if (product.stock_quantity <= 5) return "info";
    return "success";
  };

  const getStatusText = (product: Product) => {
    if (!product.is_active) return t("admin.products.inactive");
    if (product.stock_quantity === 0) return t("products.outOfStock");
    if (product.stock_quantity <= 5) return t("products.lowStock");
    return t("products.inStock");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "IQD",
    }).format(price);
  };

  if (isLoading) {
    return <LoadingSpinner message={t("admin.loading")} />;
  }

  if (error) {
    return <Alert severity="error">{t("admin.error")}</Alert>;
  }

  const products = productsData?.products || [];
  const pagination = productsData?.pagination;

  return (
    <Box>
      {/* Page Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {t("admin.products.management")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("admin.products.subtitle")}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={() => toast.info(t("admin.comingSoon"))}
          >
            {t("admin.products.export")}
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={() => toast.info(t("admin.comingSoon"))}
          >
            {t("admin.products.import")}
          </Button>
          <Link href="/admin/products/create">
            <Button variant="contained" startIcon={<Add />}>
              {t("admin.products.addProduct")}
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <Inventory />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {pagination?.total || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.products.totalProducts")}
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
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {
                      products.filter(
                        (p) => p.is_active && p.stock_quantity > 0
                      ).length
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.products.inStock")}
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
                <Avatar sx={{ bgcolor: "warning.main" }}>
                  <Warning />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {
                      products.filter(
                        (p) => p.stock_quantity <= 5 && p.stock_quantity > 0
                      ).length
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.products.lowStock")}
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
                <Avatar sx={{ bgcolor: "#fbbf24" }}>
                  <Star />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {products.filter((p) => p.is_featured).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.products.featured")}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder={t("search.searchProducts")}
              value={filters.search || ""}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t("common.category")}</InputLabel>
              <Select
                value={filters.category_id || ""}
                label={t("common.category")}
                onChange={(e) =>
                  handleFilterChange({
                    category_id: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              >
                <MenuItem value="">
                  {t("admin.products.allCategories")}
                </MenuItem>
                {categoriesData?.categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t("common.status")}</InputLabel>
              <Select
                value={
                  filters.is_active !== undefined
                    ? filters.is_active.toString()
                    : ""
                }
                label={t("common.status")}
                onChange={(e) =>
                  handleFilterChange({
                    is_active:
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true",
                  })
                }
              >
                <MenuItem value="">{t("admin.products.allStatus")}</MenuItem>
                <MenuItem value="true">{t("admin.products.active")}</MenuItem>
                <MenuItem value="false">
                  {t("admin.products.inactive")}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Featured</InputLabel>
              <Select
                value={
                  filters.is_featured !== undefined
                    ? filters.is_featured.toString()
                    : ""
                }
                label="Featured"
                onChange={(e) =>
                  handleFilterChange({
                    is_featured:
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true",
                  })
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Featured</MenuItem>
                <MenuItem value="false">Not Featured</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t("admin.products.perPage")}</InputLabel>
              <Select
                value={filters.limit}
                label={t("admin.products.perPage")}
                onChange={(e) =>
                  handleFilterChange({ limit: e.target.value as number })
                }
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "primary.50" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {selectedProducts.length} {t("admin.products.selected")}
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleBulkAction("activate")}
            >
              {t("admin.products.bulkActivate")}
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleBulkAction("deactivate")}
            >
              {t("admin.products.bulkDeactivate")}
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleBulkAction("delete")}
            >
              {t("admin.products.bulkDelete")}
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setSelectedProducts([])}
            >
              {t("admin.products.clearSelection")}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedProducts.length > 0 &&
                    selectedProducts.length < products.length
                  }
                  checked={
                    products.length > 0 &&
                    selectedProducts.length === products.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>{t("admin.products.productName")}</TableCell>
              <TableCell>{t("common.category")}</TableCell>
              <TableCell>{t("common.price")}</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>{t("common.status")}</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>{t("common.date")}</TableCell>
              <TableCell align="right">{t("common.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: "grey.100",
                        flexShrink: 0,
                      }}
                    >
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={60}
                          height={60}
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
                          <Typography variant="caption">
                            {t("admin.products.noImage")}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {product.name}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={product.category_name || "Uncategorized"}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatPrice(product.price)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2">
                      {product.stock_quantity}
                    </Typography>
                    {product.stock_quantity <= 5 && (
                      <Warning sx={{ fontSize: 16, color: "warning.main" }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(product)}
                    color={getStatusColor(product)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {product.is_featured ? (
                    <Star sx={{ color: "#fbbf24" }} />
                  ) : (
                    <StarBorder sx={{ color: "grey.400" }} />
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(product.created_at).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title={t("admin.moreActions")}>
                    <IconButton
                      onClick={(e) => handleActionMenuOpen(e, product.id)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add product"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => router.push("/admin/products/create")}
      >
        <Add />
      </Fab>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={() => handleProductAction("view")}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("admin.products.viewDetails")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleProductAction("edit")}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("admin.products.editProduct")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleProductAction("duplicate")}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("admin.products.duplicate")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleProductAction("toggle_featured")}>
          <ListItemIcon>
            <Star fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("admin.products.toggleFeatured")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleProductAction("delete")}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("common.delete")}</ListItemText>
        </MenuItem>
      </Menu>

      {/* Bulk Action Dialog */}
      <Dialog
        open={bulkActionDialog.open}
        onClose={() => setBulkActionDialog({ open: false, action: null })}
      >
        <DialogTitle>
          {t("admin.products.confirmBulkAction", {
            action: bulkActionDialog.action,
          })}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {t("admin.products.bulkActionQuestion", {
              action: bulkActionDialog.action,
              count: selectedProducts.length,
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setBulkActionDialog({ open: false, action: null })}
          >
            {t("common.cancel")}
          </Button>
          <Button onClick={confirmBulkAction} variant="contained">
            {t("common.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function AdminProductsPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ProductsManagementContent />
      </AdminLayout>
    </AdminGuard>
  );
}
