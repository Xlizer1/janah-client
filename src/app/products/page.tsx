// src/app/products/page.tsx
"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FilterList, GridView, ViewList, Clear } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

import { MainLayout } from "@/components/layout/MainLayout";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { productsService } from "@/services/products.service";
import type { ProductFilters as ProductFiltersType } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

function ProductsPageContent() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ProductFiltersType>({
    page: 1,
    limit: 12,
    category_id: searchParams.get("category")
      ? parseInt(searchParams.get("category")!)
      : undefined,
    search: searchParams.get("search") || undefined,
    is_featured: searchParams.get("featured") === "true" ? true : undefined,
    sort_by: (searchParams.get("sort_by") as any) || "created_at",
    sort_order: (searchParams.get("sort_order") as any) || "DESC",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => productsService.getProducts(filters),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productsService.getCategories(),
  });

  const handleFilterChange = (newFilters: Partial<ProductFiltersType>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSortChange = (value: string) => {
    const [sort_by, sort_order] = value.split("_");
    setFilters((prev) => ({
      ...prev,
      sort_by: sort_by as any,
      sort_order: sort_order as any,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sort_by: "created_at",
      sort_order: "DESC",
    });
  };

  const hasActiveFilters = !!(
    filters.category_id ||
    filters.search ||
    filters.is_featured ||
    filters.min_price ||
    filters.max_price
  );

  const sortOptions = [
    { value: "created_at_DESC", label: t("products.sortBy.newest") },
    { value: "created_at_ASC", label: t("products.sortBy.oldest") },
    { value: "name_ASC", label: t("products.sortBy.nameAsc") },
    { value: "name_DESC", label: t("products.sortBy.nameDesc") },
    { value: "price_ASC", label: t("products.sortBy.priceAsc") },
    { value: "price_DESC", label: t("products.sortBy.priceDesc") },
  ];

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Failed to load products. Please try again.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {t("products.title")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {data?.pagination.total
            ? `${data.pagination.total} products found`
            : t("common.loading")}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Filters Sidebar - Desktop */}
        {!isMobile && (
          <Grid item md={3}>
            <Paper sx={{ p: 3, position: "sticky", top: 100 }}>
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFilterChange}
                categories={categoriesData?.categories || []}
              />
            </Paper>
          </Grid>
        )}

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          {/* Toolbar */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Left side - Filters and active filter chips */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}
            >
              {/* Mobile Filter Button */}
              {isMobile && (
                <IconButton
                  onClick={() => setFiltersOpen(true)}
                  sx={{
                    bgcolor: "background.paper",
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <FilterList />
                </IconButton>
              )}

              {/* Active Filters */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {filters.category_id && (
                  <Chip
                    label={
                      categoriesData?.categories.find(
                        (c) => c.id === filters.category_id
                      )?.name || t("common.category")
                    }
                    onDelete={() =>
                      handleFilterChange({ category_id: undefined })
                    }
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.search && (
                  <Chip
                    label={`${t("common.search")}: ${filters.search}`}
                    onDelete={() => handleFilterChange({ search: undefined })}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.is_featured && (
                  <Chip
                    label={t("products.featured")}
                    onDelete={() =>
                      handleFilterChange({ is_featured: undefined })
                    }
                    color="primary"
                    variant="outlined"
                  />
                )}
                {hasActiveFilters && (
                  <Chip
                    label={t("common.clear")}
                    onClick={clearFilters}
                    color="default"
                    variant="outlined"
                    icon={<Clear />}
                  />
                )}
              </Box>
            </Box>

            {/* Right side - Sort and View */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Sort */}
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>{t("common.sort")}</InputLabel>
                <Select
                  value={`${filters.sort_by}_${filters.sort_order}`}
                  label={t("common.sort")}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* View Mode */}
              <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
                <IconButton
                  onClick={() => setViewMode("grid")}
                  color={viewMode === "grid" ? "primary" : "default"}
                >
                  <GridView />
                </IconButton>
                <IconButton
                  onClick={() => setViewMode("list")}
                  color={viewMode === "list" ? "primary" : "default"}
                >
                  <ViewList />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Products Grid */}
          {isLoading ? (
            <LoadingSpinner message={t("common.loading")} />
          ) : data?.products?.length ? (
            <>
              <Grid container spacing={3}>
                {data.products.map((product) => (
                  <Grid
                    item
                    xs={12}
                    sm={viewMode === "grid" ? 6 : 12}
                    md={viewMode === "grid" ? 4 : 12}
                    lg={viewMode === "grid" ? 3 : 12}
                    key={product.id}
                  >
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                  <Pagination
                    count={data.pagination.totalPages}
                    page={filters.page || 1}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t("products.noProducts")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("products.noProducts.subtitle")}
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="left"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            p: 3,
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          {t("products.filters")}
        </Typography>
        <ProductFilters
          filters={filters}
          onFiltersChange={handleFilterChange}
          categories={categoriesData?.categories || []}
        />
      </Drawer>
    </Container>
  );
}

export default function ProductsPage() {
  return (
    <MainLayout>
      <Suspense fallback={<LoadingSpinner fullHeight />}>
        <ProductsPageContent />
      </Suspense>
    </MainLayout>
  );
}
