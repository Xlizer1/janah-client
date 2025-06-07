"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  TextField,
  Divider,
  Card,
  CardContent,
  Alert,
  Breadcrumbs,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  ArrowForward,
  NavigateNext,
  LocalShipping,
  Security,
  Refresh,
  TrendingUp,
} from "@mui/icons-material";

import { MainLayout } from "@/components/layout/MainLayout";
import { useCart } from "@/store/cart.store";
import { useAuth } from "@/store/auth.store";
import { useTranslation } from "@/hooks/useTranslation";
import { formatPrice } from "@/utils/price";

export default function CartPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    updateSellingPrice,
    removeItem,
    clearCart,
    validateSellingPrices,
  } = useCart();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleSellingPriceChange = (
    productId: number,
    sellingPrice: string
  ) => {
    const price = parseFloat(sellingPrice);
    if (!isNaN(price) && price > 0) {
      updateSellingPrice(productId, price);
    }
  };

  const calculateProfitMargin = (
    purchasePrice: number,
    sellingPrice?: number
  ) => {
    if (!sellingPrice || sellingPrice <= purchasePrice) return null;
    return (((sellingPrice - purchasePrice) / sellingPrice) * 100).toFixed(1);
  };

  const handleCheckout = () => {
    // Validate that all items have selling prices
    if (!validateSellingPrices()) {
      alert("Please enter selling prices for all items before checkout.");
      return;
    }

    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

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
              Products
            </Typography>
          </Link>
          <Typography color="primary.main">Cart</Typography>
        </Breadcrumbs>

        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Shopping Cart
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {totalItems > 0
              ? `${totalItems} items in cart`
              : "Your cart is empty"}
          </Typography>
        </Box>

        {items.length === 0 ? (
          /* Empty Cart */
          <Box sx={{ textAlign: "center", py: 8 }}>
            <ShoppingCart
              sx={{
                fontSize: 120,
                color: "grey.300",
                mb: 3,
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Your cart is empty
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 400, mx: "auto" }}
            >
              Add some products to get started with your wholesale order
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push("/products")}
              sx={{ px: 4 }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{ borderRadius: 2 }}>
                {/* Cart Header */}
                <Box
                  sx={{
                    p: 3,
                    borderBottom: 1,
                    borderColor: "divider",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Cart Items ({totalItems})
                  </Typography>
                  <Button
                    variant="text"
                    color="error"
                    onClick={clearCart}
                    sx={{ textTransform: "none" }}
                  >
                    Clear Cart
                  </Button>
                </Box>

                {/* Info Alert */}
                <Alert severity="info" sx={{ m: 3, mb: 0 }}>
                  <Typography variant="body2">
                    <strong>Wholesale Pricing:</strong> Please enter the price
                    you plan to sell each item at. This helps us understand your
                    business model and provide better support.
                  </Typography>
                </Alert>

                {/* Cart Items List */}
                <Box sx={{ p: 3 }}>
                  {items.map((item, index) => (
                    <React.Fragment key={item.product.id}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 3,
                          py: 3,
                          alignItems: "flex-start",
                        }}
                      >
                        {/* Product Image */}
                        <Box
                          sx={{
                            width: 120,
                            height: 120,
                            borderRadius: 2,
                            overflow: "hidden",
                            bgcolor: "grey.100",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.product.image_url ? (
                            <Image
                              src={item.product.image_url}
                              alt={item.product.name}
                              width={120}
                              height={120}
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No Image
                            </Typography>
                          )}
                        </Box>

                        {/* Product Details */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Link
                            href={`/products/${
                              item.product.slug || item.product.id
                            }`}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                mb: 1,
                                cursor: "pointer",
                                "&:hover": { color: "primary.main" },
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {item.product.name}
                            </Typography>
                          </Link>

                          {item.product.category_name && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              Category: {item.product.category_name}
                            </Typography>
                          )}

                          <Typography
                            variant="h6"
                            color="primary.main"
                            sx={{ fontWeight: 700, mb: 2 }}
                          >
                            Purchase Price: {formatPrice(item.product.price)}
                          </Typography>

                          {/* Quantity Controls */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              mb: 2,
                            }}
                          >
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
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                                sx={{ borderRadius: 0 }}
                              >
                                <Remove />
                              </IconButton>

                              <TextField
                                value={item.quantity}
                                onChange={(e) => {
                                  const newQuantity =
                                    parseInt(e.target.value) || 1;
                                  handleQuantityChange(
                                    item.product.id,
                                    newQuantity
                                  );
                                }}
                                inputProps={{
                                  min: 1,
                                  max: item.product.stock_quantity,
                                  style: { textAlign: "center" },
                                }}
                                sx={{
                                  width: 80,
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 0,
                                    "& fieldset": { border: "none" },
                                  },
                                }}
                                variant="outlined"
                                size="small"
                              />

                              <IconButton
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={
                                  item.quantity >= item.product.stock_quantity
                                }
                                sx={{ borderRadius: 0 }}
                              >
                                <Add />
                              </IconButton>
                            </Box>

                            <Typography variant="body2" color="text.secondary">
                              Purchase Total: {formatPrice(item.subtotal)}
                            </Typography>
                          </Box>

                          {/* Selling Price Input */}
                          <Box sx={{ maxWidth: 300 }}>
                            <FormControl fullWidth size="small">
                              <TextField
                                label="Your Selling Price"
                                type="number"
                                value={item.selling_price || ""}
                                onChange={(e) =>
                                  handleSellingPriceChange(
                                    item.product.id,
                                    e.target.value
                                  )
                                }
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      IQD
                                    </InputAdornment>
                                  ),
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <TrendingUp color="success" />
                                    </InputAdornment>
                                  ),
                                }}
                                placeholder="Enter selling price"
                                helperText={
                                  item.selling_price &&
                                  item.selling_price > item.product.price
                                    ? `Profit margin: ${calculateProfitMargin(
                                        item.product.price,
                                        item.selling_price
                                      )}%`
                                    : "Enter the price you'll sell this item for"
                                }
                                sx={{ mt: 1 }}
                              />
                            </FormControl>
                          </Box>
                        </Box>

                        {/* Remove Button */}
                        <IconButton
                          onClick={() => removeItem(item.product.id)}
                          color="error"
                          sx={{ alignSelf: "flex-start" }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>

                      {index < items.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </Box>
              </Paper>

              {/* Continue Shopping */}
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={
                    <ArrowForward sx={{ transform: "rotate(180deg)" }} />
                  }
                  onClick={() => router.push("/products")}
                >
                  Continue Shopping
                </Button>
              </Box>
            </Grid>

            {/* Right Column - Order Summary */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ position: "sticky", top: 100 }}>
                {/* Summary Card */}
                <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Order Summary
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography>
                      Purchase Total ({totalItems} items):
                    </Typography>
                    <Typography>{formatPrice(totalPrice)}</Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography>Shipping:</Typography>
                    <Typography color="success.main">Free</Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Total to Pay:
                    </Typography>
                    <Typography
                      variant="h6"
                      color="primary.main"
                      sx={{ fontWeight: 700 }}
                    >
                      {formatPrice(totalPrice)}
                    </Typography>
                  </Box>

                  {/* Selling Price Validation */}
                  {!validateSellingPrices() && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        Please enter selling prices for all items to proceed
                        with checkout.
                      </Typography>
                    </Alert>
                  )}

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    endIcon={<ArrowForward />}
                    onClick={handleCheckout}
                    disabled={!validateSellingPrices()}
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1.1rem",
                    }}
                  >
                    {isAuthenticated
                      ? "Proceed to Checkout"
                      : "Sign In to Checkout"}
                  </Button>
                </Paper>

                {/* Wholesale Benefits */}
                <Card>
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 2 }}
                    >
                      Wholesale Benefits
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <LocalShipping
                        color="primary"
                        sx={{ mr: 2, fontSize: 20 }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Free Delivery
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          On all wholesale orders
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <TrendingUp
                        color="primary"
                        sx={{ mr: 2, fontSize: 20 }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Profit Tracking
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Monitor your margins
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Security color="primary" sx={{ mr: 2, fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Business Support
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Dedicated account manager
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </MainLayout>
  );
}
