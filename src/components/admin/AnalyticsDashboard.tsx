// src/components/admin/AnalyticsDashboard.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Chip,
  IconButton,
  Button,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Category,
  Inventory,
  People,
  AttachMoney,
  Refresh,
  GetApp,
  DateRange,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { adminService } from "@/services/admin.service";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("30d");

  const { data: categoryAnalytics, isLoading: categoryLoading } = useQuery({
    queryKey: ["categoryAnalytics", dateRange],
    queryFn: () => adminService.analytics.getCategoryAnalytics(),
  });

  const { data: inventoryData, isLoading: inventoryLoading } = useQuery({
    queryKey: ["inventoryAnalytics"],
    queryFn: () => adminService.analytics.getInventoryByCategory(),
  });

  const { data: attentionData } = useQuery({
    queryKey: ["productsNeedingAttention"],
    queryFn: () => adminService.analytics.getProductsNeedingAttention(),
  });

  const { data: statsData } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => adminService.getStats(),
  });

  // Mock data for charts
  const salesData = [
    { name: "Jan", sales: 4000, revenue: 2400 },
    { name: "Feb", sales: 3000, revenue: 1398 },
    { name: "Mar", sales: 2000, revenue: 9800 },
    { name: "Apr", sales: 2780, revenue: 3908 },
    { name: "May", sales: 1890, revenue: 4800 },
    { name: "Jun", sales: 2390, revenue: 3800 },
  ];

  const handleExport = () => {
    // TODO: Implement analytics export
    console.log("Export analytics data");
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
            Analytics Dashboard
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => setDateRange(e.target.value)}
              >
                <MenuItem value="7d">Last 7 days</MenuItem>
                <MenuItem value="30d">Last 30 days</MenuItem>
                <MenuItem value="90d">Last 90 days</MenuItem>
                <MenuItem value="1y">Last year</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<GetApp />}
              onClick={handleExport}
            >
              Export
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* KPI Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <AttachMoney />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    $24,560
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <TrendingUp sx={{ fontSize: 16, color: "success.main" }} />
                    <Typography variant="caption" color="success.main">
                      +12.5%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    bgcolor: "success.main",
                    color: "white",
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <Inventory />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    1,247
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Products Sold
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <TrendingUp sx={{ fontSize: 16, color: "success.main" }} />
                    <Typography variant="caption" color="success.main">
                      +8.2%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    bgcolor: "warning.main",
                    color: "white",
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <People />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {statsData?.stats?.active_users || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Users
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <TrendingDown sx={{ fontSize: 16, color: "error.main" }} />
                    <Typography variant="caption" color="error.main">
                      -2.4%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    bgcolor: "info.main",
                    color: "white",
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <TrendingUp />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    3.2%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conversion Rate
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <TrendingUp sx={{ fontSize: 16, color: "success.main" }} />
                    <Typography variant="caption" color="success.main">
                      +0.5%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sales Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Sales & Revenue Trends"
              action={
                <IconButton>
                  <DateRange />
                </IconButton>
              }
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Performance */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Category Performance" />
            <CardContent>
              {categoryLoading ? (
                <LinearProgress />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryAnalytics?.analytics?.slice(0, 5) || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category_name, percent }) =>
                        `${category_name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total_products"
                    >
                      {(categoryAnalytics?.analytics || []).map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Categories Table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Top Categories" />
            <CardContent>
              {categoryLoading ? (
                <LinearProgress />
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Products</TableCell>
                        <TableCell align="right">Avg Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(categoryAnalytics?.analytics || [])
                        .slice(0, 5)
                        .map((category) => {
                          let avgPrice =
                            category.avg_price != null
                              ? typeof category.avg_price === "string"
                                ? parseFloat(category.avg_price).toFixed(2)
                                : category.avg_price.toFixed(2)
                              : "N/A";

                          return (
                            <TableRow key={category.id}>
                              <TableCell>{category.category_name}</TableCell>
                              <TableCell align="right">
                                {category.total_products}
                              </TableCell>
                              <TableCell align="right">${avgPrice}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Products Needing Attention */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Products Needing Attention" />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Issue</TableCell>
                      <TableCell align="right">Stock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(attentionData?.products || [])
                      .slice(0, 5)
                      .map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {product.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {product.category_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell align="right">
                            {product.stock_quantity}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory Overview */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Inventory Overview by Category" />
            <CardContent>
              {inventoryLoading ? (
                <LinearProgress />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={inventoryData?.inventory || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category_name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="in_stock" fill="#8884d8" name="In Stock" />
                    <Bar
                      dataKey="out_of_stock"
                      fill="#82ca9d"
                      name="Out of Stock"
                    />
                    <Bar dataKey="low_stock" fill="#ffc658" name="Low Stock" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
