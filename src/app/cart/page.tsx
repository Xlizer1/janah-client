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
} from "@mui/icons-material";

import { MainLayout } from "@/components/layout/MainLayout";
import { useCart } from "@/store/cart.store";
import { useAuth } from "@/store/auth.store";
import { useTranslation } from "@/hooks/useTranslation";

export default function CartPage() {
  const router = useRouter();
    const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
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
            {t("nav.products")}
            </Typography>
          </Link>
          <Typography color="primary.main">Shopping Cart</Typography>
        </Breadcrumbs>

        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Shopping Cart
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {totalItems > 0
              ? `${totalItems} item${totalItems > 1 ? "s" : ""} in your cart`
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
              Looks like you haven't added anything to your cart yet. Start
              shopping to fill it up!
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push("/products")}
                sx={{ px: 4 }}
              >
                Start Shopping
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push("/categories")}
                sx={{ px: 4 }}
              >
                Browse Categories
              </Button>
            </Box>
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

                {/* Cart Items List */}
                <Box sx={{ p: 3 }}>
                  {items.map((item, index) => (
                    <React.Fragment key={item.product.id}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 3,
                          py: 3,
                          alignItems: "center",
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
                            {formatPrice(item.product.price)}
                          </Typography>

                          {/* Stock Info */}
                          {item.product.stock_quantity <= 5 && (
                            <Alert
                              severity="warning"
                              sx={{ mb: 2, maxWidth: 300 }}
                            >
                              <Typography variant="body2">
                                Only {item.product.stock_quantity} left in stock
                              </Typography>
                            </Alert>
                          )}

                          {/* Quantity Controls */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
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
                              × {formatPrice(item.product.price)} ={" "}
                              <strong>{formatPrice(item.subtotal)}</strong>
                            </Typography>
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

            {/* Order Summary */}
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
                    <Typography>Subtotal ({totalItems} items):</Typography>
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

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography>Tax:</Typography>
                    <Typography>Included</Typography>
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
                      Total:
                    </Typography>
                    <Typography
                      variant="h6"
                      color="primary.main"
                      sx={{ fontWeight: 700 }}
                    >
                      {formatPrice(totalPrice)}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    endIcon={<ArrowForward />}
                    onClick={handleCheckout}
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

                  {!isAuthenticated && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2, textAlign: "center" }}
                    >
                      You'll be redirected to sign in
                    </Typography>
                  )}
                </Paper>

                {/* Benefits */}
                <Card>
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 2 }}
                    >
                      Why shop with us?
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
                          Free shipping within Baghdad
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Security color="primary" sx={{ mr: 2, fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Secure Payment
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Cash on delivery available
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Refresh color="primary" sx={{ mr: 2, fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Easy Returns
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          30-day return policy
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
