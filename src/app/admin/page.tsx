"use client";

import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Avatar,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  People,
  Inventory,
  Category,
  ShoppingCart,
  Warning,
  CheckCircle,
  MoreVert,
  Refresh,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { adminService } from "@/services/admin.service";
import { useAuth } from "@/store/auth.store";

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

function DashboardContent() {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => adminService.getStats(),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["topCategories"],
    queryFn: () => adminService.analytics.getTopCategories(5),
  });

  const { data: attentionData } = useQuery({
    queryKey: ["productsNeedingAttention"],
    queryFn: () => adminService.analytics.getProductsNeedingAttention(),
  });

  const stats = statsData?.stats;

  const metrics = [
    {
      title: "Total Revenue",
      value: "$45,231",
      change: "+12.5%",
      trend: "up",
      color: "primary",
      icon: TrendingUp,
    },
    {
      title: "Total Orders",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      color: "success",
      icon: ShoppingCart,
    },
    {
      title: "Products Sold",
      value: "3,456",
      change: "-2.4%",
      trend: "down",
      color: "warning",
      icon: Inventory,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.5%",
      trend: "up",
      color: "info",
      icon: TrendingUp,
    },
  ];

  if (statsLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <Box>
      {/* Page Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Dashboard Overview
        </Typography>
        <IconButton>
          <Refresh />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats?.total_users || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={
                  stats ? (stats.active_users / stats.total_users) * 100 : 0
                }
                sx={{ mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {stats?.active_users || 0} active users
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats?.pending_activation || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Approval
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="warning.main">
                Requires admin action
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats?.activation_rate || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Activation Rate
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="success.main">
                User activation success
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "error.main", mr: 2 }}>
                  <Warning />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats?.unverified_phone || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unverified Phone
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="error.main">
                Need phone verification
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Business Metrics */}
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <metric.icon color={metric.color as any} />
                  <Chip
                    label={metric.change}
                    color={metric.trend === "up" ? "success" : "error"}
                    size="small"
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Top Categories */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Top Categories
            </Typography>
            <List>
              {categoriesData?.categories.slice(0, 5).map((category) => (
                <ListItem key={category.id}>
                  <ListItemText
                    primary={category.category_name}
                    secondary={`${category.total_products} products`}
                  />
                  <ListItemSecondaryAction>
                    <Typography variant="body2" color="primary.main">
                      ${category.avg_price?.toFixed(2) || "0.00"}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Products Needing Attention */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Products Need Attention
              </Typography>
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Box>
            <List>
              {attentionData?.products.slice(0, 5).map((product) => (
                <ListItem key={product.id}>
                  <ListItemText
                    primary={product.name}
                    secondary={product.category_name}
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={product.issue_type}
                      color={
                        product.issue_type === "Out of Stock"
                          ? "error"
                          : product.issue_type === "Low Stock"
                          ? "warning"
                          : "default"
                      }
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Recent Activity
            </Typography>
            <List>
              <ListItem>
                <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <ListItemText
                  primary="User John Doe activated"
                  secondary="2 minutes ago"
                />
              </ListItem>
              <ListItem>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <Inventory />
                </Avatar>
                <ListItemText
                  primary="New product 'iPhone 15 Pro' added"
                  secondary="15 minutes ago"
                />
              </ListItem>
              <ListItem>
                <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                  <Warning />
                </Avatar>
                <ListItemText
                  primary="Product 'Samsung Galaxy S24' low stock"
                  secondary="1 hour ago"
                />
              </ListItem>
              <ListItem>
                <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                  <People />
                </Avatar>
                <ListItemText
                  primary="New user registration: Jane Smith"
                  secondary="2 hours ago"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <DashboardContent />
      </AdminLayout>
    </AdminGuard>
  );
}
