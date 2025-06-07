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
import { useTranslation } from "@/hooks/useTranslation";
import { formatPrice, formatPriceCompact } from "@/utils/price";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function AnalyticsDashboard() {
  const { t } = useTranslation();
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

  // Mock data for charts - using realistic IQD amounts
  const salesData = [
    { name: t("common.january"), sales: 4000, revenue: 24000000 }, // 24M IQD
    { name: t("common.february"), sales: 3000, revenue: 13980000 }, // ~14M IQD
    { name: t("common.march"), sales: 2000, revenue: 98000000 }, // 98M IQD
    { name: t("common.april"), sales: 2780, revenue: 39080000 }, // ~39M IQD
    { name: t("common.may"), sales: 1890, revenue: 48000000 }, // 48M IQD
    { name: t("common.june"), sales: 2390, revenue: 38000000 }, // 38M IQD
  ];

  const handleExport = () => {
    // TODO: Implement analytics export
    console.log("Export analytics data");
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}:{" "}
              {entry.dataKey === "revenue"
                ? formatPriceCompact(entry.value)
                : entry.value.toLocaleString()}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
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
            {t("admin.analytics.title")}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t("admin.analytics.dateRange")}</InputLabel>
              <Select
                value={dateRange}
                label={t("admin.analytics.dateRange")}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <MenuItem value="7d">{t("admin.analytics.last7Days")}</MenuItem>
                <MenuItem value="30d">
                  {t("admin.analytics.last30Days")}
                </MenuItem>
                <MenuItem value="90d">
                  {t("admin.analytics.last90Days")}
                </MenuItem>
                <MenuItem value="1y">{t("admin.analytics.lastYear")}</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
            >
              {t("common.refresh")}
            </Button>
            <Button
              variant="contained"
              startIcon={<GetApp />}
              onClick={handleExport}
            >
              {t("admin.products.export")}
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
                    {formatPriceCompact(24560000)} {/* 24.5M IQD */}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.dashboard.totalRevenue")}
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
                    {t("admin.dashboard.productsSold")}
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
                    {t("admin.dashboard.activeUsers")}
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
                    {t("admin.dashboard.conversionRate")}
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
              title={t("admin.analytics.salesRevenueTrends")}
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
                  <YAxis tickFormatter={(value) => formatPriceCompact(value)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name={t("admin.analytics.sales")}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name={t("admin.analytics.revenue")}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Performance */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title={t("admin.analytics.categoryPerformance")} />
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
            <CardHeader title={t("admin.dashboard.topCategories")} />
            <CardContent>
              {categoryLoading ? (
                <LinearProgress />
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t("common.category")}</TableCell>
                        <TableCell align="right">
                          {t("admin.products.totalProducts")}
                        </TableCell>
                        <TableCell align="right">
                          {t("admin.analytics.avgPrice")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(categoryAnalytics?.analytics || [])
                        .slice(0, 5)
                        .map((category) => {
                          const avgPrice =
                            category.avg_price != null
                              ? typeof category.avg_price === "string"
                                ? parseFloat(category.avg_price)
                                : category.avg_price
                              : 0;

                          return (
                            <TableRow key={category.id}>
                              <TableCell>{category.category_name}</TableCell>
                              <TableCell align="right">
                                {category.total_products}
                              </TableCell>
                              <TableCell align="right">
                                {formatPrice(avgPrice)}
                              </TableCell>
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
            <CardHeader title={t("admin.dashboard.productsNeedingAttention")} />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("admin.products.productName")}</TableCell>
                      <TableCell>{t("admin.analytics.issue")}</TableCell>
                      <TableCell align="right">
                        {t("admin.products.stockQuantity")}
                      </TableCell>
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
                              label={
                                product.issue_type === "Out of Stock"
                                  ? t("products.outOfStock")
                                  : product.issue_type === "Low Stock"
                                  ? t("products.lowStock")
                                  : product.issue_type
                              }
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
            <CardHeader title={t("admin.analytics.inventoryOverview")} />
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
                    <Bar
                      dataKey="in_stock"
                      fill="#8884d8"
                      name={t("admin.products.inStock")}
                    />
                    <Bar
                      dataKey="out_of_stock"
                      fill="#82ca9d"
                      name={t("products.outOfStock")}
                    />
                    <Bar
                      dataKey="low_stock"
                      fill="#ffc658"
                      name={t("products.lowStock")}
                    />
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
