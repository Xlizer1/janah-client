"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Breadcrumbs,
} from "@mui/material";

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";

import {
  ArrowBack,
  Edit,
  Cancel,
  Print,
  LocalShipping,
  CheckCircle,
  Schedule,
  HourglassEmpty,
  Warning,
  LocationOn,
  Phone,
  Person,
  Receipt,
  Inventory,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ordersService } from "@/services/orders.service";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/store/auth.store";
import { format } from "date-fns";
import Link from "next/link";

// Protect admin route
function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullHeight />;
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <Box sx={{ p: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          You don't have permission to access this page.
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}

function OrderDetailContent() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const orderId = Number(params.id);

  const [statusDialog, setStatusDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    notes: "",
  });
  const [cancelReason, setCancelReason] = useState("");

  // Fetch order details
  const { data: orderData, isLoading } = useQuery({
    queryKey: ["adminOrder", orderId],
    queryFn: () => ordersService.admin.getOrder(orderId),
    enabled: !!orderId,
  });

  // Fetch order history
  const { data: historyData } = useQuery({
    queryKey: ["orderHistory", orderId],
    queryFn: () => ordersService.admin.getOrderHistory(orderId),
    enabled: !!orderId,
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (data: { status: string; notes?: string }) =>
      ordersService.admin.updateOrderStatus(orderId, data),
    onSuccess: () => {
      toast.success("Order status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminOrder", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orderHistory", orderId] });
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      setStatusDialog(false);
      setStatusUpdate({ status: "", notes: "" });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    },
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: (reason: string) =>
      ordersService.admin.cancelOrder(orderId, reason),
    onSuccess: () => {
      toast.success("Order cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["adminOrder", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orderHistory", orderId] });
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      setCancelDialog(false);
      setCancelReason("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    },
  });

  const handleStatusUpdate = () => {
    if (statusUpdate.status) {
      updateStatusMutation.mutate(statusUpdate);
    }
  };

  const handleCancelOrder = () => {
    if (cancelReason.trim()) {
      cancelOrderMutation.mutate(cancelReason);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "warning",
      confirmed: "info",
      preparing: "primary",
      ready_to_ship: "secondary",
      shipped: "default",
      delivered: "success",
      cancelled: "error",
    };
    return colors[status as keyof typeof colors] || "default";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Schedule,
      confirmed: CheckCircle,
      preparing: HourglassEmpty,
      ready_to_ship: LocalShipping,
      shipped: LocalShipping,
      delivered: CheckCircle,
      cancelled: Cancel,
    };
    const Icon = icons[status as keyof typeof icons] || Schedule;
    return Icon;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading order details..." />;
  }

  if (!orderData?.order) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="error">
          Order not found
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => router.push("/admin/orders")}
          sx={{ mt: 2 }}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  const order = orderData.order;
  const StatusIcon = getStatusIcon(order.status);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/admin">
            <Typography color="text.secondary" sx={{ cursor: "pointer" }}>
              Admin
            </Typography>
          </Link>
          <Link href="/admin/orders">
            <Typography color="text.secondary" sx={{ cursor: "pointer" }}>
              Orders
            </Typography>
          </Link>
          <Typography color="primary.main">{order.order_number}</Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Order #{order.order_number}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Chip
                icon={<StatusIcon />}
                label={order.status.replace("_", " ").toUpperCase()}
                color={getStatusColor(order.status) as any}
                size="medium"
                sx={{ fontWeight: 600 }}
              />
              <Typography variant="body2" color="text.secondary">
                Created {format(new Date(order.created_at), "PPp")}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => router.push("/admin/orders")}
            >
              Back to Orders
            </Button>
            <Button variant="outlined" startIcon={<Print />}>
              Print
            </Button>
            {order.status !== "cancelled" && order.status !== "delivered" && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setStatusDialog(true)}
                >
                  Update Status
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => setCancelDialog(true)}
                >
                  Cancel Order
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Order Items
            </Typography>

            <List>
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemAvatar>
                        <Avatar
                          src={item.product_image_url}
                          sx={{ width: 60, height: 60, borderRadius: 2 }}
                        >
                          <Inventory />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        sx={{ ml: 2 }}
                        primary={
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600 }}
                          >
                            {item.product_name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Quantity: {item.quantity} ×{" "}
                              {formatPrice(item.unit_price)}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, mt: 0.5 }}
                            >
                              Subtotal: {formatPrice(item.total_price)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < order.items!.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body2" color="text.secondary">
                        No items found for this order
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Order Total */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Box sx={{ minWidth: 200 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total Amount:
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    sx={{ fontWeight: 700 }}
                  >
                    {formatPrice(order.total_amount)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Order History */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Order History
            </Typography>

            {historyData?.history && historyData.history.length > 0 ? (
              <Timeline>
                {historyData.history.map((entry, index) => {
                  const EntryIcon = getStatusIcon(entry.status);
                  return (
                    <TimelineItem key={entry.id}>
                      <TimelineSeparator>
                        <TimelineDot
                          color={getStatusColor(entry.status) as any}
                          sx={{ p: 1 }}
                        >
                          <EntryIcon fontSize="small" />
                        </TimelineDot>
                        {index < historyData.history.length - 1 && (
                          <TimelineConnector />
                        )}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Box
                          sx={{
                            mb: index < historyData.history.length - 1 ? 3 : 0,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {entry.status.replace("_", " ").toUpperCase()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(entry.created_at), "PPp")}
                            {entry.created_by && ` by ${entry.created_by}`}
                          </Typography>
                          {entry.notes && (
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {entry.notes}
                            </Typography>
                          )}
                        </Box>
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
              </Timeline>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No history available
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Order Info Sidebar */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Customer Info */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Customer Information
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Person fontSize="small" color="action" />
                  <Typography variant="body2">
                    Customer ID: #{order.user_id}
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => router.push(`/admin/users/${order.user_id}`)}
                >
                  View Customer Profile
                </Button>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Delivery Information
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <LocationOn
                      fontSize="small"
                      color="action"
                      sx={{ mt: 0.2 }}
                    />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Delivery Address:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.delivery_address}
                      </Typography>
                    </Box>
                  </Box>

                  {order.delivery_notes && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Delivery Notes:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.delivery_notes}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Order Dates */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Important Dates
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Order Created:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(order.created_at), "PPp")}
                    </Typography>
                  </Box>

                  {order.confirmed_at && (
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Confirmed:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(order.confirmed_at), "PPp")}
                      </Typography>
                    </Box>
                  )}

                  {order.shipped_at && (
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Shipped:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(order.shipped_at), "PPp")}
                      </Typography>
                    </Box>
                  )}

                  {order.delivered_at && (
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Delivered:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(order.delivered_at), "PPp")}
                      </Typography>
                    </Box>
                  )}

                  {order.cancelled_at && (
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Cancelled:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(order.cancelled_at), "PPp")}
                      </Typography>
                      {order.cancellation_reason && (
                        <Typography
                          variant="body2"
                          color="error.main"
                          sx={{ mt: 0.5 }}
                        >
                          Reason: {order.cancellation_reason}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Status Update Dialog */}
      <Dialog
        open={statusDialog}
        onClose={() => setStatusDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
            <Alert severity="info">
              Update the status of order #{order.order_number}
            </Alert>

            <FormControl fullWidth>
              <InputLabel>New Status</InputLabel>
              <Select
                value={statusUpdate.status}
                label="New Status"
                onChange={(e) =>
                  setStatusUpdate((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="preparing">Preparing</MenuItem>
                <MenuItem value="ready_to_ship">Ready to Ship</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Notes (Optional)"
              multiline
              rows={3}
              value={statusUpdate.notes}
              onChange={(e) =>
                setStatusUpdate((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Add any notes about this status update..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={!statusUpdate.status || updateStatusMutation.isPending}
          >
            {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog
        open={cancelDialog}
        onClose={() => setCancelDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
            <Alert severity="warning">
              Are you sure you want to cancel order #{order.order_number}? This
              action cannot be undone.
            </Alert>

            <TextField
              label="Cancellation Reason"
              multiline
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please provide a reason for cancelling this order..."
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCancelOrder}
            variant="contained"
            color="error"
            disabled={!cancelReason.trim() || cancelOrderMutation.isPending}
          >
            {cancelOrderMutation.isPending ? "Cancelling..." : "Cancel Order"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function OrderDetailPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <OrderDetailContent />
      </AdminLayout>
    </AdminGuard>
  );
}
