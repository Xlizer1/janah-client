"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Typography, Grid, Card, CardContent, Chip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ArrowForward, Category } from "@mui/icons-material";
import { categoriesService } from "@/services/categories.service";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useTranslation } from "@/hooks/useTranslation";

export function CategoriesGrid() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ["categoriesWithCounts"],
    queryFn: () => categoriesService.getCategoriesWithCounts(false),
  });

  if (isLoading) {
    return <LoadingSpinner message={t("categories.loading")} />;
  }

  if (error || !data?.categories?.length) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          {t("categories.noCategories")}
        </Typography>
      </Box>
    );
  }

  const displayCategories = data.categories.slice(0, 6);

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
          <Category sx={{ color: "primary.main", fontSize: 28 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            {t("categories.title")}
          </Typography>
        </Box>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto", fontSize: "1.1rem" }}
        >
          {t("categories.subtitle")}
        </Typography>
      </Box>

      {/* Categories Grid */}
      <Grid container spacing={3}>
        {displayCategories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Link href={`/products?category=${category.id}`}>
              <Card
                sx={{
                  height: 280,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                    "& .category-content": {
                      transform: "translateY(-10px)",
                    },
                    "& .category-arrow": {
                      transform: "translateX(5px)",
                    },
                  },
                }}
              >
                {/* Background Image */}
                {category.image_url && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      opacity: 0.3,
                    }}
                  >
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                )}

                {/* Gradient Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: !category.image_url
                      ? `linear-gradient(135deg, hsl(${
                          (category.id * 137.5) % 360
                        }, 70%, 60%) 0%, hsl(${
                          (category.id * 137.5 + 60) % 360
                        }, 70%, 40%) 100%)`
                      : "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)",
                  }}
                />

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
                      label={t("categories.productsCount", {
                        count: category.product_count || 0,
                      })}
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
                        }}
                      >
                        {category.description}
                      </Typography>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 2,
                        fontSize: "0.95rem",
                        fontWeight: 600,
                      }}
                    >
                      <span>{t("categories.exploreCategory")}</span>
                      <ArrowForward
                        className="category-arrow"
                        sx={{
                          fontSize: 18,
                          transition: "transform 0.3s ease",
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* View All Categories Button */}
      {data.categories.length > 6 && (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Link href="/categories">
            <Box
              component="button"
              sx={{
                border: "2px solid",
                borderColor: "primary.main",
                bgcolor: "transparent",
                color: "primary.main",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "white",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(14, 165, 233, 0.3)",
                },
              }}
            >
              {t("categories.viewAll")}
              <ArrowForward sx={{ fontSize: 20 }} />
            </Box>
          </Link>
        </Box>
      )}
    </Box>
  );
}
