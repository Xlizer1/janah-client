"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  Breadcrumbs,
} from "@mui/material";
import {
  Search,
  Category as CategoryIcon,
  NavigateNext,
  TrendingUp,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { MainLayout } from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { categoriesService } from "@/services/categories.service";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all categories
  const { data, isLoading, error } = useQuery({
    queryKey: ["categoriesWithCounts"],
    queryFn: () => categoriesService.getCategoriesWithCounts(false),
  });

  const categories = data?.categories || [];

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (error) {
    return (
      <MainLayout>
        <Container sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            Failed to load categories. Please try again.
          </Typography>
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
              Home
            </Typography>
          </Link>
          <Typography color="primary.main">Categories</Typography>
        </Breadcrumbs>

        {/* Page Header */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: "linear-gradient(45deg, #0ea5e9 30%, #3b82f6 90%)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Shop by Category
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: "1.1rem", mb: 4 }}
          >
            Explore our wide range of product categories and find exactly what
            you're looking for
          </Typography>

          {/* Search Categories */}
          <Box sx={{ maxWidth: 500, mx: "auto" }}>
            <TextField
              fullWidth
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: "background.paper",
                },
              }}
            />
          </Box>
        </Box>

        {/* Loading State */}
        {isLoading && <LoadingSpinner message="Loading categories..." />}

        {/* Categories Grid */}
        {!isLoading && (
          <>
            {/* Stats */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CategoryIcon color="primary" sx={{ fontSize: 32 }} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {categories.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Categories Available
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <TrendingUp color="success" sx={{ fontSize: 32 }} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {categories.reduce(
                          (sum, cat) => sum + (cat.product_count || 0),
                          0
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Products
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body1" color="text.secondary">
                    {searchQuery
                      ? `Showing ${filteredCategories.length} results`
                      : "Browse all categories"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Categories Grid */}
            {filteredCategories.length > 0 ? (
              <Grid container spacing={3}>
                {filteredCategories.map((category) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                    <Link href={`/categories/${category.slug}`}>
                      <Card
                        sx={{
                          height: 320,
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                          transition: "all 0.3s ease",
                          borderRadius: 3,
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 16px 32px rgba(0,0,0,0.15)",
                            "& .category-content": {
                              transform: "translateY(-10px)",
                            },
                            "& .category-image": {
                              transform: "scale(1.1)",
                            },
                          },
                        }}
                      >
                        {/* Background Image */}
                        <Box
                          className="category-image"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            transition: "transform 0.3s ease",
                          }}
                        >
                          {category.image_url ? (
                            <Image
                              src={category.image_url}
                              alt={category.name}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",
                                background: `linear-gradient(135deg, hsl(${
                                  (category.id * 137.5) % 360
                                }, 70%, 60%) 0%, hsl(${
                                  (category.id * 137.5 + 60) % 360
                                }, 70%, 40%) 100%)`,
                              }}
                            />
                          )}
                        </Box>

                        {/* Overlay */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)",
                          }}
                        />

                        {/* Content */}
                        <CardContent
                          className="category-content"
                          sx={{
                            position: "relative",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            color: "white",
                            transition: "transform 0.3s ease",
                            p: 3,
                          }}
                        >
                          {/* Product Count Badge */}
                          <Box sx={{ alignSelf: "flex-start" }}>
                            <Chip
                              label={`${category.product_count || 0} Products`}
                              size="small"
                              sx={{
                                bgcolor: "rgba(255,255,255,0.2)",
                                color: "white",
                                backdropFilter: "blur(10px)",
                                fontWeight: 600,
                                fontSize: "0.75rem",
                              }}
                            />
                          </Box>

                          {/* Category Info */}
                          <Box>
                            <Typography
                              variant="h4"
                              sx={{
                                fontWeight: 700,
                                mb: 1,
                                fontSize: { xs: "1.5rem", md: "1.75rem" },
                                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                              }}
                            >
                              {category.name}
                            </Typography>

                            {category.description && (
                              <Typography
                                variant="body2"
                                sx={{
                                  opacity: 0.9,
                                  lineHeight: 1.5,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                                }}
                              >
                                {category.description}
                              </Typography>
                            )}

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mt: 2,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  opacity: 0.9,
                                }}
                              >
                                Explore Category →
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            ) : (
              /* No Results */
              <Box sx={{ textAlign: "center", py: 8 }}>
                <CategoryIcon sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {searchQuery
                    ? "No categories found"
                    : "No categories available"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchQuery
                    ? `No categories match "${searchQuery}". Try different search terms.`
                    : "Categories will appear here once they are added."}
                </Typography>
              </Box>
            )}

            {/* Popular Categories Section */}
            {!searchQuery && categories.length > 0 && (
              <Box sx={{ mt: 8 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Popular Categories
                </Typography>
                <Grid container spacing={2}>
                  {categories
                    .sort(
                      (a, b) => (b.product_count || 0) - (a.product_count || 0)
                    )
                    .slice(0, 6)
                    .map((category) => (
                      <Grid item xs={6} sm={4} md={2} key={category.id}>
                        <Link href={`/categories/${category.slug}`}>
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
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, mb: 1 }}
                            >
                              {category.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {category.product_count || 0} products
                            </Typography>
                          </Paper>
                        </Link>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            )}
          </>
        )}
      </Container>
    </MainLayout>
  );
}
