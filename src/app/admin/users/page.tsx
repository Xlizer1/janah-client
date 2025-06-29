"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Checkbox,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  Grid,
  Card,
  CardContent,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import {
  Search,
  FilterList,
  MoreVert,
  PersonAdd,
  CheckCircle,
  Cancel,
  Edit,
  Visibility,
  People,
  PersonOff,
  Phone,
  Email,
  CalendarToday,
  Warning,
  Refresh,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/store/auth.store";
import { adminService } from "@/services/admin.service";
import { useTranslation } from "@/hooks/useTranslation";

interface UserFilters {
  page: number;
  limit: number;
  role?: "user" | "admin";
  is_active?: boolean;
  is_phone_verified?: boolean;
  search?: string;
}

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

function UsersManagementContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
  });
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [bulkActionDialog, setBulkActionDialog] = useState<{
    open: boolean;
    action: "activate" | "deactivate" | null;
  }>({ open: false, action: null });

  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminUsers", filters],
    queryFn: () => adminService.users.getAllUsers(filters),
  });

  const { data: statsData } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => adminService.getStats(),
  });

  const activateUserMutation = useMutation({
    mutationFn: adminService.users.activateUser,
    onSuccess: () => {
      toast.success(t("admin.users.userActivated"));
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || t("admin.users.activationFailed")
      );
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: adminService.users.deactivateUser,
    onSuccess: () => {
      toast.success(t("admin.users.userDeactivated"));
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || t("admin.users.deactivationFailed")
      );
    },
  });

  const bulkActivateMutation = useMutation({
    mutationFn: adminService.users.bulkActivateUsers,
    onSuccess: (data) => {
      const { activated, failed } = data;
      toast.success(`${activated.length} users activated successfully`);
      if (failed.length > 0) {
        toast.error(`${failed.length} users failed to activate`);
      }
      setSelectedUsers([]);
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Bulk activation failed");
    },
  });

  const handleFilterChange = (newFilters: Partial<UserFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleActionMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    userId: number
  ) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedUserId(null);
  };

  const handleUserAction = (
    action: "activate" | "deactivate" | "view" | "edit"
  ) => {
    if (!selectedUserId) return;

    switch (action) {
      case "activate":
        activateUserMutation.mutate(selectedUserId);
        break;
      case "deactivate":
        deactivateUserMutation.mutate(selectedUserId);
        break;
      case "view":
      case "edit":
        router.push(`/admin/users/${selectedUserId}`);
        break;
    }
    handleActionMenuClose();
  };

  const handleBulkAction = (action: "activate" | "deactivate") => {
    if (selectedUsers.length === 0) {
      toast.error("Please select users first");
      return;
    }
    setBulkActionDialog({ open: true, action });
  };

  const confirmBulkAction = () => {
    if (bulkActionDialog.action === "activate") {
      bulkActivateMutation.mutate(selectedUsers);
    }
    setBulkActionDialog({ open: false, action: null });
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allUserIds = usersData?.users.map((user) => user.id) || [];
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const getUserStatusColor = (user: any) => {
    if (!user.is_phone_verified) return "error";
    if (!user.is_active) return "warning";
    return "success";
  };

  const getUserStatusText = (user: any) => {
    if (!user.is_phone_verified) return t("admin.users.phoneNotVerified");
    if (!user.is_active) return t("admin.users.pendingActivation");
    return t("admin.users.active");
  };

  if (isLoading) {
    return <LoadingSpinner message={t("admin.loading")} />;
  }

  if (error) {
    return <Alert severity="error">{t("admin.error")}</Alert>;
  }

  const users = usersData?.users || [];
  const pagination = usersData?.pagination;

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
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {t("admin.users.management")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("admin.users.subtitle")}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["adminUsers"] })
            }
          >
            {t("common.refresh")}
          </Button>
          <Link href="/admin/users/pending">
            <Button variant="contained" startIcon={<PersonAdd />}>
              {t("admin.users.pendingUsers")} (
              {statsData?.stats?.pending_activation || 0})
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {statsData?.stats?.total_users || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.users.totalUsers")}
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
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {statsData?.stats?.active_users || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.users.activeUsers")}
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
                  <Warning />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {statsData?.stats?.pending_activation || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.users.pendingActivation")}
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
                <Avatar sx={{ bgcolor: "error.main" }}>
                  <PersonOff />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {statsData?.stats?.unverified_phone || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.users.unverifiedPhone")}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder={t("admin.users.searchUsers")}
              value={filters.search || ""}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t("admin.users.role")}</InputLabel>
              <Select
                value={filters.role || ""}
                label={t("admin.users.role")}
                onChange={(e) =>
                  handleFilterChange({
                    role: e.target.value as "user" | "admin" | undefined,
                  })
                }
              >
                <MenuItem value="">{t("admin.users.allRoles")}</MenuItem>
                <MenuItem value="user">{t("admin.users.userRole")}</MenuItem>
                <MenuItem value="admin">{t("admin.users.adminRole")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t("common.status")}</InputLabel>
              <Select
                value={
                  filters.is_active !== undefined
                    ? filters.is_active.toString()
                    : ""
                }
                label={t("common.status")}
                onChange={(e) =>
                  handleFilterChange({
                    is_active:
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true",
                  })
                }
              >
                <MenuItem value="">{t("admin.users.allStatus")}</MenuItem>
                <MenuItem value="true">{t("admin.users.activeOnly")}</MenuItem>
                <MenuItem value="false">
                  {t("admin.users.inactiveOnly")}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>{t("admin.users.phoneVerified")}</InputLabel>
              <Select
                value={
                  filters.is_phone_verified !== undefined
                    ? filters.is_phone_verified.toString()
                    : ""
                }
                label={t("admin.users.phoneVerified")}
                onChange={(e) =>
                  handleFilterChange({
                    is_phone_verified:
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true",
                  })
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">{t("admin.users.verified")}</MenuItem>
                <MenuItem value="false">
                  {t("admin.users.notVerified")}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Per Page</InputLabel>
              <Select
                value={filters.limit}
                label="Per Page"
                onChange={(e) =>
                  handleFilterChange({ limit: e.target.value as number })
                }
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "primary.50" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {selectedUsers.length} {t("admin.users.usersSelected")}
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleBulkAction("activate")}
              disabled={bulkActivateMutation.isPending}
            >
              {t("admin.users.bulkActivation")}
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setSelectedUsers([])}
            >
              {t("admin.clearSelection")}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedUsers.length > 0 &&
                    selectedUsers.length < users.length
                  }
                  checked={
                    users.length > 0 && selectedUsers.length === users.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>{t("admin.users.user")}</TableCell>
              <TableCell>{t("admin.users.contact")}</TableCell>
              <TableCell>{t("common.status")}</TableCell>
              <TableCell>{t("admin.users.role")}</TableCell>
              <TableCell>{t("admin.users.joined")}</TableCell>
              <TableCell align="right">{t("common.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {user.first_name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {user.first_name} {user.last_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {user.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Phone sx={{ fontSize: 16 }} />
                      <Typography variant="body2">
                        {user.phone_number}
                      </Typography>
                      {user.is_phone_verified && (
                        <CheckCircle
                          sx={{ fontSize: 16, color: "success.main" }}
                        />
                      )}
                    </Box>
                    {user.email && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Email sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{user.email}</Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getUserStatusText(user)}
                    color={getUserStatusColor(user)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.role.toUpperCase()}
                    color={user.role === "admin" ? "primary" : "default"}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarToday sx={{ fontSize: 16 }} />
                    <Typography variant="body2">
                      {new Date(user.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title={t("admin.moreActions")}>
                    <IconButton
                      onClick={(e) => handleActionMenuOpen(e, user.id)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={() => handleUserAction("view")}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("admin.users.viewDetails")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleUserAction("edit")}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("admin.users.editUser")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleUserAction("activate")}>
          <ListItemIcon>
            <CheckCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("admin.users.activate")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleUserAction("deactivate")}>
          <ListItemIcon>
            <Cancel fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("admin.users.deactivate")}</ListItemText>
        </MenuItem>
      </Menu>

      {/* Bulk Action Dialog */}
      <Dialog
        open={bulkActionDialog.open}
        onClose={() => setBulkActionDialog({ open: false, action: null })}
      >
        <DialogTitle>{t("admin.users.confirmBulkActivation")}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("admin.users.bulkActivationQuestion", {
              count: selectedUsers.length,
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setBulkActionDialog({ open: false, action: null })}
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={confirmBulkAction}
            variant="contained"
            disabled={bulkActivateMutation.isPending}
          >
            {t("common.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <UsersManagementContent />
      </AdminLayout>
    </AdminGuard>
  );
}
