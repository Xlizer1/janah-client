// src/components/admin/UserManagement.tsx
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
  Avatar,
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
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Tabs,
  Tab,
  LinearProgress,
} from "@mui/material";
import {
  Search,
  PersonAdd,
  Check,
  Close,
  MoreVert,
  Phone,
  Email,
  AdminPanelSettings,
  Warning,
  Refresh,
  FilterList,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { adminService } from "@/services/admin.service";

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

export function UserManagement() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: "activate" | "deactivate" | null;
    userId: number | null;
  }>({ open: false, type: null, userId: null });

  // Fetch users based on selected tab
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["adminUsers", selectedTab, statusFilter],
    queryFn: () => {
      if (selectedTab === 1) {
        // Pending users
        return adminService.users.getPendingUsers({ limit: 10 });
      } else {
        // All users
        return adminService.users.getAllUsers({
          limit: 10,
          is_active:
            statusFilter === "active"
              ? true
              : statusFilter === "inactive"
              ? false
              : undefined,
        });
      }
    },
  });

  // Get admin stats
  const { data: statsData } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => adminService.getStats(),
  });

  // Mutations
  const activateUserMutation = useMutation({
    mutationFn: adminService.users.activateUser,
    onSuccess: () => {
      toast.success("User activated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      setActionDialog({ open: false, type: null, userId: null });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to activate user");
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: adminService.users.deactivateUser,
    onSuccess: () => {
      toast.success("User deactivated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      setActionDialog({ open: false, type: null, userId: null });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to deactivate user");
    },
  });

  const handleUserAction = (
    type: "activate" | "deactivate",
    userId: number
  ) => {
    setActionDialog({ open: true, type, userId });
  };

  const confirmUserAction = () => {
    if (actionDialog.userId && actionDialog.type) {
      if (actionDialog.type === "activate") {
        activateUserMutation.mutate(actionDialog.userId);
      } else {
        deactivateUserMutation.mutate(actionDialog.userId);
      }
    }
  };

  const getUserStatusColor = (user: any) => {
    if (!user.is_phone_verified) return "error";
    if (!user.is_active) return "warning";
    return "success";
  };

  const getUserStatusText = (user: any) => {
    if (!user.is_phone_verified) return "Phone Not Verified";
    if (!user.is_active) return "Pending Activation";
    return "Active";
  };

  const filteredUsers = (usersData?.users || []).filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.first_name.toLowerCase().includes(query) ||
      user.last_name.toLowerCase().includes(query) ||
      user.phone_number.includes(query) ||
      (user.email && user.email.toLowerCase().includes(query))
    );
  });

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
            User Management
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["adminUsers"] })
              }
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => router.push("/admin/users/pending")}
            >
              Pending Users ({statsData?.stats?.pending_activation || 0})
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
                  <PersonAdd />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {statsData?.stats?.total_users || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
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
                  <Check />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {statsData?.stats?.active_users || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Users
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
                    Pending Approval
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
                  <AdminPanelSettings />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {statsData?.stats?.activation_rate || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Activation Rate
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
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search users by name, phone, or email..."
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
                <MenuItem value="all">All Users</MenuItem>
                <MenuItem value="active">Active Only</MenuItem>
                <MenuItem value="inactive">Inactive Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => router.push("/admin/users")}
            >
              View Full User List
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* User Tabs */}
      <Paper sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
          >
            <Tab label={`Recent Users (${filteredUsers.length})`} />
            <Tab
              label={`Pending Approval (${
                statsData?.stats?.pending_activation || 0
              })`}
            />
          </Tabs>
        </Box>

        {/* Recent Users Tab */}
        <TabPanel value={selectedTab} index={0}>
          {isLoading ? (
            <LinearProgress />
          ) : filteredUsers.length > 0 ? (
            <List>
              {filteredUsers.slice(0, 10).map((user, index) => (
                <React.Fragment key={user.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {user.first_name?.[0]?.toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600 }}
                          >
                            {user.first_name} {user.last_name}
                          </Typography>
                          {user.role === "admin" && (
                            <Chip
                              icon={<AdminPanelSettings />}
                              label="Admin"
                              size="small"
                              color="primary"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Phone sx={{ fontSize: 14 }} />
                            <Typography variant="body2">
                              {user.phone_number}
                            </Typography>
                            {user.is_phone_verified && (
                              <Check
                                sx={{ fontSize: 14, color: "success.main" }}
                              />
                            )}
                          </Box>
                          {user.email && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Email sx={{ fontSize: 14 }} />
                              <Typography variant="body2">
                                {user.email}
                              </Typography>
                            </Box>
                          )}
                          <Box sx={{ mt: 0.5 }}>
                            <Chip
                              label={getUserStatusText(user)}
                              color={getUserStatusColor(user)}
                              size="small"
                            />
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {!user.is_active && user.is_phone_verified && (
                          <IconButton
                            color="success"
                            onClick={() =>
                              handleUserAction("activate", user.id)
                            }
                            disabled={activateUserMutation.isPending}
                          >
                            <Check />
                          </IconButton>
                        )}
                        {user.is_active && user.role !== "admin" && (
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleUserAction("deactivate", user.id)
                            }
                            disabled={deactivateUserMutation.isPending}
                          >
                            <Close />
                          </IconButton>
                        )}
                        <IconButton
                          onClick={() => router.push(`/admin/users/${user.id}`)}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < filteredUsers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                No users found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchQuery
                  ? `No users match "${searchQuery}"`
                  : "No users to display"}
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Pending Users Tab */}
        <TabPanel value={selectedTab} index={1}>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Pending User Approvals
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Users waiting for admin approval after phone verification
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push("/admin/users/pending")}
            >
              View Pending Users ({statsData?.stats?.pending_activation || 0})
            </Button>
          </Box>
        </TabPanel>
      </Paper>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialog.open}
        onClose={() =>
          setActionDialog({ open: false, type: null, userId: null })
        }
      >
        <DialogTitle>
          Confirm User{" "}
          {actionDialog.type === "activate" ? "Activation" : "Deactivation"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {actionDialog.type} this user account?
            {actionDialog.type === "activate" &&
              " The user will receive an SMS notification."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setActionDialog({ open: false, type: null, userId: null })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={confirmUserAction}
            variant="contained"
            disabled={
              activateUserMutation.isPending || deactivateUserMutation.isPending
            }
            color={actionDialog.type === "activate" ? "primary" : "error"}
          >
            {activateUserMutation.isPending || deactivateUserMutation.isPending
              ? "Processing..."
              : `Confirm ${
                  actionDialog.type === "activate"
                    ? "Activation"
                    : "Deactivation"
                }`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
