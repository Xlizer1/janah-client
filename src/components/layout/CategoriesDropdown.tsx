"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Skeleton,
  Grid,
  Paper,
} from "@mui/material";
import {
  Category,
  KeyboardArrowDown,
  Storefront,
  TrendingUp,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@/services/categories.service";
import { useTranslation } from "@/hooks/useTranslation";

export function CategoriesDropdown() {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Fetch categories dynamically
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["categories", "dropdown"],
    queryFn: () => categoriesService.getCategoriesWithCounts(true), // Only active categories
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryClick = () => {
    handleClose();
  };

  // Get featured/popular categories (first 6)
  const featuredCategories = categoriesData?.categories?.slice(0, 6) || [];
  const hasMoreCategories = (categoriesData?.categories?.length || 0) > 6;

  return (
    <>
      <Button
        color="inherit"
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
        sx={{
          fontWeight: 500,
          "&:hover": {
            bgcolor: "rgba(0,0,0,0.04)",
          },
        }}
      >
        {t("nav.categories")}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 320,
            maxWidth: 400,
            mt: 1,
            borderRadius: 2,
            "& .MuiMenuItem-root": {
              borderRadius: 1,
              mx: 1,
              my: 0.5,
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, bgcolor: "grey.50" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {t("categories.title")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("categories.subtitle")}
          </Typography>
        </Box>

        <Divider />

        {/* All Categories Link */}
        <MenuItem
          component={Link}
          href="/categories"
          onClick={handleCategoryClick}
        >
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText
            primary={t("categories.viewAll")}
            secondary={
              categoriesData?.categories?.length
                ? t("categories.productsCount", {
                    count: categoriesData.categories.length,
                  })
                : undefined
            }
          />
        </MenuItem>

        <Divider />

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ p: 1 }}>
            {[1, 2, 3, 4].map((i) => (
              <MenuItem key={i} disabled>
                <ListItemIcon>
                  <Skeleton variant="circular" width={24} height={24} />
                </ListItemIcon>
                <ListItemText
                  primary={<Skeleton width={120} height={20} />}
                  secondary={<Skeleton width={80} height={16} />}
                />
              </MenuItem>
            ))}
          </Box>
        )}

        {/* Dynamic Categories */}
        {!isLoading && featuredCategories.length > 0 && (
          <Box>
            {featuredCategories.map((category) => (
              <MenuItem
                key={category.id}
                component={Link}
                href={`/products?category=${category.id}`}
                onClick={handleCategoryClick}
              >
                <ListItemIcon>
                  {category.image_url ? (
                    <Box
                      component="img"
                      src={category.image_url}
                      alt={category.name}
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Category />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={category.name}
                  secondary={
                    category.product_count
                      ? t("categories.productsCount", {
                          count: category.product_count,
                        })
                      : category.description
                  }
                  primaryTypographyProps={{
                    fontWeight: 500,
                  }}
                  secondaryTypographyProps={{
                    variant: "caption",
                  }}
                />
              </MenuItem>
            ))}
          </Box>
        )}

        {/* More Categories Link */}
        {hasMoreCategories && (
          <>
            <Divider />
            <MenuItem
              component={Link}
              href="/categories"
              onClick={handleCategoryClick}
              sx={{
                bgcolor: "primary.50",
                color: "primary.main",
                fontWeight: 600,
              }}
            >
              <ListItemIcon>
                <TrendingUp color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={t("categories.viewAll")}
                secondary={`+${
                  (categoriesData?.categories?.length || 0) - 6
                } more`}
              />
            </MenuItem>
          </>
        )}

        {/* Empty State */}
        {!isLoading && featuredCategories.length === 0 && (
          <MenuItem disabled>
            <ListItemText
              primary={t("categories.noCategories")}
              secondary={t("categories.noCategories.help")}
            />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
