"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { Search, Category, Inventory } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

import { MainLayout } from "@/components/layout/MainLayout";
import { ProductCard } from "@/components/products/ProductCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { searchService } from "@/services/search.service";

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

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [selectedTab, setSelectedTab] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");

  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["globalSearch", query],
    queryFn: () => searchService.globalSearch({ q: query, limit: 20 }),
    enabled: !!query,
  });

  if (!query) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Search sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 2 }}>
          No search query provided
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please enter a search term to find products and categories.
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">Failed to search. Please try again.</Alert>
      </Container>
    );
  }

  if (isLoading) {
    return <LoadingSpinner fullHeight message="Searching..." />;
  }

  const products = searchResults?.products?.items || [];
  const categories = searchResults?.categories?.items || [];
  const totalResults = searchResults?.total_results || 0;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const sortProducts = (products: any[], sortBy: string) => {
    const sorted = [...products];
    switch (sortBy) {
      case "price_asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price_desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "name_asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name_desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      default:
        return sorted; // relevance - keep original order
    }
  };

  const sortedProducts = sortProducts(products, sortBy);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Search Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Search Results
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            {totalResults} results for
          </Typography>
          <Chip
            label={`"${query}"`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </Box>

      {totalResults === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Search sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2 }}>
            No results found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We couldn't find anything for "{query}". Try different keywords or
            browse our categories.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Chip label="Electronics" variant="outlined" clickable />
            <Chip label="Smartphones" variant="outlined" clickable />
            <Chip label="Computers" variant="outlined" clickable />
            <Chip label="Accessories" variant="outlined" clickable />
          </Box>
        </Box>
      ) : (
        <Paper sx={{ borderRadius: 2 }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={selectedTab} onChange={handleTabChange}>
              <Tab
                icon={<Inventory />}
                iconPosition="start"
                label={`Products (${products.length})`}
              />
              <Tab
                icon={<Category />}
                iconPosition="start"
                label={`Categories (${categories.length})`}
              />
            </Tabs>
          </Box>

          {/* Products Tab */}
          <TabPanel value={selectedTab} index={0}>
            {products.length > 0 ? (
              <>
                {/* Sort Controls */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {products.length} products found
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Sort by</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort by"
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="relevance">Relevance</MenuItem>
                      <MenuItem value="name_asc">Name A-Z</MenuItem>
                      <MenuItem value="name_desc">Name Z-A</MenuItem>
                      <MenuItem value="price_asc">Price Low to High</MenuItem>
                      <MenuItem value="price_desc">Price High to Low</MenuItem>
                      <MenuItem value="newest">Newest First</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Products Grid */}
                <Grid container spacing={3}>
                  {sortedProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Inventory sx={{ fontSize: 60, color: "grey.300", mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No products found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try searching for different keywords or check the categories
                  tab.
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Categories Tab */}
          <TabPanel value={selectedTab} index={1}>
            {categories.length > 0 ? (
              <Grid container spacing={3}>
                {categories.map((category) => (
                  <Grid item xs={12} sm={6} md={4} key={category.id}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        },
                      }}
                      onClick={() =>
                        (window.location.href = `/categories/${category.id}/view`)
                      }
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Category color="primary" sx={{ mr: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {category.name}
                        </Typography>
                      </Box>

                      {category.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {category.description}
                        </Typography>
                      )}

                      <Chip
                        label={`${category.product_count || 0} products`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Category sx={{ fontSize: 60, color: "grey.300", mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No categories found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try searching for different keywords or check the products
                  tab.
                </Typography>
              </Box>
            )}
          </TabPanel>
        </Paper>
      )}

      {/* Search Suggestions */}
      {totalResults === 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Search Suggestions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Popular Products
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Chip
                    label="iPhone 15"
                    size="small"
                    variant="outlined"
                    clickable
                  />
                  <Chip
                    label="MacBook Air"
                    size="small"
                    variant="outlined"
                    clickable
                  />
                  <Chip
                    label="AirPods Pro"
                    size="small"
                    variant="outlined"
                    clickable
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Categories
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Chip
                    label="Electronics"
                    size="small"
                    variant="outlined"
                    clickable
                  />
                  <Chip
                    label="Computers"
                    size="small"
                    variant="outlined"
                    clickable
                  />
                  <Chip
                    label="Smartphones"
                    size="small"
                    variant="outlined"
                    clickable
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Brands
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Chip
                    label="Apple"
                    size="small"
                    variant="outlined"
                    clickable
                  />
                  <Chip
                    label="Samsung"
                    size="small"
                    variant="outlined"
                    clickable
                  />
                  <Chip
                    label="Sony"
                    size="small"
                    variant="outlined"
                    clickable
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Price Ranges
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Chip
                    label="Under $100"
                    size="small"
                    variant="outlined"
                    clickable
                  />
                  <Chip
                    label="$100 - $500"
                    size="small"
                    variant="outlined"
                    clickable
                  />
                  <Chip
                    label="Over $500"
                    size="small"
                    variant="outlined"
                    clickable
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default function SearchPage() {
  return (
    <MainLayout>
      <Suspense fallback={<LoadingSpinner fullHeight />}>
        <SearchPageContent />
      </Suspense>
    </MainLayout>
  );
}
