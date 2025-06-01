"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
  Pagination,
  Alert,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  MoreVert,
  Search,
  Refresh,
  Phone,
  Email,
  CalendarToday,
  Person,
  Warning,
  Check,
  Close,
  Visibility,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/store/auth.store";
import { adminService } from "@/services/admin.service";

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

function PendingUsersContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [bulkActionDialog, setBulkActionDialog] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Fetch pending users
  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pendingUsers", page],
    queryFn: () => adminService.users.getPendingUsers({ page, limit: 12 }),
  });

  // Mutations
  const activateUserMutation = useMutation({
    mutationFn: adminService.users.activateUser,
    onSuccess: () => {
      toast.success("User activated successfully");
      queryClient.invalidateQueries({ queryKey: ["pendingUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to activate user");
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
      setBulkActionDialog(false);
      queryClient.invalidateQueries({ queryKey: ["pendingUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Bulk activation failed");
    },
  });

  const users = usersData?.users || [];
  const pagination = usersData?.pagination;

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone_number.includes(searchQuery)
  );

  const handleUserAction = (action: "activate" | "view") => {
    if (!selectedUserId) return;

    switch (action) {
      case "activate":
        activateUserMutation.mutate(selectedUserId);
        break;
      case "view":
        router.push(`/admin/users/${selectedUserId}`);
        break;
    }
    setActionMenuAnchor(null);
    setSelectedUserId(null);
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const handleBulkActivate = () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select users first");
      return;
    }
    setBulkActionDialog(true);
  };

  const confirmBulkActivate = () => {
    bulkActivateMutation.mutate(selectedUsers);
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

  if (isLoading) {
    return <LoadingSpinner message="Loading pending users..." />;
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load pending users. Please try again.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Pending User Activations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Users who have verified their phone numbers and are waiting for
            admin approval
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["pendingUsers"] })
            }
          >
            Refresh
          </Button>
          <Link href="/admin/users">
            <Button variant="contained">All Users</Button>
          </Link>
        </Box>
      </Box>

      {/* Search and Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <TextField
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {selectedUsers.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {selectedUsers.length} selected
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleBulkActivate}
                  disabled={bulkActivateMutation.isPending}
                >
                  Activate Selected
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSelectedUsers([])}
                >
                  Clear
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {filteredUsers.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedUsers.length === filteredUsers.length}
                  indeterminate={
                    selectedUsers.length > 0 &&
                    selectedUsers.length < filteredUsers.length
                  }
                  onChange={handleSelectAll}
                />
              }
              label="Select all visible users"
            />
          </Box>
        )}
      </Paper>

      {/* Users Grid */}
      {filteredUsers.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {filteredUsers.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Card
                  sx={{
                    height: "100%",
                    position: "relative",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  {/* Selection Checkbox */}
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      zIndex: 1,
                    }}
                  />

                  {/* Action Menu */}
                  <IconButton
                    onClick={(e) => handleActionMenuOpen(e, user.id)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 1,
                    }}
                  >
                    <MoreVert />
                  </IconButton>

                  <CardContent sx={{ pt: 6 }}>
                    {/* User Avatar and Basic Info */}
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          mx: "auto",
                          mb: 2,
                          bgcolor: "primary.main",
                          fontSize: "2rem",
                        }}
                      >
                        {user.first_name?.[0]?.toUpperCase()}
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {user.first_name} {user.last_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {user.id}
                      </Typography>
                    </Box>

                    {/* Contact Information */}
                    <Box sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Phone sx={{ fontSize: 16, color: "text.secondary" }} />
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
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Email
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography variant="body2" noWrap>
                            {user.email}
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <CalendarToday
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {new Date(user.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Status Badges */}
                    <Box sx={{ mb: 3 }}>
                      <Chip
                        icon={
                          user.is_phone_verified ? <CheckCircle /> : <Warning />
                        }
                        label={
                          user.is_phone_verified
                            ? "Phone Verified"
                            : "Phone Not Verified"
                        }
                        color={user.is_phone_verified ? "success" : "error"}
                        size="small"
                        sx={{ mb: 1, mr: 1 }}
                      />
                      <Chip
                        icon={<Warning />}
                        label="Pending Activation"
                        color="warning"
                        size="small"
                      />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Action Buttons */}
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<CheckCircle />}
                        onClick={() => activateUserMutation.mutate(user.id)}
                        disabled={
                          activateUserMutation.isPending ||
                          !user.is_phone_verified
                        }
                        fullWidth
                      >
                        Activate
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                        sx={{ minWidth: "auto" }}
                      >
                        View
                      </Button>
                    </Box>

                    {!user.is_phone_verified && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", textAlign: "center", mt: 1 }}
                      >
                        Cannot activate: Phone not verified
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={page}
                onChange={(e, newPage) => setPage(newPage)}
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        // Empty State
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Person sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            {searchQuery ? "No matching users found" : "No pending users"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery
              ? `No users match "${searchQuery}". Try a different search term.`
              : "All users have been activated or are still verifying their phone numbers."}
          </Typography>
          {searchQuery && (
            <Button variant="outlined" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          )}
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
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleUserAction("activate")}>
          <ListItemIcon>
            <CheckCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Activate User</ListItemText>
        </MenuItem>
      </Menu>

      {/* Bulk Activation Dialog */}
      <Dialog
        open={bulkActionDialog}
        onClose={() => setBulkActionDialog(false)}
      >
        <DialogTitle>Confirm Bulk Activation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to activate {selectedUsers.length} selected
            users? They will receive SMS notifications about their account
            activation.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialog(false)}>Cancel</Button>
          <Button
            onClick={confirmBulkActivate}
            variant="contained"
            disabled={bulkActivateMutation.isPending}
          >
            {bulkActivateMutation.isPending
              ? "Activating..."
              : "Activate Users"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function AdminPendingUsersPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <PendingUsersContent />
      </AdminLayout>
    </AdminGuard>
  );
}
