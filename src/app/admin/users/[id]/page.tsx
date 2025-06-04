"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Avatar,
  Chip,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Save,
  Cancel,
  CheckCircle,
  Warning,
  Block,
  Person,
  Phone,
  Email,
  CalendarToday,
  AdminPanelSettings,
  History,
  Security,
  Visibility,
  VisibilityOff,
  MoreVert,
  Refresh,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/store/auth.store";
import { adminService } from "@/services/admin.service";
import { useTranslation } from "@/hooks/useTranslation";

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

function UserDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const userId = params.id as string;

  const [selectedTab, setSelectedTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: "activate" | "deactivate" | null;
  }>({ open: false, type: null });

  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminUser", userId],
    queryFn: () => adminService.users.getUserById(parseInt(userId)),
    enabled: !!userId,
  });

  const activateUserMutation = useMutation({
    mutationFn: adminService.users.activateUser,
    onSuccess: () => {
      toast.success("User activated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminUser", userId] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      setActionDialog({ open: false, type: null });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to activate user");
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: adminService.users.deactivateUser,
    onSuccess: () => {
      toast.success("User deactivated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminUser", userId] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      setActionDialog({ open: false, type: null });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to deactivate user");
    },
  });

  const user = userData?.user;

  React.useEffect(() => {
    if (user) {
      setEditData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
    });
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    toast.success("User details updated successfully");
  };

  const handleUserAction = (type: "activate" | "deactivate") => {
    setActionDialog({ open: true, type });
  };

  const confirmUserAction = () => {
    if (actionDialog.type === "activate") {
      activateUserMutation.mutate(parseInt(userId));
    } else if (actionDialog.type === "deactivate") {
      deactivateUserMutation.mutate(parseInt(userId));
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

  const activityHistory = [
    {
      id: 1,
      action: "Account Created",
      timestamp: user?.created_at,
      details: "User registered with phone verification",
      type: "info",
    },
    {
      id: 2,
      action: "Phone Verified",
      timestamp: user?.created_at,
      details: "Phone number verification completed",
      type: "success",
    },
    ...(user?.is_active
      ? [
          {
            id: 3,
            action: "Account Activated",
            timestamp: user?.activated_at,
            details: "Account activated by admin",
            type: "success",
          },
        ]
      : []),
  ];

  if (isLoading) {
    return <LoadingSpinner fullHeight message="Loading user details..." />;
  }

  if (error || !user) {
    return (
      <Box sx={{ p: 8, textAlign: "center" }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          User Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The user you're looking for doesn't exist or has been removed.
        </Typography>
        <Link href="/admin/users">
          <Button variant="contained">Back to Users</Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Link href="/admin/users">
            <IconButton>
              <ArrowBack />
            </IconButton>
          </Link>
          <Typography variant="h4" sx={{ fontWeight: 700, flex: 1 }}>
            User Details
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </Box>

        {/* User Header Card */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "primary.main",
                  fontSize: "2rem",
                }}
              >
                {user.first_name?.[0]?.toUpperCase()}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {user.first_name} {user.last_name}
                </Typography>
                {user.role === "admin" && (
                  <Chip
                    icon={<AdminPanelSettings />}
                    label="Administrator"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                ID: {user.id} • {user.phone_number}
              </Typography>
              <Chip
                icon={
                  user.is_phone_verified && user.is_active ? (
                    <CheckCircle />
                  ) : (
                    <Warning />
                  )
                }
                label={getUserStatusText(user)}
                color={getUserStatusColor(user)}
                sx={{ mr: 1 }}
              />
              {user.email && (
                <Chip label={user.email} variant="outlined" size="small" />
              )}
            </Grid>
            <Grid item>
              <Box sx={{ display: "flex", gap: 1 }}>
                {!user.is_active && user.is_phone_verified && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => handleUserAction("activate")}
                    disabled={activateUserMutation.isPending}
                  >
                    Activate
                  </Button>
                )}
                {user.is_active && user.role !== "admin" && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Block />}
                    onClick={() => handleUserAction("deactivate")}
                    disabled={deactivateUserMutation.isPending}
                  >
                    Deactivate
                  </Button>
                )}
                <Button
                  variant="outlined"
                  startIcon={isEditing ? <Save /> : <Edit />}
                  onClick={isEditing ? handleSaveEdit : handleStartEdit}
                >
                  {isEditing ? "Save" : "Edit"}
                </Button>
                {isEditing && (
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Tabs */}
      <Paper sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
          >
            <Tab icon={<Person />} iconPosition="start" label="Profile" />
            <Tab icon={<History />} iconPosition="start" label="Activity" />
            <Tab icon={<Security />} iconPosition="start" label="Security" />
          </Tabs>
        </Box>

        {/* Profile Tab */}
        <TabPanel value={selectedTab} index={0}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Personal Information
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <TextField
                      label="First Name"
                      value={editData.first_name}
                      onChange={(e) =>
                        setEditData({ ...editData, first_name: e.target.value })
                      }
                      disabled={!isEditing}
                      fullWidth
                    />
                    <TextField
                      label="Last Name"
                      value={editData.last_name}
                      onChange={(e) =>
                        setEditData({ ...editData, last_name: e.target.value })
                      }
                      disabled={!isEditing}
                      fullWidth
                    />
                    <TextField
                      label="Email"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                      disabled={!isEditing}
                      fullWidth
                    />
                    <TextField
                      label="Phone Number"
                      value={user.phone_number}
                      disabled
                      fullWidth
                      helperText="Phone number cannot be changed"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Account Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Account Information
                  </Typography>

                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText primary="User ID" secondary={user.id} />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <AdminPanelSettings />
                      </ListItemIcon>
                      <ListItemText
                        primary="Role"
                        secondary={
                          <Chip
                            label={user.role.toUpperCase()}
                            color={
                              user.role === "admin" ? "primary" : "default"
                            }
                            size="small"
                          />
                        }
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <Phone />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone Verification"
                        secondary={
                          <Chip
                            icon={
                              user.is_phone_verified ? (
                                <CheckCircle />
                              ) : (
                                <Warning />
                              )
                            }
                            label={
                              user.is_phone_verified
                                ? "Verified"
                                : "Not Verified"
                            }
                            color={user.is_phone_verified ? "success" : "error"}
                            size="small"
                          />
                        }
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle />
                      </ListItemIcon>
                      <ListItemText
                        primary="Account Status"
                        secondary={
                          <Chip
                            label={user.is_active ? "Active" : "Inactive"}
                            color={user.is_active ? "success" : "warning"}
                            size="small"
                          />
                        }
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <CalendarToday />
                      </ListItemIcon>
                      <ListItemText
                        primary="Member Since"
                        secondary={new Date(
                          user.created_at
                        ).toLocaleDateString()}
                      />
                    </ListItem>

                    {user.activated_at && (
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle />
                        </ListItemIcon>
                        <ListItemText
                          primary="Activated On"
                          secondary={new Date(
                            user.activated_at
                          ).toLocaleDateString()}
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Activity Tab */}
        <TabPanel value={selectedTab} index={1}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Account Activity History
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Action</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activityHistory.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {activity.action}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {activity.timestamp
                          ? new Date(activity.timestamp).toLocaleString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {activity.details}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={activity.type}
                          color={
                            activity.type === "success"
                              ? "success"
                              : activity.type === "error"
                              ? "error"
                              : "info"
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={selectedTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Security Status
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Alert
                      severity={user.is_phone_verified ? "success" : "warning"}
                      sx={{ mb: 2 }}
                    >
                      Phone verification:{" "}
                      {user.is_phone_verified ? "Completed" : "Pending"}
                    </Alert>

                    <Alert
                      severity={user.is_active ? "success" : "warning"}
                      sx={{ mb: 2 }}
                    >
                      Account activation:{" "}
                      {user.is_active ? "Active" : "Pending admin approval"}
                    </Alert>

                    {user.role === "admin" && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        This user has administrator privileges
                      </Alert>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Security Actions
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<Refresh />}
                      fullWidth
                      disabled
                    >
                      Reset Password (Coming Soon)
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<Security />}
                      fullWidth
                      disabled
                    >
                      Force Re-verification (Coming Soon)
                    </Button>

                    {user.role !== "admin" && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Block />}
                        onClick={() => handleUserAction("deactivate")}
                        disabled={!user.is_active}
                        fullWidth
                      >
                        Suspend Account
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog({ open: false, type: null })}
      >
        <DialogTitle>
          Confirm{" "}
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
          <Button onClick={() => setActionDialog({ open: false, type: null })}>
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

export default function AdminUserDetailsPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <UserDetailsContent />
      </AdminLayout>
    </AdminGuard>
  );
}
