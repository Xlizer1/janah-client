"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Container,
  Grid,
  Box,
  Typography,
  Breadcrumbs,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton,
} from "@mui/material";
import {
  FilterList,
  ViewModule,
  ViewList,
  ChevronRight,
  Home,
  Category as CategoryIcon,
  Close,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

import { MainLayout } from "@/components/layout/MainLayout";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { productsService } from "@/services/products.service";
import { categoriesService } from "@/services/categories.service";
import type { ProductFilters as ProductFiltersType } from "@/types";

export default function CategoryViewPage() {
  const params = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Handle both ID and slug - determine which one it is
  const identifier = params.id as string;
  const isNumeric = /^\d+$/.test(identifier);

  const [filters, setFilters] = useState<ProductFiltersType>({
    page: 1,
    limit: 12,
    sort_by: "name",
    sort_order: "ASC",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Fetch category data - use appropriate service based on identifier type
  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ["category", identifier],
    queryFn: () => {
      if (isNumeric) {
        // It's an ID, use admin service or regular service
        return categoriesService.getCategory(parseInt(identifier));
      } else {
        // It's a slug, use regular service
        return categoriesService.getCategory(identifier);
      }
    },
    enabled: !!identifier,
  });

  // Fetch all categories for filter
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getCategories(),
  });

  const handleFilterChange = (newFilters: Partial<ProductFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (sortValue: string) => {
    const [sort_by, sort_order] = sortValue.split("-");
    setFilters((prev) => ({
      ...prev,
      sort_by: sort_by as any,
      sort_order: sort_order as "ASC" | "DESC",
      page: 1,
    }));
  };

  if (categoryLoading) {
    return (
      <MainLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <LoadingSpinner fullHeight message="Loading category..." />
        </Container>
      </MainLayout>
    );
  }

  if (categoryError || !categoryData?.category) {
    return (
      <MainLayout>
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="error" sx={{ mb: 2 }}>
              Category Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The category you're looking for doesn't exist or has been removed.
            </Typography>
            <Link href="/categories">
              <Button variant="contained">Browse All Categories</Button>
            </Link>
          </Box>
        </Container>
      </MainLayout>
    );
  }

  const category = categoryData.category;

  // Now fetch products using the category ID
  const { data: productsData } = useQuery({
    queryKey: ["categoryProducts", category.id, filters],
    queryFn: () => productsService.getProductsByCategory(category.id, filters),
    enabled: !!category.id,
  });

  const products = productsData?.products || [];
  const pagination = productsData?.pagination;

  const sortOptions = [
    { value: "name-ASC", label: "Name: A to Z" },
    { value: "name-DESC", label: "Name: Z to A" },
    { value: "price-ASC", label: "Price: Low to High" },
    { value: "price-DESC", label: "Price: High to Low" },
    { value: "created_at-DESC", label: "Newest First" },
    { value: "created_at-ASC", label: "Oldest First" },
  ];

  const currentSortValue = `${filters.sort_by}-${filters.sort_order}`;

  // Rest of the component remains the same...
  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<ChevronRight fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link href="/">
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Home fontSize="small" />
              <Typography variant="body2">Home</Typography>
            </Box>
          </Link>
          <Link href="/categories">
            <Typography variant="body2" color="primary.main">
              Categories
            </Typography>
          </Link>
          <Typography variant="body2" color="text.primary">
            {category.name}
          </Typography>
        </Breadcrumbs>

        {/* Category Header */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={4} alignItems="center">
            {category.image_url && (
              <Grid item xs={12} md={4} lg={3}>
                <Box
                  sx={{
                    width: "100%",
                    height: 240,
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "grey.100",
                    position: "relative",
                  }}
                >
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              </Grid>
            )}

            <Grid
              item
              xs={12}
              md={category.image_url ? 8 : 12}
              lg={category.image_url ? 9 : 12}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <CategoryIcon sx={{ fontSize: 32, color: "primary.main" }} />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.75rem", md: "2.25rem" },
                  }}
                >
                  {category.name}
                </Typography>
              </Box>

              {category.description && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2, fontSize: "1.1rem", lineHeight: 1.6 }}
                >
                  {category.description}
                </Typography>
              )}

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Chip
                  label={`${pagination?.total || 0} Products`}
                  color="primary"
                  variant="outlined"
                />
                {category.product_count && category.product_count > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Showing {products.length} of {pagination?.total} products
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Filters and Controls */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            {/* Left side - Filters */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {isMobile ? (
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setFiltersOpen(true)}
                >
                  Filters
                </Button>
              ) : (
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Filter Products
                </Typography>
              )}
            </Box>

            {/* Right side - Sort and View */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={currentSortValue}
                  label="Sort by"
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {!isMobile && (
                <Box
                  sx={{
                    display: "flex",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  <IconButton
                    onClick={() => setViewMode("grid")}
                    color={viewMode === "grid" ? "primary" : "default"}
                  >
                    <ViewModule />
                  </IconButton>
                  <IconButton
                    onClick={() => setViewMode("list")}
                    color={viewMode === "list" ? "primary" : "default"}
                  >
                    <ViewList />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Desktop Filters Sidebar */}
          {!isMobile && (
            <Grid item md={3}>
              <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Filters
                </Typography>
                <ProductFilters
                  filters={filters}
                  onFiltersChange={handleFilterChange}
                  categories={categoriesData?.categories || []}
                />
              </Paper>
            </Grid>
          )}

          {/* Products Grid */}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            {products.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {products.map((product) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={viewMode === "grid" ? 4 : 12}
                      lg={viewMode === "grid" ? 3 : 12}
                      key={product.id}
                    >
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 6 }}
                  >
                    <Pagination
                      count={pagination.totalPages}
                      page={pagination.page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  No products found
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  There are no products in this category matching your current
                  filters.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFilters({
                      page: 1,
                      limit: 12,
                      sort_by: "name",
                      sort_order: "ASC",
                    });
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Mobile Filters Drawer */}
        <Drawer
          anchor="right"
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          sx={{ "& .MuiDrawer-paper": { width: 320, p: 3 } }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters
            </Typography>
            <IconButton onClick={() => setFiltersOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <ProductFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            categories={categoriesData?.categories || []}
          />
        </Drawer>
      </Container>
    </MainLayout>
  );
}
