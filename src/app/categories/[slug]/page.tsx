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
} from "@mui/material";
import {
  NavigateNext,
  Category as CategoryIcon,
  GridView,
  ViewList,
  FilterList,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

import { MainLayout } from "@/components/layout/MainLayout";
import { ProductCard } from "@/components/products/ProductCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { categoriesService } from "@/services/categories.service";
import { productsService } from "@/services/products.service";
import type { ProductFilters } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

export default function CategoryDetailPage() {
  const params = useParams();
    const { t } = useTranslation();
  const slug = params.slug as string;

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    sort_by: "created_at",
    sort_order: "DESC",
  });

  // Fetch category details
  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => categoriesService.getCategory(slug),
  });

  // Fetch products in this category
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["categoryProducts", slug, filters],
    queryFn: () =>
      categoryData?.category
        ? productsService.getProductsByCategory(
            categoryData.category.id,
            filters
          )
        : null,
    enabled: !!categoryData?.category,
  });

  const category = categoryData?.category;
  const products = productsData?.products || [];
  const pagination = productsData?.pagination;

  const handleSortChange = (value: string) => {
    const [sort_by, sort_order] = value.split("_");
    setFilters((prev) => ({
      ...prev,
      sort_by: sort_by as any,
      sort_order: sort_order as any,
      page: 1,
    }));
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const sortOptions = [
    { value: "created_at_DESC", label: "Newest First" },
    { value: "created_at_ASC", label: "Oldest First" },
    { value: "name_ASC", label: "Name A-Z" },
    { value: "name_DESC", label: "Name Z-A" },
    { value: "price_ASC", label: "Price Low to High" },
    { value: "price_DESC", label: "Price High to Low" },
  ];

  if (categoryLoading) {
    return (
      <MainLayout>
        <LoadingSpinner fullHeight message="Loading category..." />
      </MainLayout>
    );
  }

  if (!category) {
    return (
      <MainLayout>
        <Container sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Category not found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The category you're looking for doesn't exist or has been removed.
          </Typography>
          <Link href="/categories">
            <Button variant="contained">Browse Categories</Button>
          </Link>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 4 }}
        >
          <Link href="/">
            <Typography color="text.secondary" sx={{ cursor: "pointer" }}>
            {t("nav.products")}
            </Typography>
          </Link>
          <Link href="/categories">
            <Typography color="text.secondary" sx={{ cursor: "pointer" }}>
              Categories
            </Typography>
          </Link>
          <Typography color="primary.main">{category.name}</Typography>
        </Breadcrumbs>

        {/* Category Header */}
        <Paper sx={{ mb: 4, overflow: "hidden", borderRadius: 3 }}>
          <Box
            sx={{
              position: "relative",
              height: 200,
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Background Image */}
            {category.image_url ? (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  style={{ objectFit: "cover", opacity: 0.3 }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(135deg, hsl(${
                    (category.id * 137.5) % 360
                  }, 70%, 60%) 0%, hsl(${
                    (category.id * 137.5 + 60) % 360
                  }, 70%, 40%) 100%)`,
                  opacity: 0.1,
                }}
              />
            )}

            {/* Content */}
            <Container sx={{ position: "relative", zIndex: 1 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <CategoryIcon
                      sx={{ fontSize: 32, color: "primary.main" }}
                    />
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        background:
                          "linear-gradient(45deg, #0ea5e9 30%, #3b82f6 90%)",
                        backgroundClip: "text",
                        textFillColor: "transparent",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {category.name}
                    </Typography>
                  </Box>

                  {category.description && (
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {category.description}
                    </Typography>
                  )}

                  <Chip
                    label={`${category.product_count || 0} Products Available`}
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Paper>

        {/* Products Section */}
        <Box>
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
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {pagination ? `${pagination.total} Products` : "Products"}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Sort */}
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={`${filters.sort_by}_${filters.sort_order}`}
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

              {/* View Mode */}
              <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
                <Button
                  variant={viewMode === "grid" ? "contained" : "outlined"}
                  onClick={() => setViewMode("grid")}
                  sx={{ minWidth: "auto", p: 1 }}
                >
                  <GridView />
                </Button>
                <Button
                  variant={viewMode === "list" ? "contained" : "outlined"}
                  onClick={() => setViewMode("list")}
                  sx={{ minWidth: "auto", p: 1 }}
                >
                  <ViewList />
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Products Grid */}
          {productsLoading ? (
            <LoadingSpinner message="Loading products..." />
          ) : products.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {products.map((product) => (
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
              {pagination && pagination.totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                  <Pagination
                    count={pagination.totalPages}
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
              <CategoryIcon sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                No products in this category
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                This category is currently empty. Check back later for new
                products!
              </Typography>
              <Link href="/categories">
                <Button variant="outlined">Browse Other Categories</Button>
              </Link>
            </Box>
          )}
        </Box>

        {/* Related Categories */}
        {products.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Explore More Categories
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={2}>
                <Link href="/categories/electronics">
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      borderRadius: 2,
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Electronics
                    </Typography>
                  </Paper>
                </Link>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Link href="/categories/computers">
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      borderRadius: 2,
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Computers
                    </Typography>
                  </Paper>
                </Link>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Link href="/categories/smartphones">
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      borderRadius: 2,
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Smartphones
                    </Typography>
                  </Paper>
                </Link>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </MainLayout>
  );
}
