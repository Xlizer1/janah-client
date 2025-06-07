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
  Dialog,
  DialogContent,
  DialogActions,
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
  ChevronLeft,
  ChevronRight,
  Close,
  ZoomIn,
  PhotoLibrary,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { MainLayout } from "@/components/layout/MainLayout";
import { ProductCard } from "@/components/products/ProductCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useCart } from "@/store/cart.store";
import { productsService } from "@/services/products.service";
import { useTranslation } from "@/hooks/useTranslation";
import { formatPrice } from "@/utils/price";

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

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  if (!images || images.length === 0) {
    return (
      <Box sx={{ position: "sticky", top: 100 }}>
        <Paper
          sx={{
            height: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "grey.100",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No Images Available
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "sticky", top: 100 }}>
      {/* Main Image */}
      <Paper
        sx={{
          height: 500,
          mb: 2,
          overflow: "hidden",
          borderRadius: 2,
          bgcolor: "grey.100",
          position: "relative",
          cursor: "zoom-in",
        }}
        onClick={() => openLightbox(selectedImageIndex)}
      >
        <Image
          src={images[selectedImageIndex]}
          alt={`${productName} - Image ${selectedImageIndex + 1}`}
          fill
          style={{ objectFit: "cover" }}
        />

        {/* Navigation Arrows (only show if multiple images) */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.8)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.8)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
              }}
            >
              <ChevronRight />
            </IconButton>

            {/* Image Counter */}
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                bgcolor: "rgba(0,0,0,0.7)",
                color: "white",
                px: 1,
                py: 0.5,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <PhotoLibrary sx={{ fontSize: 16 }} />
              <Typography variant="caption">
                {selectedImageIndex + 1} / {images.length}
              </Typography>
            </Box>
          </>
        )}

        {/* Zoom Icon */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            openLightbox(selectedImageIndex);
          }}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "rgba(255,255,255,0.8)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
          }}
        >
          <ZoomIn />
        </IconButton>
      </Paper>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
          {images.map((image, index) => (
            <Paper
              key={index}
              sx={{
                width: 80,
                height: 80,
                minWidth: 80,
                cursor: "pointer",
                overflow: "hidden",
                border: selectedImageIndex === index ? 2 : 0,
                borderColor: "primary.main",
                borderRadius: 1,
                transition: "all 0.2s ease",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
              onClick={() => setSelectedImageIndex(index)}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                width={80}
                height={80}
                style={{ objectFit: "cover" }}
              />
            </Paper>
          ))}
        </Box>
      )}

      {/* Lightbox */}
      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            overflow: "hidden",
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80vh",
            minWidth: "80vw",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              bgcolor: "rgba(255,255,255,0.9)",
              zIndex: 2,
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
            }}
          >
            <Close />
          </IconButton>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <IconButton
                onClick={prevImage}
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.9)",
                  zIndex: 2,
                  "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={nextImage}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.9)",
                  zIndex: 2,
                  "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                }}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}

          {/* Main Image */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={images[selectedImageIndex]}
              alt={`${productName} - Full size ${selectedImageIndex + 1}`}
              width={800}
              height={600}
              style={{
                objectFit: "contain",
                maxWidth: "100%",
                maxHeight: "80vh",
              }}
            />
          </Box>

          {/* Image Counter */}
          {images.length > 1 && (
            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                bgcolor: "rgba(0,0,0,0.8)",
                color: "white",
                px: 2,
                py: 1,
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">
                {selectedImageIndex + 1} of {images.length}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
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

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner fullHeight message={t("common.loading")} />
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
            {t("404.browseProducts")}
          </Button>
        </Container>
      </MainLayout>
    );
  }

  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  // Get product images - prioritize new images array, fallback to legacy image_url
  const productImages = product.image_urls?.length
    ? product.image_urls
    : product.image_url
    ? [product.image_url]
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
          {t("common.back")}
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
              {t("products.title")}
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
            <ImageGallery images={productImages} productName={product.name} />
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

              {/* Product Code */}
              {product.code && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, fontFamily: "monospace" }}
                >
                  Product Code: {product.full_code || product.code}
                </Typography>
              )}

              {/* Rating */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Rating value={4.5} readOnly precision={0.5} />
                <Typography variant="body2" color="text.secondary">
                  (124 {t("products.reviews")})
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
                  <Alert severity="error">{t("products.outOfStock")}</Alert>
                ) : isLowStock ? (
                  <Alert severity="warning">
                    {t("products.lowStock")} ({product.stock_quantity} left)
                  </Alert>
                ) : (
                  <Alert severity="success">
                    {t("products.inStock")} ({product.stock_quantity} available)
                  </Alert>
                )}
              </Box>

              {/* Product Badges */}
              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                {product.is_featured && (
                  <Chip
                    icon={<Star />}
                    label={t("products.featured")}
                    color="warning"
                    variant="filled"
                  />
                )}
                {productImages.length > 1 && (
                  <Chip
                    icon={<PhotoLibrary />}
                    label={`${productImages.length} Images`}
                    color="info"
                    variant="outlined"
                  />
                )}
              </Box>

              {/* Quantity and Add to Cart */}
              {!isOutOfStock && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    {t("common.quantity")}
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
                      {t("products.addToCart")}
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                {/* <Button
                  variant="outlined"
                  startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                  onClick={() => setIsFavorite(!isFavorite)}
                  color={isFavorite ? "error" : "inherit"}
                >
                  {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button> */}
                <IconButton onClick={handleShare}>
                  <Share />
                </IconButton>
              </Box>

              {/* Product Features */}
              {/* <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LocalShipping color="primary" />
                  <Typography variant="body2">
                    Free shipping on orders over 50,000 IQD
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
              </Box> */}
            </Box>
          </Grid>
        </Grid>

        {/* Product Details Tabs */}
        <Box sx={{ mt: 6 }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
          >
            <Tab label={t("products.description")} />
            <Tab label={t("products.specifications")} />
            <Tab label={t("products.reviews")} />
            <Tab label={t("products.shipping")} />
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
              {product.code && (
                <Grid item xs={6} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Product Code
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                    {product.full_code || product.code}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Images
                </Typography>
                <Typography variant="body1">
                  {productImages.length} product image
                  {productImages.length !== 1 ? "s" : ""}
                </Typography>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={selectedTab} index={2}>
            <Typography variant="body1">
              Customer {t("products.reviews")} will be displayed here.
            </Typography>
          </TabPanel>

          <TabPanel value={selectedTab} index={3}>
            <Typography variant="body1">
              {t("products.shipping")} information and delivery options will be
              displayed here.
            </Typography>
          </TabPanel>
        </Box>

        {/* Related Products */}
        {relatedProductsData?.products?.length && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>
              {t("products.relatedProducts")}
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
