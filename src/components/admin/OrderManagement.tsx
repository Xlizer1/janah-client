"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Tabs,
  Tab,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Menu,
  Avatar,
  Badge,
} from "@mui/material";
import {
  Search,
  FilterList,
  MoreVert,
  Edit,
  Cancel,
  Visibility,
  Refresh,
  Receipt,
  LocalShipping,
  CheckCircle,
  Schedule,
  HourglassEmpty,
  Warning,
  Phone,
  LocationOn,
  CalendarToday,
  AttachMoney,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ordersService } from "@/services/orders.service";
import type { Order, OrderFilters } from "@/types";
import { format } from "date-fns";

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

export function OrderManagement() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: "status" | "cancel" | null;
    order: Order | null;
  }>({ open: false, type: null, order: null });
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    notes: "",
  });
  const [cancelReason, setCancelReason] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const filters: OrderFilters = {
    page: page + 1,
    limit: rowsPerPage,
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(searchQuery && { search: searchQuery }),
  };

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["adminOrders", selectedTab, filters],
    queryFn: () => {
      if (selectedTab === 0) {
        return ordersService.admin.getAllOrders(filters);
      } else {
        const statusMap = {
          1: "pending",
          2: "confirmed",
          3: "preparing",
          4: "ready_to_ship",
          5: "shipped",
          6: "delivered",
        };
        const status = statusMap[selectedTab as keyof typeof statusMap];
        return ordersService.admin.getOrdersByStatus(status, {
          page: page + 1,
          limit: rowsPerPage,
        });
      }
    },
  });

  const { data: statsData } = useQuery({
    queryKey: ["orderStatistics"],
    queryFn: () => ordersService.admin.getOrderStatistics(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: number;
      data: { status: string; notes?: string };
    }) => ordersService.admin.updateOrderStatus(orderId, data),
    onSuccess: () => {
      toast.success("Order status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      queryClient.invalidateQueries({ queryKey: ["orderStatistics"] });
      setActionDialog({ open: false, type: null, order: null });
      setStatusUpdate({ status: "", notes: "" });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: ({ orderId, reason }: { orderId: number; reason: string }) =>
      ordersService.admin.cancelOrder(orderId, reason),
    onSuccess: () => {
      toast.success("Order cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      queryClient.invalidateQueries({ queryKey: ["orderStatistics"] });
      setActionDialog({ open: false, type: null, order: null });
      setCancelReason("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    },
  });

  const handleStatusUpdate = (order: Order) => {
    setActionDialog({ open: true, type: "status", order });
  };

  const handleCancelOrder = (order: Order) => {
    setActionDialog({ open: true, type: "cancel", order });
  };

  const confirmStatusUpdate = () => {
    if (actionDialog.order && statusUpdate.status) {
      updateStatusMutation.mutate({
        orderId: actionDialog.order.id,
        data: statusUpdate,
      });
    }
  };

  const confirmCancelOrder = () => {
    if (actionDialog.order && cancelReason.trim()) {
      cancelOrderMutation.mutate({
        orderId: actionDialog.order.id,
        reason: cancelReason,
      });
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
    return <Icon fontSize="small" />;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    order: Order
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Order Management
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["adminOrders"] })
              }
            >
              Refresh
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <Receipt />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {statsData?.total_orders || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "warning.main" }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {statsData?.pending_orders || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Orders
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatPrice(statsData?.total_revenue || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "info.main" }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatPrice(statsData?.average_order_value || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Order Value
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search orders by number, customer, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                label="Status Filter"
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={<FilterList sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="preparing">Preparing</MenuItem>
                <MenuItem value="ready_to_ship">Ready to Ship</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => setDateRange(e.target.value)}
                startAdornment={<CalendarToday sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="quarter">This Quarter</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Tabs */}
      <Paper sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              label={`All Orders (${ordersData?.pagination?.total || 0})`}
              icon={<Receipt />}
              iconPosition="start"
            />
            <Tab
              label={`Pending (${statsData?.pending_orders || 0})`}
              icon={
                <Badge
                  badgeContent={statsData?.pending_orders || 0}
                  color="warning"
                >
                  <Schedule />
                </Badge>
              }
              iconPosition="start"
            />
            <Tab
              label={`Confirmed (${statsData?.confirmed_orders || 0})`}
              icon={<CheckCircle />}
              iconPosition="start"
            />
            <Tab
              label="Preparing"
              icon={<HourglassEmpty />}
              iconPosition="start"
            />
            <Tab
              label="Ready to Ship"
              icon={<LocalShipping />}
              iconPosition="start"
            />
            <Tab
              label="Shipped"
              icon={<LocalShipping />}
              iconPosition="start"
            />
            <Tab
              label="Delivered"
              icon={<CheckCircle />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Orders Table */}
        <TabPanel value={selectedTab} index={selectedTab}>
          {isLoading ? (
            <LinearProgress />
          ) : ordersData?.orders && ordersData.orders.length > 0 ? (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order #</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ordersData.orders.map((order) => (
                      <TableRow key={order.id} hover>
                        <TableCell>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {order.order_number}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              Customer #{order.user_id}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                mt: 0.5,
                              }}
                            >
                              <LocationOn
                                sx={{ fontSize: 14, color: "text.secondary" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {order.delivery_address.slice(0, 30)}...
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(order.status)}
                            label={order.status.replace("_", " ").toUpperCase()}
                            color={getStatusColor(order.status) as any}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {order.items_count || order.items?.length || 0} item
                            {(order.items_count || order.items?.length || 0) !==
                            1
                              ? "s"
                              : ""}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatPrice(order.total_amount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {format(new Date(order.created_at), "MMM dd, yyyy")}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(order.created_at), "HH:mm")}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={(e) => handleMenuClick(e, order)}
                            size="small"
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <TablePagination
                component="div"
                count={ordersData.pagination.total}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </>
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                No orders found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchQuery
                  ? `No orders match "${searchQuery}"`
                  : "No orders to display"}
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            router.push(`/admin/orders/${selectedOrder?.id}`);
            handleMenuClose();
          }}
        >
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {selectedOrder &&
          selectedOrder.status !== "cancelled" &&
          selectedOrder.status !== "delivered" && (
            <MenuItem
              onClick={() => {
                handleStatusUpdate(selectedOrder);
                handleMenuClose();
              }}
            >
              <Edit sx={{ mr: 1 }} />
              Update Status
            </MenuItem>
          )}
        {selectedOrder &&
          selectedOrder.status !== "cancelled" &&
          selectedOrder.status !== "delivered" && (
            <MenuItem
              onClick={() => {
                handleCancelOrder(selectedOrder);
                handleMenuClose();
              }}
            >
              <Cancel sx={{ mr: 1, color: "error.main" }} />
              Cancel Order
            </MenuItem>
          )}
      </Menu>

      {/* Status Update Dialog */}
      <Dialog
        open={actionDialog.open && actionDialog.type === "status"}
        onClose={() =>
          setActionDialog({ open: false, type: null, order: null })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
            <Alert severity="info">
              Update the status of order #{actionDialog.order?.order_number}
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
          <Button
            onClick={() =>
              setActionDialog({ open: false, type: null, order: null })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={confirmStatusUpdate}
            variant="contained"
            disabled={!statusUpdate.status || updateStatusMutation.isPending}
          >
            {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog
        open={actionDialog.open && actionDialog.type === "cancel"}
        onClose={() =>
          setActionDialog({ open: false, type: null, order: null })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
            <Alert severity="warning">
              Are you sure you want to cancel order #
              {actionDialog.order?.order_number}? This action cannot be undone.
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
          <Button
            onClick={() =>
              setActionDialog({ open: false, type: null, order: null })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={confirmCancelOrder}
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
