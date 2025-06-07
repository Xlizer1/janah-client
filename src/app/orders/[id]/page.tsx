"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepIcon,
  Alert,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import {
  ArrowBack,
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  Cancel,
  Schedule,
  LocationOn,
  Phone,
  Person,
  Receipt,
  Inventory,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Image from "next/image";

import { MainLayout } from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/store/auth.store";
import { ordersService } from "@/services/orders.service";
import { useTranslation } from "@/hooks/useTranslation";
import { OrderItem } from "@/types";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const orderId = parseInt(params.id as string);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/orders");
    }
  }, [isAuthenticated, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["myOrder", orderId],
    queryFn: () => ordersService.customer.getMyOrder(orderId),
    enabled: isAuthenticated && !isNaN(orderId),
  });

  const order = data?.order;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "IQD",
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "preparing":
        return "primary";
      case "ready_to_ship":
        return "secondary";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle />;
      case "shipped":
        return <LocalShipping />;
      case "cancelled":
        return <Cancel />;
      default:
        return <ShoppingBag />;
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getOrderSteps = () => {
    const steps = [
      { key: "pending", label: "Order Placed", icon: <Receipt /> },
      { key: "confirmed", label: "Confirmed", icon: <CheckCircle /> },
      { key: "preparing", label: "Preparing", icon: <Inventory /> },
      { key: "ready_to_ship", label: "Ready to Ship", icon: <Schedule /> },
      { key: "shipped", label: "Shipped", icon: <LocalShipping /> },
      { key: "delivered", label: "Delivered", icon: <CheckCircle /> },
    ];

    const currentStepIndex = steps.findIndex(
      (step) => step.key === order?.status
    );
    return { steps, currentStepIndex };
  };

  const calculateProfitStats = (items: OrderItem[]) => {
    const stats = items.reduce(
      (acc, item) => {
        if (item.selling_price) {
          const itemProfit =
            (item.selling_price - item.unit_price) * item.quantity;
          const itemRevenue = item.selling_price * item.quantity;
          acc.totalProfit += itemProfit;
          acc.totalRevenue += itemRevenue;
          acc.itemsWithSelling += 1;
        }
        acc.totalItems += 1;
        return acc;
      },
      {
        totalProfit: 0,
        totalRevenue: 0,
        itemsWithSelling: 0,
        totalItems: 0,
      }
    );

    return {
      ...stats,
      avgMargin:
        stats.totalRevenue > 0
          ? ((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1)
          : "0",
    };
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <LoadingSpinner fullHeight />
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner fullHeight message="Loading order details..." />
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <Container sx={{ py: 8, textAlign: "center" }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error ? "Failed to load order details" : "Order not found"}
          </Alert>
          <Button variant="contained" onClick={() => router.push("/orders")}>
            Back to Orders
          </Button>
        </Container>
      </MainLayout>
    );
  }

  const { steps, currentStepIndex } = getOrderSteps();

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push("/orders")}
            sx={{ mb: 2 }}
          >
            Back to Orders
          </Button>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Order #{order.order_number}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Placed on{" "}
                {format(
                  new Date(order.created_at),
                  "MMMM dd, yyyy 'at' hh:mm a"
                )}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Chip
                icon={getStatusIcon(order.status)}
                label={formatStatus(order.status)}
                color={getStatusColor(order.status) as any}
                size="medium"
                sx={{ fontWeight: 600, px: 2 }}
              />
              <Button
                variant="outlined"
                startIcon={<LocalShipping />}
                onClick={() =>
                  router.push(`/orders/track/${order.order_number}`)
                }
              >
                Track Order
              </Button>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            {/* Order Status Progress */}
            {order.status !== "cancelled" && (
              <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Order Progress
                </Typography>
                <Stepper
                  activeStep={currentStepIndex}
                  alternativeLabel
                  sx={{
                    "& .MuiStepLabel-root .Mui-completed": {
                      color: "success.main",
                    },
                    "& .MuiStepLabel-root .Mui-active": {
                      color: "primary.main",
                    },
                  }}
                >
                  {steps.map((step, index) => (
                    <Step key={step.key} completed={index <= currentStepIndex}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor:
                                index <= currentStepIndex
                                  ? "primary.main"
                                  : "grey.300",
                              color: "white",
                            }}
                          >
                            {step.icon}
                          </Box>
                        )}
                      >
                        {step.label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Paper>
            )}

            {/* Order Items */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Order Items ({order.items?.length || 0})
              </Typography>
              {/* Profit Summary */}
              {order.items &&
                order.items.some((item) => item.selling_price) && (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2" fontWeight={600}>
                      Wholesale Order Analytics:
                    </Typography>
                    {(() => {
                      const stats = calculateProfitStats(order.items);
                      return (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2">
                            • Potential Revenue:{" "}
                            {formatPrice(stats.totalRevenue)}
                          </Typography>
                          <Typography variant="body2">
                            • Estimated Profit: {formatPrice(stats.totalProfit)}
                          </Typography>
                          <Typography variant="body2">
                            • Average Margin: {stats.avgMargin}%
                          </Typography>
                          <Typography variant="body2">
                            • Items with selling price: {stats.itemsWithSelling}
                            /{stats.totalItems}
                          </Typography>
                        </Box>
                      );
                    })()}
                  </Alert>
                )}
              <List>
                {(order.items || []).map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem sx={{ px: 0, py: 2, alignItems: "flex-start" }}>
                      <ListItemAvatar sx={{ mr: 2 }}>
                        <Avatar
                          sx={{ width: 80, height: 80, borderRadius: 2 }}
                          variant="rounded"
                        >
                          {item.product_image_url ? (
                            <Image
                              src={item.product_image_url}
                              alt={item.product_name}
                              width={80}
                              height={80}
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <ShoppingBag />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 1 }}
                          >
                            {item.product_name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              Quantity: {item.quantity}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              Purchase Price: {formatPrice(item.unit_price)}{" "}
                              each
                            </Typography>
                            <Typography
                              variant="h6"
                              color="primary.main"
                              sx={{ fontWeight: 700, mb: 1 }}
                            >
                              Purchase Total: {formatPrice(item.total_price)}
                            </Typography>

                            {/* Selling Price Information */}
                            {item.selling_price ? (
                              <Box
                                sx={{
                                  mt: 2,
                                  p: 2,
                                  bgcolor: "success.50",
                                  borderRadius: 1,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="success.dark"
                                  fontWeight={600}
                                  sx={{ mb: 0.5 }}
                                >
                                  Your Selling Price:{" "}
                                  {formatPrice(item.selling_price)} each
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="success.dark"
                                  sx={{ mb: 0.5 }}
                                >
                                  Potential Revenue:{" "}
                                  {formatPrice(
                                    item.selling_price * item.quantity
                                  )}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="success.main"
                                  fontWeight={600}
                                >
                                  Profit per item:{" "}
                                  {formatPrice(
                                    item.selling_price - item.unit_price
                                  )}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Margin:{" "}
                                  {(
                                    ((item.selling_price - item.unit_price) /
                                      item.selling_price) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </Typography>
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  mt: 2,
                                  p: 2,
                                  bgcolor: "grey.100",
                                  borderRadius: 1,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  fontStyle="italic"
                                >
                                  No selling price provided for this item
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                      {item.product_slug && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            router.push(`/products/${item.product_slug}`)
                          }
                        >
                          View Product
                        </Button>
                      )}
                    </ListItem>
                    {index < (order.items?.length || 0) - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>

            {/* Delivery Information */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                <LocationOn sx={{ mr: 1, verticalAlign: "middle" }} />
                Delivery Information
              </Typography>
              <Card sx={{ bgcolor: "grey.50" }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        <Person
                          sx={{ mr: 1, verticalAlign: "middle", fontSize: 18 }}
                        />
                        Customer Details
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        {user?.first_name} {user?.last_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <Phone
                          sx={{ mr: 1, verticalAlign: "middle", fontSize: 16 }}
                        />
                        {user?.phone_number}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        <LocationOn
                          sx={{ mr: 1, verticalAlign: "middle", fontSize: 18 }}
                        />
                        Delivery Address
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {order.delivery_address}
                      </Typography>
                      {order.delivery_notes && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Notes:</strong> {order.delivery_notes}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Paper>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            {/* Order Summary */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Order Summary
              </Typography>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Purchase Cost ({order.items?.length}):</Typography>
                <Typography>{formatPrice(order.total_amount)}</Typography>
              </Box>

              {/* Show potential revenue if selling prices are available */}
              {order.items &&
                order.items.some((item) => item.selling_price) &&
                (() => {
                  const stats = calculateProfitStats(order.items);
                  return (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography color="success.main">
                          Potential Revenue:
                        </Typography>
                        <Typography color="success.main" fontWeight={600}>
                          {formatPrice(stats.totalRevenue)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography color="success.main">
                          Estimated Profit:
                        </Typography>
                        <Typography color="success.main" fontWeight={700}>
                          {formatPrice(stats.totalProfit)}
                        </Typography>
                      </Box>
                    </>
                  );
                })()}

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Delivery:</Typography>
                <Typography color="success.main">Free</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total Paid:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700 }}
                  color="primary.main"
                >
                  {formatPrice(order.total_amount)}
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Payment: Cash on Delivery
                </Typography>
              </Alert>

              {order.status === "pending" && (
                <Alert severity="warning">
                  <Typography variant="body2">
                    Your order is being reviewed and will be confirmed shortly.
                  </Typography>
                </Alert>
              )}

              {order.status === "delivered" && (
                <Alert severity="success">
                  <Typography variant="body2">
                    Order delivered successfully! Thank you for shopping with
                    us.
                  </Typography>
                </Alert>
              )}

              {order.status === "cancelled" && (
                <Alert severity="error">
                  <Typography variant="body2">
                    This order has been cancelled.
                    {order.cancellation_reason && (
                      <span> Reason: {order.cancellation_reason}</span>
                    )}
                  </Typography>
                </Alert>
              )}
            </Paper>

            {/* Order Dates */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Important Dates
              </Typography>

              <Timeline position="left">
                <TimelineItem>
                  <TimelineOppositeContent sx={{ flex: 0.3 }}>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(order.created_at), "MMM dd")}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="primary">
                      <Receipt />
                    </TimelineDot>
                    {order.confirmed_at && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="body2" fontWeight={600}>
                      Order Placed
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(order.created_at), "hh:mm a")}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                {order.confirmed_at && (
                  <TimelineItem>
                    <TimelineOppositeContent sx={{ flex: 0.3 }}>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(order.confirmed_at), "MMM dd")}
                      </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="success">
                        <CheckCircle />
                      </TimelineDot>
                      {order.shipped_at && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2" fontWeight={600}>
                        Order Confirmed
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(order.confirmed_at), "hh:mm a")}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                )}

                {order.shipped_at && (
                  <TimelineItem>
                    <TimelineOppositeContent sx={{ flex: 0.3 }}>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(order.shipped_at), "MMM dd")}
                      </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="primary">
                        <LocalShipping />
                      </TimelineDot>
                      {order.delivered_at && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2" fontWeight={600}>
                        Order Shipped
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(order.shipped_at), "hh:mm a")}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                )}

                {order.delivered_at && (
                  <TimelineItem>
                    <TimelineOppositeContent sx={{ flex: 0.3 }}>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(order.delivered_at), "MMM dd")}
                      </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="success">
                        <CheckCircle />
                      </TimelineDot>
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2" fontWeight={600}>
                        Order Delivered
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(order.delivered_at), "hh:mm a")}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                )}
              </Timeline>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}
