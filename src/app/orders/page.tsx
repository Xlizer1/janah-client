// src/app/orders/page.tsx - Fixed version
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Alert,
} from "@mui/material";
import {
  Search,
  FilterList,
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  Cancel,
  Visibility,
  CalendarToday,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Image from "next/image";

import { MainLayout } from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/store/auth.store";
import { ordersService } from "@/services/orders.service";
import type { OrderFilters } from "@/types";

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 10,
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/orders");
    }
  }, [isAuthenticated, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["myOrders", filters],
    queryFn: () => ordersService.customer.getMyOrders(filters),
    enabled: isAuthenticated,
  });

  const handleFilterChange = (newFilters: Partial<OrderFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      handleFilterChange({ search: searchQuery.trim() });
    } else {
      handleFilterChange({ search: undefined });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <LoadingSpinner fullHeight />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Container sx={{ py: 8, textAlign: "center" }}>
          <Alert severity="error">
            Failed to load orders. Please try again.
          </Alert>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            My Orders
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {data?.pagination?.total
              ? `${data.pagination.total} orders found`
              : "Loading orders..."}
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by order number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={handleSearch}
                        variant="contained"
                        size="small"
                      >
                        Search
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={filters.status || ""}
                  label="Status Filter"
                  onChange={(e) =>
                    handleFilterChange({
                      status: e.target.value || undefined,
                    })
                  }
                  startAdornment={<FilterList sx={{ mr: 1 }} />}
                >
                  <MenuItem value="">All Orders</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="preparing">Preparing</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => router.push("/products")}
              >
                Continue Shopping
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Orders List */}
        {isLoading ? (
          <LoadingSpinner message="Loading orders..." />
        ) : data?.orders?.length ? (
          <>
            <Grid container spacing={3}>
              {data.orders.map((order) => (
                <Grid item xs={12} key={order.id}>
                  <Card sx={{ overflow: "hidden" }}>
                    <CardContent sx={{ p: 0 }}>
                      {/* Order Header */}
                      <Box
                        sx={{
                          p: 3,
                          bgcolor: "grey.50",
                          borderBottom: 1,
                          borderColor: "divider",
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Order Number
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              #{order.order_number}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={2}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Status
                            </Typography>
                            <Box>
                              <Chip
                                icon={getStatusIcon(order.status)}
                                label={formatStatus(order.status)}
                                color={getStatusColor(order.status) as any}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6} md={2}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Order Date
                            </Typography>
                            <Typography variant="body2">
                              {format(
                                new Date(order.created_at),
                                "MMM dd, yyyy"
                              )}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={2}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Total Amount
                            </Typography>
                            <Typography
                              variant="h6"
                              color="primary.main"
                              sx={{ fontWeight: 700 }}
                            >
                              {formatPrice(order.total_amount)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                justifyContent: "flex-end",
                              }}
                            >
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Visibility />}
                                onClick={() =>
                                  router.push(`/orders/${order.id}`)
                                }
                              >
                                View Details
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<LocalShipping />}
                                onClick={() =>
                                  router.push(
                                    `/orders/track/${order.order_number}`
                                  )
                                }
                              >
                                Track
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Order Items - FIXED: Added safe array access */}
                      <Box sx={{ p: 3 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, mb: 2 }}
                        >
                          Order Items ({order.items?.length || 0})
                        </Typography>
                        <List dense>
                          {/* SAFE ARRAY ACCESS: Check if items exists and has length */}
                          {order.items && order.items.length > 0 ? (
                            order.items.slice(0, 3).map((item, index) => (
                              <React.Fragment key={item.id}>
                                <ListItem sx={{ px: 0 }}>
                                  <ListItemAvatar>
                                    <Avatar
                                      sx={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 1,
                                      }}
                                      variant="rounded"
                                    >
                                      {item.product_image_url ? (
                                        <Image
                                          src={item.product_image_url}
                                          alt={item.product_name}
                                          width={50}
                                          height={50}
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
                                        variant="subtitle2"
                                        fontWeight={600}
                                      >
                                        {item.product_name}
                                      </Typography>
                                    }
                                    secondary={
                                      <Box>
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                        >
                                          Quantity: {item.quantity} ×{" "}
                                          {formatPrice(item.unit_price)}
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          color="primary.main"
                                          fontWeight={600}
                                        >
                                          Subtotal:{" "}
                                          {formatPrice(item.total_price)}
                                        </Typography>
                                      </Box>
                                    }
                                  />
                                </ListItem>
                                {index < Math.min((order.items?.length || 0) - 1, 2) && (
                                  <Divider />
                                )}
                              </React.Fragment>
                            ))
                          ) : (
                            /* Show message when no items */
                            <ListItem sx={{ px: 0, py: 1 }}>
                              <ListItemText>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  No items found in this order
                                </Typography>
                              </ListItemText>
                            </ListItem>
                          )}
                          
                          {/* Show "more items" message only if items exist and length > 3 */}
                          {order.items && order.items.length > 3 && (
                            <ListItem sx={{ px: 0, py: 1 }}>
                              <ListItemText>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  +{order.items.length - 3} more items
                                </Typography>
                              </ListItemText>
                            </ListItem>
                          )}
                        </List>

                        {/* Delivery Address */}
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            bgcolor: "grey.50",
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Delivery Address
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {order.delivery_address}
                          </Typography>
                          {order.delivery_notes && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              Notes: {order.delivery_notes}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {data.pagination && data.pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <Pagination
                  count={data.pagination.totalPages}
                  page={filters.page || 1}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <ShoppingBag sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              No orders found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {filters.status || searchQuery
                ? "No orders match your current filters"
                : "You haven't placed any orders yet"}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              {(filters.status || searchQuery) && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFilters({ page: 1, limit: 10 });
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              )}
              <Button
                variant="contained"
                onClick={() => router.push("/products")}
              >
                Start Shopping
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </MainLayout>
  );
}