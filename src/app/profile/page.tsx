"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Divider,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Person,
  Edit,
  Save,
  Cancel,
  Lock,
  ShoppingBag,
  Settings,
  Logout,
  Phone,
  Email,
  CalendarToday,
  CheckCircle,
  Warning,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { MainLayout } from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import type { ProfileUpdateFormData, ChangePasswordFormData } from "@/types";

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

// Validation schemas
const profileUpdateSchema = yup.object({
  first_name: yup.string().min(2, "First name must be at least 2 characters"),
  last_name: yup.string().min(2, "Last name must be at least 2 characters"),
  email: yup.string().email("Please enter a valid email address").nullable(),
});

const changePasswordSchema = yup.object({
  current_password: yup.string().required("Current password is required"),
  new_password: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
  confirm_password: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("new_password")], "Passwords do not match"),
});

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, logout, isAuthenticated } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  // Profile update form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileUpdateFormData>({
    resolver: yupResolver(profileUpdateSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
    },
  });

  // Change password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(changePasswordSchema),
  });

  // Fetch user profile
  const { data: profileData, refetch } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => authService.getProfile(),
    enabled: isAuthenticated,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      updateUser(data.user);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setChangePasswordOpen(false);
      resetPassword();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    },
  });

  // Handle profile update
  const onSubmitProfile = (data: ProfileUpdateFormData) => {
    updateProfileMutation.mutate(data);
  };

  // Handle password change
  const onSubmitPassword = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate(data);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/auth/login");
    return null;
  }

  if (!user) {
    return (
      <MainLayout>
        <LoadingSpinner fullHeight />
      </MainLayout>
    );
  }

  const currentUser = profileData?.user || user;

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Profile Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
              {/* Avatar */}
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: "auto",
                  mb: 2,
                  fontSize: "2rem",
                  bgcolor: "primary.main",
                }}
              >
                {currentUser.first_name?.[0]?.toUpperCase() || "U"}
              </Avatar>

              {/* User Info */}
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {currentUser.first_name} {currentUser.last_name}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {currentUser.email || "No email provided"}
              </Typography>

              {/* Status Badges */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}
              >
                <Chip
                  icon={
                    currentUser.is_phone_verified ? (
                      <CheckCircle />
                    ) : (
                      <Warning />
                    )
                  }
                  label={
                    currentUser.is_phone_verified
                      ? "Phone Verified"
                      : "Phone Not Verified"
                  }
                  color={currentUser.is_phone_verified ? "success" : "warning"}
                  size="small"
                />

                <Chip
                  icon={currentUser.is_active ? <CheckCircle /> : <Warning />}
                  label={
                    currentUser.is_active
                      ? "Account Active"
                      : "Pending Approval"
                  }
                  color={currentUser.is_active ? "success" : "warning"}
                  size="small"
                />

                {currentUser.role === "admin" && (
                  <Chip label="Administrator" color="primary" size="small" />
                )}
              </Box>

              {/* Quick Actions */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  disabled={isEditing}
                  fullWidth
                >
                  Edit Profile
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Lock />}
                  onClick={() => setChangePasswordOpen(true)}
                  fullWidth
                >
                  Change Password
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Logout />}
                  onClick={handleLogout}
                  fullWidth
                >
                  Logout
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ borderRadius: 2 }}>
              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={selectedTab}
                  onChange={(e, newValue) => setSelectedTab(newValue)}
                >
                  <Tab icon={<Person />} label="Profile" />
                  <Tab icon={<ShoppingBag />} label="Orders" />
                  <Tab icon={<Settings />} label="Settings" />
                </Tabs>
              </Box>

              {/* Profile Tab */}
              <TabPanel value={selectedTab} index={0}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Profile Information
                  </Typography>

                  {!currentUser.is_active && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                      Your account is pending admin approval. Some features may
                      be limited until your account is activated.
                    </Alert>
                  )}

                  <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          {...registerProfile("first_name")}
                          error={!!profileErrors.first_name}
                          helperText={profileErrors.first_name?.message}
                          disabled={
                            !isEditing || updateProfileMutation.isPending
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          {...registerProfile("last_name")}
                          error={!!profileErrors.last_name}
                          helperText={profileErrors.last_name?.message}
                          disabled={
                            !isEditing || updateProfileMutation.isPending
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          {...registerProfile("email")}
                          error={!!profileErrors.email}
                          helperText={profileErrors.email?.message}
                          disabled={
                            !isEditing || updateProfileMutation.isPending
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={currentUser.phone_number}
                          disabled
                          helperText="Phone number cannot be changed"
                        />
                      </Grid>

                      {isEditing && (
                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                              type="submit"
                              variant="contained"
                              startIcon={<Save />}
                              disabled={updateProfileMutation.isPending}
                            >
                              {updateProfileMutation.isPending
                                ? "Saving..."
                                : "Save Changes"}
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<Cancel />}
                              onClick={() => {
                                setIsEditing(false);
                                resetProfile();
                              }}
                              disabled={updateProfileMutation.isPending}
                            >
                              Cancel
                            </Button>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </form>

                  <Divider sx={{ my: 4 }} />

                  {/* Account Details */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Account Details
                  </Typography>

                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Phone Number"
                        secondary={currentUser.phone_number}
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          icon={<Phone />}
                          label={
                            currentUser.is_phone_verified
                              ? "Verified"
                              : "Not Verified"
                          }
                          color={
                            currentUser.is_phone_verified
                              ? "success"
                              : "default"
                          }
                          size="small"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                      <ListItemText
                        primary="Email Address"
                        secondary={currentUser.email || "Not provided"}
                      />
                      <ListItemSecondaryAction>
                        <Email color="action" />
                      </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                      <ListItemText
                        primary="Member Since"
                        secondary={new Date(
                          currentUser.created_at
                        ).toLocaleDateString()}
                      />
                      <ListItemSecondaryAction>
                        <CalendarToday color="action" />
                      </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                      <ListItemText
                        primary="Account Status"
                        secondary={
                          currentUser.is_active ? "Active" : "Pending Approval"
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label={currentUser.is_active ? "Active" : "Pending"}
                          color={currentUser.is_active ? "success" : "warning"}
                          size="small"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Box>
              </TabPanel>

              {/* Orders Tab */}
              <TabPanel value={selectedTab} index={1}>
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <ShoppingBag
                    sx={{ fontSize: 80, color: "grey.300", mb: 2 }}
                  />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No Orders Yet
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    You haven't placed any orders yet. Start shopping to see
                    your order history here.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => router.push("/products")}
                  >
                    Start Shopping
                  </Button>
                </Box>
              </TabPanel>

              {/* Settings Tab */}
              <TabPanel value={selectedTab} index={2}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Account Settings
                  </Typography>

                  <List>
                    <ListItem
                      button
                      onClick={() => setChangePasswordOpen(true)}
                    >
                      <ListItemText
                        primary="Change Password"
                        secondary="Update your account password"
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end">
                          <Lock />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                      <ListItemText
                        primary="Two-Factor Authentication"
                        secondary="Add an extra layer of security"
                      />
                      <ListItemSecondaryAction>
                        <Chip label="Coming Soon" size="small" />
                      </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                      <ListItemText
                        primary="Email Notifications"
                        secondary="Manage your notification preferences"
                      />
                      <ListItemSecondaryAction>
                        <Chip label="Coming Soon" size="small" />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Box>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>

        {/* Change Password Dialog */}
        <Dialog
          open={changePasswordOpen}
          onClose={() => setChangePasswordOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Change Password</DialogTitle>
          <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
            <DialogContent>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
              >
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  {...registerPassword("current_password")}
                  error={!!passwordErrors.current_password}
                  helperText={passwordErrors.current_password?.message}
                />

                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  {...registerPassword("new_password")}
                  error={!!passwordErrors.new_password}
                  helperText={passwordErrors.new_password?.message}
                />

                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  {...registerPassword("confirm_password")}
                  error={!!passwordErrors.confirm_password}
                  helperText={passwordErrors.confirm_password?.message}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setChangePasswordOpen(false);
                  resetPassword();
                }}
                disabled={changePasswordMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending
                  ? "Changing..."
                  : "Change Password"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </MainLayout>
  );
}
