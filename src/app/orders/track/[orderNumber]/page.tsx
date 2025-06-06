"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  LinearProgress,
  Grid,
} from "@mui/material";
import {
  ArrowBack,
  LocalShipping,
  CheckCircle,
  Schedule,
  Inventory,
  Receipt,
  LocationOn,
  Phone,
  Person,
  Cancel,
} from "@mui/icons-material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";

import { MainLayout } from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/store/auth.store";
import { ordersService } from "@/services/orders.service";
import { useTranslation } from "@/hooks/useTranslation";

export default function OrderTrackingPage() {
  const params = useParams();
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const orderNumber = params.orderNumber as string;

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/orders");
    }
  }, [isAuthenticated, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["trackOrder", orderNumber],
    queryFn: () => ordersService.customer.trackOrder(orderNumber),
    enabled: isAuthenticated && !!orderNumber,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const order = data?.order;
  const statusHistory = data?.status_history || [];

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
      case "pending":
        return <Schedule />;
      case "confirmed":
        return <CheckCircle />;
      case "preparing":
        return <Inventory />;
      case "ready_to_ship":
        return <LocalShipping />;
      case "shipped":
        return <LocalShipping />;
      case "delivered":
        return <CheckCircle />;
      case "cancelled":
        return <Cancel />;
      default:
        return <Receipt />;
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "pending":
        return 20;
      case "confirmed":
        return 40;
      case "preparing":
        return 60;
      case "ready_to_ship":
        return 70;
      case "shipped":
        return 85;
      case "delivered":
        return 100;
      case "cancelled":
        return 0;
      default:
        return 0;
    }
  };

  const getEstimatedDelivery = (status: string, createdAt: string) => {
    const orderDate = new Date(createdAt);
    const estimatedDays =
      status === "shipped" ? 1 : status === "confirmed" ? 2 : 3;
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);
    return estimatedDate;
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
        <LoadingSpinner fullHeight message="Loading tracking information..." />
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <Container sx={{ py: 8, textAlign: "center" }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error ? "Failed to load tracking information" : "Order not found"}
          </Alert>
          <Button variant="contained" onClick={() => router.push("/orders")}>
            Back to Orders
          </Button>
        </Container>
      </MainLayout>
    );
  }

  const estimatedDelivery = getEstimatedDelivery(
    order.status,
    order.created_at
  );
  const progressPercentage = getProgressPercentage(order.status);

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
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Track Order #{order.order_number}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time tracking for your order
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Tracking Info */}
          <Grid item xs={12} md={8}>
            {/* Current Status */}
            <Paper sx={{ p: 4, mb: 4, textAlign: "center" }}>
              <Box sx={{ mb: 3 }}>
                <Chip
                  icon={getStatusIcon(order.status)}
                  label={formatStatus(order.status)}
                  color={getStatusColor(order.status) as any}
                  size="medium"
                  sx={{
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    fontSize: "1.1rem",
                    "& .MuiChip-icon": {
                      fontSize: "1.2rem",
                    },
                  }}
                />
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                {order.status === "delivered" &&
                  "Your order has been delivered!"}
                {order.status === "shipped" && "Your order is on the way!"}
                {order.status === "ready_to_ship" &&
                  "Your order is ready to ship!"}
                {order.status === "preparing" && "We're preparing your order!"}
                {order.status === "confirmed" &&
                  "Your order has been confirmed!"}
                {order.status === "pending" && "We're processing your order!"}
                {order.status === "cancelled" &&
                  "Your order has been cancelled"}
              </Typography>

              {order.status !== "cancelled" && order.status !== "delivered" && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Estimated delivery:{" "}
                  {format(estimatedDelivery, "EEEE, MMMM dd")}
                </Typography>
              )}

              {order.status === "delivered" && order.delivered_at && (
                <Typography variant="body1" color="success.main" sx={{ mb: 3 }}>
                  Delivered on{" "}
                  {format(
                    new Date(order.delivered_at),
                    "EEEE, MMMM dd 'at' hh:mm a"
                  )}
                </Typography>
              )}

              {/* Progress Bar */}
              {order.status !== "cancelled" && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                        bgcolor:
                          order.status === "delivered"
                            ? "success.main"
                            : "primary.main",
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    {progressPercentage}% Complete
                  </Typography>
                </Box>
              )}

              {order.status === "shipped" && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    📱 You'll receive an SMS notification when your order is out
                    for delivery.
                  </Typography>
                </Alert>
              )}
            </Paper>

            {/* Order Timeline */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Order Timeline
              </Typography>

              <Timeline position="left">
                {statusHistory.map((historyItem, index) => {
                  const isLatest = index === 0;
                  return (
                    <TimelineItem key={historyItem.id}>
                      <TimelineOppositeContent sx={{ flex: 0.3, pr: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(historyItem.created_at), "MMM dd")}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {format(new Date(historyItem.created_at), "hh:mm a")}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {formatDistanceToNow(
                            new Date(historyItem.created_at),
                            { addSuffix: true }
                          )}
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot
                          color={isLatest ? "primary" : "grey"}
                          variant={isLatest ? "filled" : "outlined"}
                          sx={{
                            width: isLatest ? 16 : 12,
                            height: isLatest ? 16 : 12,
                          }}
                        >
                          {isLatest && getStatusIcon(historyItem.status)}
                        </TimelineDot>
                        {index < statusHistory.length - 1 && (
                          <TimelineConnector />
                        )}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography
                          variant="body1"
                          fontWeight={isLatest ? 600 : 400}
                          color={isLatest ? "primary.main" : "text.primary"}
                        >
                          {formatStatus(historyItem.status)}
                        </Typography>
                        {historyItem.notes && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {historyItem.notes}
                          </Typography>
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
              </Timeline>
            </Paper>
          </Grid>

          {/* Right Column - Order Info */}
          <Grid item xs={12} md={4}>
            {/* Order Summary */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Order Summary
              </Typography>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Order Number:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  #{order.order_number}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Order Date:</Typography>
                <Typography variant="body2">
                  {format(new Date(order.created_at), "MMM dd, yyyy")}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Items:</Typography>
                <Typography variant="body2">
                  {order.items?.length} item(s)
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="body2">Total Amount:</Typography>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color="primary.main"
                >
                  {formatPrice(order.total_amount)}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                View Full Order Details
              </Button>
            </Paper>

            {/* Delivery Information */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                <LocationOn sx={{ mr: 1, verticalAlign: "middle" }} />
                Delivery Information
              </Typography>

              <Card sx={{ bgcolor: "grey.50", mb: 2 }}>
                <CardContent sx={{ pb: "16px !important" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    <Person
                      sx={{ mr: 1, verticalAlign: "middle", fontSize: 18 }}
                    />
                    Delivery To
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
                </CardContent>
              </Card>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Address
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {order.delivery_address}
              </Typography>

              {order.delivery_notes && (
                <>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Delivery Notes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.delivery_notes}
                  </Typography>
                </>
              )}
            </Paper>

            {/* Support */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Need Help?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                If you have any questions about your order, feel free to contact
                us.
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button variant="outlined" fullWidth>
                  Contact Support
                </Button>
                <Button variant="text" fullWidth>
                  Track via SMS
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}
