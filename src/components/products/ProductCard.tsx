"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Rating,
  Badge,
} from "@mui/material";
import {
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
  Visibility,
  Star,
  PhotoLibrary,
} from "@mui/icons-material";
import { useCart } from "@/store/cart.store";
import type { Product } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
}

export function ProductCard({
  product,
  showQuickView = true,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  // Get the main image (first image) or fallback to legacy image_url
  const mainImage = product.image_urls?.[0] || product.image_url;
  const hasMultipleImages = product.image_urls && product.image_urls.length > 1;

  return (
    <Link href={`/products/${product.slug || product.id}`} className="block">
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
            "& .product-image": {
              transform: "scale(1.05)",
            },
            "& .product-actions": {
              opacity: 1,
              transform: "translateY(0)",
            },
          },
        }}
      >
        {/* Product Image */}
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          <CardMedia
            sx={{
              height: 240,
              bgcolor: "grey.100",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                className="product-image transition-transform duration-300"
              />
            ) : (
              <Box
                className="product-image transition-transform duration-300"
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.200",
                  color: "text.secondary",
                }}
              >
                <Typography variant="body2">No Image</Typography>
              </Box>
            )}
          </CardMedia>

          {/* Multiple Images Indicator */}
          {hasMultipleImages && (
            <Box
              sx={{
                position: "absolute",
                top: 12,
                right: 60,
                bgcolor: "rgba(0,0,0,0.7)",
                color: "white",
                borderRadius: 1,
                px: 1,
                py: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <PhotoLibrary sx={{ fontSize: 14 }} />
              <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                {product.image_urls!.length}
              </Typography>
            </Box>
          )}

          {/* Product Badges */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {product.is_featured && (
              <Chip
                label="Featured"
                size="small"
                sx={{
                  bgcolor: "#fbbf24",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              />
            )}

            {isOutOfStock && (
              <Chip
                label="Out of Stock"
                size="small"
                color="error"
                sx={{ fontWeight: 600, fontSize: "0.75rem" }}
              />
            )}

            {isLowStock && !isOutOfStock && (
              <Chip
                label="Low Stock"
                size="small"
                sx={{
                  bgcolor: "#f59e0b",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              />
            )}
          </Box>

          {/* Favorite Button */}
          <IconButton
            onClick={handleToggleFavorite}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,1)",
              },
            }}
          >
            {isFavorite ? (
              <Favorite sx={{ color: "#ef4444" }} />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>

          {/* Quick Actions */}
          {showQuickView && (
            <Box
              className="product-actions"
              sx={{
                position: "absolute",
                bottom: 12,
                left: 12,
                right: 12,
                display: "flex",
                gap: 1,
                opacity: 0,
                transform: "translateY(10px)",
                transition: "all 0.3s ease",
              }}
            >
              <Button
                variant="contained"
                fullWidth
                startIcon={<AddShoppingCart />}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                sx={{
                  py: 1,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Add to Cart
              </Button>

              <IconButton
                sx={{
                  bgcolor: "background.paper",
                  "&:hover": {
                    bgcolor: "background.paper",
                  },
                }}
              >
                <Visibility />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Product Info */}
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          {/* Category */}
          {product.category_name && (
            <Typography
              variant="caption"
              color="primary.main"
              sx={{
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                mb: 0.5,
                display: "block",
              }}
            >
              {product.category_name}
            </Typography>
          )}

          {/* Product Name */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.3,
              minHeight: "2.6em",
            }}
          >
            {product.name}
          </Typography>

          {/* Product Code */}
          {product.code && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                mb: 1,
                display: "block",
                fontFamily: "monospace",
              }}
            >
              {product.full_code || product.code}
            </Typography>
          )}

          {/* Rating */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Rating value={4.5} size="small" readOnly precision={0.5} />
            <Typography variant="caption" color="text.secondary">
              (124)
            </Typography>
          </Box>

          {/* Description */}
          {product.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.4,
              }}
            >
              {product.description}
            </Typography>
          )}

          {/* Price and Stock */}
          <Box sx={{ mt: "auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                color="primary.main"
                sx={{ fontWeight: 700 }}
              >
                {formatPrice(product.price)}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {product.stock_quantity > 0
                  ? `${product.stock_quantity} in stock`
                  : "Out of stock"}
              </Typography>
            </Box>

            {/* Add to Cart Button (Mobile) */}
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AddShoppingCart />}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              sx={{
                display: { xs: "flex", md: "none" },
                mt: 1,
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}
