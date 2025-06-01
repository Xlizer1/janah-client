"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography, Grid, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ArrowForward, Star } from "@mui/icons-material";
import { productsService } from "@/services/products.service";
import { ProductCard } from "@/components/products/ProductCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function FeaturedProducts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: () => productsService.getFeaturedProducts(8),
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading featured products..." />;
  }

  if (error || !data?.products?.length) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No featured products available at the moment.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Section Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <Star sx={{ color: "#fbbf24", fontSize: 28 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            Featured Products
          </Typography>
        </Box>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto", fontSize: "1.1rem" }}
        >
          Discover our handpicked selection of the most popular and high-quality
          products
        </Typography>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {data.products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {/* View All Button */}
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Link href="/products?featured=true">
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "0 4px 14px rgba(14, 165, 233, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 20px rgba(14, 165, 233, 0.4)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            View All Featured Products
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
