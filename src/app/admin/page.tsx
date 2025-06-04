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
import { useTranslation } from "@/hooks/useTranslation";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingSpinner fullHeight />;
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <Box sx={{ p: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          {t("admin.accessDenied")}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {t("admin.noPermission")}
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}

function DashboardContent() {
  const { t } = useTranslation();
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
      title: t("admin.dashboard.totalRevenue"),
      value: "$45,231",
      change: "+12.5%",
      trend: "up",
      color: "primary",
      icon: TrendingUp,
    },
    {
      title: t("orders.management"),
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      color: "success",
      icon: ShoppingCart,
    },
    {
      title: t("admin.dashboard.productsSold"),
      value: "3,456",
      change: "-2.4%",
      trend: "down",
      color: "warning",
      icon: Inventory,
    },
    {
      title: t("admin.dashboard.conversionRate"),
      value: "3.2%",
      change: "+0.5%",
      trend: "up",
      color: "info",
      icon: TrendingUp,
    },
  ];

  if (statsLoading) {
    return <LoadingSpinner message={t("admin.dashboard.loading")} />;
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
          {t("admin.dashboard.overview")}
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
                    {t("admin.dashboard.totalUsers")}
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
                {stats?.active_users || 0} {t("admin.dashboard.activeUsers")}
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
                    {t("admin.dashboard.pendingActivation")}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="warning.main">
                {t("admin.dashboard.requiresAdminAction")}
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
                    {t("admin.dashboard.activationRate")}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="success.main">
                {t("admin.dashboard.userActivationSuccess")}
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
                    {t("admin.dashboard.unverifiedPhone")}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="error.main">
                {t("admin.dashboard.needPhoneVerification")}
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
              {t("admin.dashboard.topCategories")}
            </Typography>
            <List>
              {categoriesData?.categories.slice(0, 5).map((category) => (
                <ListItem key={category.id}>
                  <ListItemText
                    primary={category.category_name}
                    secondary={`${category.total_products} ${t(
                      "admin.categories.productCount"
                    )}`}
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
                {t("admin.dashboard.productsNeedingAttention")}
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
              {t("admin.dashboard.recentActivity")}
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
