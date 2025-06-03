// src/app/checkout/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Card,
  CardContent,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";
import {
  ShoppingCart,
  LocationOn,
  Payment,
  CheckCircle,
  ArrowBack,
  LocalShipping,
  AttachMoney,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";

import { MainLayout } from "@/components/layout/MainLayout";
import { useCart } from "@/store/cart.store";
import { useAuth } from "@/store/auth.store";
import { ordersService } from "@/services/orders.service";
import type { CheckoutFormData, OrderCreateData } from "@/types";

// Validation schema
const checkoutSchema = yup.object({
  delivery_address: yup
    .string()
    .required("Delivery address is required")
    .min(10, "Please provide a detailed address"),
  delivery_notes: yup.string().optional(),
  payment_method: yup.string().optional(),
});

const steps = ["Review Items", "Delivery Info", "Payment", "Confirmation"];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      payment_method: "cash_on_delivery",
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/checkout");
      return;
    }
  }, [isAuthenticated, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      router.push("/cart");
      return;
    }
  }, [items.length, orderSuccess, router]);

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: ordersService.customer.createOrder,
    onSuccess: (data) => {
      setOrderNumber(data.order.order_number);
      setOrderSuccess(true);
      clearCart();
      toast.success("Order placed successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to place order");
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = (data: CheckoutFormData) => {
    const orderData: OrderCreateData = {
      delivery_address: data.delivery_address,
      delivery_notes: data.delivery_notes,
      items: items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };

    createOrderMutation.mutate(orderData);
  };

  if (!isAuthenticated || items.length === 0) {
    return (
      <MainLayout>
        <Container sx={{ py: 8, textAlign: "center" }}>
          <CircularProgress />
        </Container>
      </MainLayout>
    );
  }

  if (orderSuccess) {
    return (
      <MainLayout>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
            <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Order Placed Successfully!
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.6 }}
            >
              Thank you for your order. Your order number is:{" "}
              <strong>{orderNumber}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mb: 4 }}>
              We'll send you an SMS notification with updates on your order
              status.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={() => router.push("/orders")}
              >
                View Orders
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push("/products")}
              >
                Continue Shopping
              </Button>
            </Box>
          </Paper>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push("/cart")}
            sx={{ mb: 2 }}
          >
            Back to Cart
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Checkout
          </Typography>
        </Box>

        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            {/* Left Column - Forms */}
            <Grid item xs={12} md={8}>
              {activeStep === 0 && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Review Your Items
                  </Typography>
                  <List>
                    {items.map((item, index) => (
                      <React.Fragment key={item.product.id}>
                        <ListItem sx={{ px: 0, py: 2 }}>
                          <ListItemAvatar sx={{ mr: 2 }}>
                            <Avatar
                              sx={{ width: 60, height: 60, borderRadius: 2 }}
                              variant="rounded"
                            >
                              {item.product.image_url ? (
                                <Image
                                  src={item.product.image_url}
                                  alt={item.product.name}
                                  width={60}
                                  height={60}
                                  style={{ objectFit: "cover" }}
                                />
                              ) : (
                                <ShoppingCart />
                              )}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight={600}>
                                {item.product.name}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Quantity: {item.quantity} ×{" "}
                                  {formatPrice(item.product.price)}
                                </Typography>
                                <Typography
                                  variant="subtitle2"
                                  color="primary.main"
                                  fontWeight={600}
                                >
                                  Subtotal: {formatPrice(item.subtotal)}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < items.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                  <Box sx={{ textAlign: "right", mt: 2 }}>
                    <Button variant="contained" onClick={handleNext}>
                      Continue to Delivery
                    </Button>
                  </Box>
                </Paper>
              )}

              {activeStep === 1 && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    <LocationOn sx={{ mr: 1, verticalAlign: "middle" }} />
                    Delivery Information
                  </Typography>

                  {/* Customer Info */}
                  <Card sx={{ mb: 3, bgcolor: "grey.50" }}>
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        Delivering to:
                      </Typography>
                      <Typography variant="body1">
                        {user?.first_name} {user?.last_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.phone_number}
                      </Typography>
                    </CardContent>
                  </Card>

                  <TextField
                    fullWidth
                    label="Delivery Address"
                    multiline
                    rows={3}
                    placeholder="Enter your complete delivery address..."
                    {...register("delivery_address")}
                    error={!!errors.delivery_address}
                    helperText={errors.delivery_address?.message}
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Delivery Notes (Optional)"
                    multiline
                    rows={2}
                    placeholder="Any special instructions for delivery..."
                    {...register("delivery_notes")}
                    error={!!errors.delivery_notes}
                    helperText={errors.delivery_notes?.message}
                    sx={{ mb: 3 }}
                  />

                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      Please provide a detailed address including landmarks for
                      accurate delivery.
                    </Typography>
                  </Alert>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button onClick={handleBack}>Back</Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={!watch("delivery_address")}
                    >
                      Continue to Payment
                    </Button>
                  </Box>
                </Paper>
              )}

              {activeStep === 2 && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    <Payment sx={{ mr: 1, verticalAlign: "middle" }} />
                    Payment Method
                  </Typography>

                  <FormControl component="fieldset" sx={{ mb: 3 }}>
                    <FormLabel component="legend">
                      Select Payment Method
                    </FormLabel>
                    <RadioGroup {...register("payment_method")}>
                      <FormControlLabel
                        value="cash_on_delivery"
                        control={<Radio />}
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <AttachMoney />
                            <Box>
                              <Typography variant="body1" fontWeight={600}>
                                Cash on Delivery
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Pay when your order is delivered
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>

                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      Currently, we only accept cash payments upon delivery. Our
                      delivery team will collect payment when your order
                      arrives.
                    </Typography>
                  </Alert>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button onClick={handleBack}>Back</Button>
                    <Button variant="contained" onClick={handleNext}>
                      Review Order
                    </Button>
                  </Box>
                </Paper>
              )}

              {activeStep === 3 && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    <CheckCircle sx={{ mr: 1, verticalAlign: "middle" }} />
                    Order Confirmation
                  </Typography>

                  {/* Order Summary */}
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mb: 2 }}
                      >
                        Order Summary
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography>Items ({totalItems}):</Typography>
                        <Typography>{formatPrice(totalPrice)}</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography>Delivery:</Typography>
                        <Typography color="success.main">Free</Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="h6" fontWeight={700}>
                          Total:
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="primary.main"
                        >
                          {formatPrice(totalPrice)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Delivery Info */}
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mb: 2 }}
                      >
                        Delivery Information
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Address:</strong> {watch("delivery_address")}
                      </Typography>
                      {watch("delivery_notes") && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Notes:</strong> {watch("delivery_notes")}
                        </Typography>
                      )}
                      <Typography variant="body2">
                        <strong>Payment:</strong> Cash on Delivery
                      </Typography>
                    </CardContent>
                  </Card>

                  <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      Please review your order carefully. Once placed, you can
                      track your order status but changes may not be possible.
                    </Typography>
                  </Alert>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button onClick={handleBack}>Back</Button>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={createOrderMutation.isPending}
                      sx={{ px: 4 }}
                    >
                      {createOrderMutation.isPending ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CircularProgress size={20} color="inherit" />
                          Placing Order...
                        </Box>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </Box>
                </Paper>
              )}
            </Grid>

            {/* Right Column - Order Summary */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, position: "sticky", top: 100 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Order Summary
                </Typography>

                <Box sx={{ mb: 3 }}>
                  {items.slice(0, 3).map((item) => (
                    <Box
                      key={item.product.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Avatar
                        sx={{ width: 40, height: 40, borderRadius: 1 }}
                        variant="rounded"
                      >
                        {item.product.image_url ? (
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            width={40}
                            height={40}
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <ShoppingCart />
                        )}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.quantity} × {formatPrice(item.product.price)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  {items.length > 3 && (
                    <Typography variant="caption" color="text.secondary">
                      +{items.length - 3} more items
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Subtotal:</Typography>
                  <Typography>{formatPrice(totalPrice)}</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Delivery:</Typography>
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
                  <Typography variant="h6" fontWeight={700}>
                    Total:
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {formatPrice(totalPrice)}
                  </Typography>
                </Box>

                {/* Delivery Info */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <LocalShipping color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    Free delivery within Baghdad
                  </Typography>
                </Box>

                <Alert severity="info">
                  <Typography variant="caption">
                    Your order will be delivered within 1-3 business days.
                  </Typography>
                </Alert>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </Container>
    </MainLayout>
  );
}
