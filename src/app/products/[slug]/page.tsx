"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Paper,
  Divider,
  TextField,
  Rating,
  Breadcrumbs,
  Tabs,
  Tab,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import {
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  Remove,
  Add,
  LocalShipping,
  Security,
  Refresh,
  Star,
  ArrowBack,
  NavigateNext,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { MainLayout } from "@/components/layout/MainLayout";
import { ProductCard } from "@/components/products/ProductCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useCart } from "@/store/cart.store";
import { productsService } from "@/services/products.service";
import { useTranslation } from "@/hooks/useTranslation";

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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { t } = useTranslation();

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const slug = params.slug as string;

  const {
    data: productData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productsService.getProduct(slug),
  });

  const { data: relatedProductsData } = useQuery({
    queryKey: ["relatedProducts", productData?.product.category_id],
    queryFn: () =>
      productData?.product.category_id
        ? productsService.getProducts({
            category_id: productData.product.category_id,
            limit: 4,
          })
        : null,
    enabled: !!productData?.product.category_id,
  });

  const product = productData?.product;

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (product && newQuantity > product.stock_quantity) {
      toast.error(`Only ${product.stock_quantity} items available`);
      return;
    }
    setQuantity(newQuantity);
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner fullHeight message="Loading product..." />
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <Container sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Product not found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The product you're looking for doesn't exist or has been removed.
          </Typography>
          <Button variant="contained" onClick={() => router.push("/products")}>
            Browse Products
          </Button>
        </Container>
      </MainLayout>
    );
  }

  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const productImages = product.image_url
    ? [product.image_url, product.image_url, product.image_url]
    : [];

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{ mb: 3 }}
        >
          Back
        </Button>

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
          <Link href="/products">
            <Typography color="text.secondary" sx={{ cursor: "pointer" }}>
              Products
            </Typography>
          </Link>
          {product.category_name && (
            <Link href={`/categories/${product.category_slug}`}>
              <Typography color="text.secondary" sx={{ cursor: "pointer" }}>
                {product.category_name}
              </Typography>
            </Link>
          )}
          <Typography color="primary.main">{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: "sticky", top: 100 }}>
              {/* Main Image */}
              <Paper
                sx={{
                  height: 500,
                  mb: 2,
                  overflow: "hidden",
                  borderRadius: 2,
                  bgcolor: "grey.100",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {productImages[selectedImageIndex] ? (
                  <Image
                    src={productImages[selectedImageIndex]}
                    alt={product.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <Typography variant="h6" color="text.secondary">
                    No Image Available
                  </Typography>
                )}
              </Paper>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  {productImages.map((image, index) => (
                    <Paper
                      key={index}
                      sx={{
                        width: 80,
                        height: 80,
                        cursor: "pointer",
                        overflow: "hidden",
                        border: selectedImageIndex === index ? 2 : 0,
                        borderColor: "primary.main",
                        borderRadius: 1,
                      }}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        style={{ objectFit: "cover" }}
                      />
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Box>
              {/* Category */}
              {product.category_name && (
                <Chip
                  label={product.category_name}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              )}

              {/* Product Name */}
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                {product.name}
              </Typography>

              {/* Rating */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Rating value={4.5} readOnly precision={0.5} />
                <Typography variant="body2" color="text.secondary">
                  (124 reviews)
                </Typography>
              </Box>

              {/* Price */}
              <Typography
                variant="h4"
                color="primary.main"
                sx={{ fontWeight: 700, mb: 3 }}
              >
                {formatPrice(product.price)}
              </Typography>

              {/* Stock Status */}
              <Box sx={{ mb: 3 }}>
                {isOutOfStock ? (
                  <Alert severity="error">Out of Stock</Alert>
                ) : isLowStock ? (
                  <Alert severity="warning">
                    Only {product.stock_quantity} left in stock
                  </Alert>
                ) : (
                  <Alert severity="success">
                    In Stock ({product.stock_quantity} available)
                  </Alert>
                )}
              </Box>

              {/* Product Badges */}
              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                {product.is_featured && (
                  <Chip
                    icon={<Star />}
                    label="Featured"
                    color="warning"
                    variant="filled"
                  />
                )}
              </Box>

              {/* Quantity and Add to Cart */}
              {!isOutOfStock && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Quantity
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <IconButton
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Remove />
                      </IconButton>
                      <TextField
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(parseInt(e.target.value) || 1)
                        }
                        sx={{ width: 80 }}
                        inputProps={{
                          min: 1,
                          max: product.stock_quantity,
                          style: { textAlign: "center" },
                        }}
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                      />
                      <IconButton
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stock_quantity}
                      >
                        <Add />
                      </IconButton>
                    </Box>

                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AddShoppingCart />}
                      onClick={handleAddToCart}
                      sx={{ flex: 1, py: 1.5 }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                <Button
                  variant="outlined"
                  startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                  onClick={() => setIsFavorite(!isFavorite)}
                  color={isFavorite ? "error" : "inherit"}
                >
                  {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
                <IconButton onClick={handleShare}>
                  <Share />
                </IconButton>
              </Box>

              {/* Product Features */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LocalShipping color="primary" />
                  <Typography variant="body2">
                    Free shipping on orders over $50
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Security color="primary" />
                  <Typography variant="body2">
                    2-year warranty included
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Refresh color="primary" />
                  <Typography variant="body2">30-day return policy</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Product Details Tabs */}
        <Box sx={{ mt: 6 }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
          >
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label="Reviews" />
            <Tab label="Shipping" />
          </Tabs>

          <TabPanel value={selectedTab} index={0}>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {product.description ||
                "No description available for this product."}
            </Typography>
          </TabPanel>

          <TabPanel value={selectedTab} index={1}>
            <Grid container spacing={2}>
              {product.weight && (
                <Grid item xs={6} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Weight
                  </Typography>
                  <Typography variant="body1">{product.weight} kg</Typography>
                </Grid>
              )}
              {product.dimensions && (
                <Grid item xs={6} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Dimensions
                  </Typography>
                  <Typography variant="body1">{product.dimensions}</Typography>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          <TabPanel value={selectedTab} index={2}>
            <Typography variant="body1">
              Customer reviews will be displayed here.
            </Typography>
          </TabPanel>

          <TabPanel value={selectedTab} index={3}>
            <Typography variant="body1">
              Shipping information and delivery options will be displayed here.
            </Typography>
          </TabPanel>
        </Box>

        {/* Related Products */}
        {relatedProductsData?.products?.length && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>
              Related Products
            </Typography>
            <Grid container spacing={3}>
              {relatedProductsData.products
                .slice(0, 4)
                .map((relatedProduct) => (
                  <Grid item xs={12} sm={6} md={3} key={relatedProduct.id}>
                    <ProductCard product={relatedProduct} />
                  </Grid>
                ))}
            </Grid>
          </Box>
        )}
      </Container>
    </MainLayout>
  );
}
