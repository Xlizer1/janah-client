"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  Slider,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  ExpandMore,
  Clear,
  Star,
  Category as CategoryIcon,
} from "@mui/icons-material";
import type { ProductFilters as ProductFiltersType, Category } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFiltersChange: (filters: Partial<ProductFiltersType>) => void;
  categories: Category[];
}

export function ProductFilters({
  filters,
  onFiltersChange,
  categories,
}: ProductFiltersProps) {
  const { t } = useTranslation();
  const [priceRange, setPriceRange] = useState<number[]>([
    filters.min_price || 0,
    filters.max_price || 1000,
  ]);

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handlePriceCommit = (
    event: Event | React.SyntheticEvent,
    newValue: number | number[]
  ) => {
    const [min, max] = newValue as number[];
    onFiltersChange({
      min_price: min > 0 ? min : undefined,
      max_price: max < 1000 ? max : undefined,
    });
  };

  const handleCategoryChange = (categoryId: number | undefined) => {
    onFiltersChange({ category_id: categoryId });
  };

  const handleFeaturedChange = (featured: boolean | undefined) => {
    onFiltersChange({ is_featured: featured });
  };

  const clearPriceFilter = () => {
    setPriceRange([0, 1000]);
    onFiltersChange({ min_price: undefined, max_price: undefined });
  };

  const hasActiveFilters = !!(
    filters.category_id ||
    filters.min_price ||
    filters.max_price ||
    filters.is_featured
  );

  return (
    <Box>
      {/* Clear All Filters */}
      {hasActiveFilters && (
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<Clear />}
            fullWidth
            onClick={() => {
              onFiltersChange({
                category_id: undefined,
                min_price: undefined,
                max_price: undefined,
                is_featured: undefined,
              });
              setPriceRange([0, 1000]);
            }}
          >
            {t("products.filters.clearAll")}
          </Button>
        </Box>
      )}

      {/* Categories */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CategoryIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              {t("nav.categories")}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <List dense>
            <ListItem disablePadding>
              <ListItemButton
                selected={!filters.category_id}
                onClick={() => handleCategoryChange(undefined)}
              >
                <ListItemText primary={t("products.allCategories")} />
              </ListItemButton>
            </ListItem>
            {categories.map((category) => (
              <ListItem key={category.id} disablePadding>
                <ListItemButton
                  selected={filters.category_id === category.id}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  <ListItemText
                    primary={category.name}
                    secondary={
                      category.product_count
                        ? t("categories.productsCount", {
                            count: category.product_count,
                          })
                        : undefined
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Price Range */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>
            {t("products.priceRange")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              onChangeCommitted={handlePriceCommit}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={10}
              valueLabelFormat={(value) => `${value} IQD`}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                size="small"
                label={t("products.filters.minPrice")}
                type="number"
                value={priceRange[0]}
                onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value) || 0);
                  setPriceRange([value, priceRange[1]]);
                }}
                onBlur={() => handlePriceCommit({} as any, priceRange)}
                InputProps={{
                  endAdornment: "IQD",
                }}
              />
              <TextField
                size="small"
                label={t("products.filters.maxPrice")}
                type="number"
                value={priceRange[1]}
                onChange={(e) => {
                  const value = Math.min(
                    1000,
                    parseInt(e.target.value) || 1000
                  );
                  setPriceRange([priceRange[0], value]);
                }}
                onBlur={() => handlePriceCommit({} as any, priceRange)}
                InputProps={{
                  endAdornment: "IQD",
                }}
              />
            </Box>

            {(filters.min_price || filters.max_price) && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Chip
                  label={`${filters.min_price || 0} IQD - ${
                    filters.max_price || 1000
                  } IQD`}
                  onDelete={clearPriceFilter}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Product Type */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Star fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              {t("products.filters.productType")}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl component="fieldset">
            <RadioGroup
              value={
                filters.is_featured === true
                  ? "featured"
                  : filters.is_featured === false
                  ? "regular"
                  : "all"
              }
              onChange={(e) => {
                const value = e.target.value;
                if (value === "all") {
                  handleFeaturedChange(undefined);
                } else if (value === "featured") {
                  handleFeaturedChange(true);
                } else {
                  handleFeaturedChange(false);
                }
              }}
            >
              <FormControlLabel
                value="all"
                control={<Radio />}
                label={t("products.filters.allProducts")}
              />
              <FormControlLabel
                value="featured"
                control={<Radio />}
                label={t("products.filters.featuredOnly")}
              />
              <FormControlLabel
                value="regular"
                control={<Radio />}
                label={t("products.filters.regularProducts")}
              />
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Quick Filters */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          {t("products.quickFilters")}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.is_featured === true}
                onChange={(e) =>
                  handleFeaturedChange(e.target.checked ? true : undefined)
                }
              />
            }
            label={t("products.featured")}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={!!filters.min_price && filters.min_price === 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    onFiltersChange({ min_price: 0, max_price: 50 });
                    setPriceRange([0, 50]);
                  }
                }}
              />
            }
            label={t("products.filters.under50k")}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={!!filters.min_price && filters.min_price === 100}
                onChange={(e) => {
                  if (e.target.checked) {
                    onFiltersChange({ min_price: 100, max_price: 500 });
                    setPriceRange([100, 500]);
                  }
                }}
              />
            }
            label={t("products.filters.range100to500")}
          />
        </Box>
      </Box>
    </Box>
  );
}
