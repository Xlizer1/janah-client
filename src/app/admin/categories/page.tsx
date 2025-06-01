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
  Sort,
  Category as CategoryIcon,
  Refresh,
  GetApp,
  CloudUpload,
  ToggleOn,
  ToggleOff,
  DragIndicator,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/store/auth.store";
import { categoriesService } from "@/services/categories.service";
import type { CategoryFilters, Category } from "@/types";

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

function CategoriesManagementContent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<CategoryFilters>({
    page: 1,
    limit: 10,
    include_inactive: true,
  });

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories
  const {
    data: categoriesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminCategories", filters],
    queryFn: () => categoriesService.getCategories(filters),
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: categoriesService.admin.deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      setDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
  });

  // Search categories
  const { data: searchResults } = useQuery({
    queryKey: ["searchCategories", searchQuery],
    queryFn: () => categoriesService.searchCategories(searchQuery),
    enabled: searchQuery.length >= 2,
  });

  const handleFilterChange = (newFilters: Partial<CategoryFilters>) => {
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
    categoryId: number
  ) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedCategoryId(categoryId);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedCategoryId(null);
  };

  const handleCategoryAction = (
    action: "view" | "edit" | "delete" | "duplicate"
  ) => {
    if (!selectedCategoryId) return;

    switch (action) {
      case "view":
        router.push(`/categories/${getCategory(selectedCategoryId)?.slug}`);
        break;
      case "edit":
        router.push(`/admin/categories/${selectedCategoryId}/edit`);
        break;
      case "delete":
        setDeleteDialogOpen(true);
        break;
      case "duplicate":
        toast.info("Category duplication coming soon");
        break;
    }
    handleActionMenuClose();
  };

  const handleDeleteCategory = () => {
    if (selectedCategoryId) {
      deleteCategoryMutation.mutate(selectedCategoryId);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allCategoryIds =
        categoriesData?.categories.map((category) => category.id) || [];
      setSelectedCategories(allCategoryIds);
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCategory = (id: number) => {
    return categoriesData?.categories.find((cat) => cat.id === id);
  };

  const displayCategories =
    searchQuery.length >= 2
      ? searchResults?.categories || []
      : categoriesData?.categories || [];

  if (isLoading) {
    return <LoadingSpinner message="Loading categories..." />;
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load categories. Please try again.
      </Alert>
    );
  }

  const pagination = categoriesData?.pagination;

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
            Category Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your product categories and organization
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["adminCategories"] })
            }
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<Sort />}
            onClick={() => toast.info("Sort management coming soon")}
          >
            Manage Order
          </Button>
          <Link href="/admin/categories/create">
            <Button variant="contained" startIcon={<Add />}>
              Add Category
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
                  <CategoryIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {categoriesData?.pagination?.total || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Categories
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
                  <ToggleOn />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {displayCategories.filter((c) => c.is_active).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Categories
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
                  <ToggleOff />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {displayCategories.filter((c) => !c.is_active).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inactive Categories
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
                <Avatar sx={{ bgcolor: "info.main" }}>
                  <CategoryIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {displayCategories.reduce(
                      (sum, cat) => sum + (cat.product_count || 0),
                      0
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Products
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.include_inactive ? "all" : "active"}
                label="Status"
                onChange={(e) =>
                  handleFilterChange({
                    include_inactive: e.target.value === "all",
                  })
                }
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="active">Active Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Per Page</InputLabel>
              <Select
                value={filters.limit}
                label="Per Page"
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
      {selectedCategories.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "primary.50" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {selectedCategories.length} categories selected
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => toast.info("Bulk actions coming soon")}
            >
              Bulk Activate
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => toast.info("Bulk actions coming soon")}
            >
              Bulk Deactivate
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setSelectedCategories([])}
            >
              Clear Selection
            </Button>
          </Box>
        </Paper>
      )}

      {/* Categories Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedCategories.length > 0 &&
                    selectedCategories.length < displayCategories.length
                  }
                  checked={
                    displayCategories.length > 0 &&
                    selectedCategories.length === displayCategories.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <DragIndicator sx={{ color: "action.disabled" }} />
                  Order
                </Box>
              </TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayCategories.map((category) => (
              <TableRow key={category.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleSelectCategory(category.id)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    #{category.sort_order}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: category.image_url
                          ? "transparent"
                          : `hsl(${(category.id * 137.5) % 360}, 70%, 60%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <CategoryIcon />
                      )}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {category.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {category.slug}
                      </Typography>
                      {category.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {category.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={category.is_active ? "Active" : "Inactive"}
                    color={category.is_active ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {category.product_count || 0} products
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(category.created_at).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="More actions">
                    <IconButton
                      onClick={(e) => handleActionMenuOpen(e, category.id)}
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
      {pagination && pagination.totalPages > 1 && !searchQuery && (
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
        aria-label="add category"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => router.push("/admin/categories/create")}
      >
        <Add />
      </Fab>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={() => handleCategoryAction("view")}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Category</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleCategoryAction("edit")}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Category</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleCategoryAction("duplicate")}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleCategoryAction("delete")}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

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
            Are you sure you want to delete "
            {getCategory(selectedCategoryId || 0)?.name}"?
            {getCategory(selectedCategoryId || 0)?.product_count &&
              getCategory(selectedCategoryId || 0)!.product_count > 0 && (
                <span>
                  {" "}
                  This category contains{" "}
                  {getCategory(selectedCategoryId || 0)?.product_count} products
                  that will be moved to "Uncategorized".
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
    </Box>
  );
}

export default function AdminCategoriesPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <CategoriesManagementContent />
      </AdminLayout>
    </AdminGuard>
  );
}
