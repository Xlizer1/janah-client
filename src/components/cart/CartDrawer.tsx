"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  Divider,
  Badge,
  TextField,
  Paper,
} from "@mui/material";
import {
  Close,
  Add,
  Remove,
  Delete,
  ShoppingBag,
  ArrowForward,
} from "@mui/icons-material";
import { useCart } from "@/store/cart.store";
import { useTranslation } from "@/hooks/useTranslation";

export function CartDrawer() {
  const { t } = useTranslation();
  const {
    isOpen,
    closeCart,
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
      currency: "IQD",
    }).format(price);
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={closeCart}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: 400 },
          maxWidth: "100vw",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShoppingBag color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t("cart.title")}
            </Typography>
            {totalItems > 0 && (
              <Badge badgeContent={totalItems} color="primary" />
            )}
          </Box>

          <IconButton onClick={closeCart} edge="end">
            <Close />
          </IconButton>
        </Box>

        {items.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
              textAlign: "center",
            }}
          >
            <ShoppingBag
              sx={{
                fontSize: 80,
                color: "grey.300",
                mb: 2,
              }}
            />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              {t("cart.empty")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t("cart.emptySubtitle")}
            </Typography>
            <Link href="/products">
              <Button
                variant="contained"
                onClick={closeCart}
                sx={{ textTransform: "none" }}
              >
                {t("cart.continueShopping")}
              </Button>
            </Link>
          </Box>
        ) : (
          <>
            {/* Cart Items */}
            <Box sx={{ flex: 1, overflow: "auto" }}>
              <List sx={{ p: 0 }}>
                {items.map((item, index) => (
                  <React.Fragment key={item.product.id}>
                    <ListItem sx={{ p: 2, alignItems: "flex-start" }}>
                      <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
                        {/* Product Image */}
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 2,
                            overflow: "hidden",
                            bgcolor: "grey.100",
                            flexShrink: 0,
                          }}
                        >
                          {item.product.image_url ? (
                            <Image
                              src={item.product.image_url}
                              alt={item.product.name}
                              width={80}
                              height={80}
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <Box
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
                              <Typography variant="caption">
                                {t("admin.products.noImage")}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Product Details */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              mb: 0.5,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {item.product.name}
                          </Typography>

                          {item.product.category_name && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mb: 1 }}
                            >
                              {item.product.category_name}
                            </Typography>
                          )}

                          {/* Price */}
                          <Typography
                            variant="body2"
                            color="primary.main"
                            sx={{ fontWeight: 600, mb: 1 }}
                          >
                            {formatPrice(item.product.price)}
                          </Typography>

                          {/* Quantity Controls */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                                sx={{
                                  bgcolor: "grey.100",
                                  "&:hover": { bgcolor: "grey.200" },
                                }}
                              >
                                <Remove fontSize="small" />
                              </IconButton>

                              <TextField
                                size="small"
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
                                  width: 60,
                                  mx: 1,
                                  "& .MuiOutlinedInput-root": {
                                    height: 32,
                                  },
                                }}
                              />

                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={
                                  item.quantity >= item.product.stock_quantity
                                }
                                sx={{
                                  bgcolor: "grey.100",
                                  "&:hover": { bgcolor: "grey.200" },
                                }}
                              >
                                <Add fontSize="small" />
                              </IconButton>
                            </Box>

                            <IconButton
                              size="small"
                              onClick={() => removeItem(item.product.id)}
                              sx={{ color: "error.main" }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>

                          {/* Subtotal */}
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, mt: 1 }}
                          >
                            {t("common.subtotal")}: {formatPrice(item.subtotal)}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>

                    {index < items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>

            {/* Cart Summary */}
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 0,
                borderTop: 1,
                borderColor: "divider",
              }}
            >
              {/* Total */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t("cart.total")} (
                  {t("cart.itemsCount", { count: totalItems })})
                </Typography>
                <Typography
                  variant="h6"
                  color="primary.main"
                  sx={{ fontWeight: 700 }}
                >
                  {formatPrice(totalPrice)}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Link href="/checkout">
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={closeCart}
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                    }}
                  >
                    {t("cart.proceedToCheckout")}
                  </Button>
                </Link>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Link href="/cart" className="flex-1">
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={closeCart}
                      sx={{ textTransform: "none" }}
                    >
                      {t("cart.viewCart")}
                    </Button>
                  </Link>

                  <Button
                    variant="text"
                    color="error"
                    onClick={clearCart}
                    sx={{ textTransform: "none", minWidth: "auto", px: 2 }}
                  >
                    {t("cart.clear")}
                  </Button>
                </Box>
              </Box>

              {/* Continue Shopping */}
              <Link href="/products">
                <Typography
                  variant="body2"
                  color="primary.main"
                  sx={{
                    textAlign: "center",
                    mt: 2,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={closeCart}
                >
                  {t("cart.continueShopping")}
                </Typography>
              </Link>
            </Paper>
          </>
        )}
      </Box>
    </Drawer>
  );
}
