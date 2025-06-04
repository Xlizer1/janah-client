"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Save,
  Security,
  Notifications,
  Email,
  Phone,
  Store,
  Backup,
  RestoreFromTrash,
  CloudSync,
  Warning,
  Info,
  Edit,
  Delete,
  Add,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
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

interface GeneralSettings {
  site_name: string;
  site_description: string;
  site_email: string;
  site_phone: string;
  currency: string;
  timezone: string;
  maintenance_mode: boolean;
  auto_approve_users: boolean;
}

interface SecuritySettings {
  two_factor_enabled: boolean;
  session_timeout: number;
  max_login_attempts: number;
  password_min_length: number;
  require_phone_verification: boolean;
}

interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  new_user_alerts: boolean;
  low_stock_alerts: boolean;
  order_notifications: boolean;
}

export function AdminSettings() {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);
  const [backupDialog, setBackupDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control: generalControl,
    handleSubmit: handleGeneralSubmit,
    formState: { isDirty: isGeneralDirty },
  } = useForm<GeneralSettings>({
    defaultValues: {
      site_name: "Janah E-commerce",
      site_description: "Modern e-commerce platform",
      site_email: "support@janah.com",
      site_phone: "+964 773 300 2076",
      currency: "USD",
      timezone: "Asia/Baghdad",
      maintenance_mode: false,
      auto_approve_users: false,
    },
  });

  const {
    control: securityControl,
    handleSubmit: handleSecuritySubmit,
    formState: { isDirty: isSecurityDirty },
  } = useForm<SecuritySettings>({
    defaultValues: {
      two_factor_enabled: false,
      session_timeout: 30,
      max_login_attempts: 5,
      password_min_length: 8,
      require_phone_verification: true,
    },
  });

  const {
    control: notificationControl,
    handleSubmit: handleNotificationSubmit,
    formState: { isDirty: isNotificationDirty },
  } = useForm<NotificationSettings>({
    defaultValues: {
      email_notifications: true,
      sms_notifications: true,
      new_user_alerts: true,
      low_stock_alerts: true,
      order_notifications: true,
    },
  });

  const onGeneralSubmit = async (data: GeneralSettings) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call
      console.log("General settings:", data);
      toast.success(t("admin.success"));
    } catch (error) {
      toast.error(t("admin.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const onSecuritySubmit = async (data: SecuritySettings) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call
      console.log("Security settings:", data);
      toast.success(t("admin.success"));
    } catch (error) {
      toast.error(t("admin.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const onNotificationSubmit = async (data: NotificationSettings) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call
      console.log("Notification settings:", data);
      toast.success(t("admin.success"));
    } catch (error) {
      toast.error(t("admin.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackup = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement backup API call
      toast.success(t("admin.success"));
      setBackupDialog(false);
    } catch (error) {
      toast.error(t("admin.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {t("admin.settings.title")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("admin.settings.subtitle")}
        </Typography>
      </Box>

      {/* Settings Tabs */}
      <Paper sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
          >
            <Tab
              icon={<Store />}
              iconPosition="start"
              label={t("common.general")}
            />
            <Tab
              icon={<Security />}
              iconPosition="start"
              label={t("admin.users.security")}
            />
            <Tab
              icon={<Notifications />}
              iconPosition="start"
              label={t("admin.users.notifications")}
            />
            <Tab
              icon={<Backup />}
              iconPosition="start"
              label={t("admin.backup")}
            />
          </Tabs>
        </Box>

        {/* General Settings */}
        <TabPanel value={selectedTab} index={0}>
          <form onSubmit={handleGeneralSubmit(onGeneralSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Site Information */}
                  <Card>
                    <CardHeader title={t("admin.settings.siteInfo")} />
                    <CardContent
                      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                      <Controller
                        name="site_name"
                        control={generalControl}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t("admin.settings.siteName")}
                            fullWidth
                            required
                          />
                        )}
                      />

                      <Controller
                        name="site_description"
                        control={generalControl}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t("admin.categories.categoryDescription")}
                            fullWidth
                            multiline
                            rows={3}
                          />
                        )}
                      />

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="site_email"
                            control={generalControl}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("auth.email")}
                                type="email"
                                fullWidth
                                required
                                InputProps={{
                                  startAdornment: (
                                    <Email
                                      sx={{ mr: 1, color: "action.active" }}
                                    />
                                  ),
                                }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="site_phone"
                            control={generalControl}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("auth.phone")}
                                fullWidth
                                required
                                InputProps={{
                                  startAdornment: (
                                    <Phone
                                      sx={{ mr: 1, color: "action.active" }}
                                    />
                                  ),
                                }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Regional Settings */}
                  <Card>
                    <CardHeader title={t("admin.settings.regional")} />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="currency"
                            control={generalControl}
                            render={({ field }) => (
                              <FormControl fullWidth>
                                <InputLabel>
                                  {t("admin.settings.currency")}
                                </InputLabel>
                                <Select
                                  {...field}
                                  label={t("admin.settings.currency")}
                                >
                                  <MenuItem value="USD">
                                    USD - US Dollar
                                  </MenuItem>
                                  <MenuItem value="EUR">EUR - Euro</MenuItem>
                                  <MenuItem value="IQD">
                                    IQD - Iraqi Dinar
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="timezone"
                            control={generalControl}
                            render={({ field }) => (
                              <FormControl fullWidth>
                                <InputLabel>
                                  {t("admin.settings.timezone")}
                                </InputLabel>
                                <Select
                                  {...field}
                                  label={t("admin.settings.timezone")}
                                >
                                  <MenuItem value="Asia/Baghdad">
                                    Asia/Baghdad (GMT+3)
                                  </MenuItem>
                                  <MenuItem value="UTC">UTC (GMT+0)</MenuItem>
                                  <MenuItem value="America/New_York">
                                    America/New_York (GMT-5)
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* System Status */}
                  <Card>
                    <CardHeader title={t("admin.settings.systemStatus")} />
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Controller
                          name="maintenance_mode"
                          control={generalControl}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={field.value}
                                  onChange={field.onChange}
                                />
                              }
                              label={t("admin.settings.maintenanceMode")}
                            />
                          )}
                        />

                        <Controller
                          name="auto_approve_users"
                          control={generalControl}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={field.value}
                                  onChange={field.onChange}
                                />
                              }
                              label={t("admin.settings.autoApprove")}
                            />
                          )}
                        />

                        <Alert severity="info" sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            {t("admin.settings.maintenanceInfo")}
                          </Typography>
                        </Alert>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Save Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Save />}
                    disabled={!isGeneralDirty || isLoading}
                    fullWidth
                  >
                    {isLoading
                      ? t("common.loading")
                      : t("admin.settings.saveGeneral")}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        {/* Security Settings */}
        <TabPanel value={selectedTab} index={1}>
          <form onSubmit={handleSecuritySubmit(onSecuritySubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardHeader title={t("admin.settings.securityConfig")} />
                  <CardContent
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <Controller
                      name="two_factor_enabled"
                      control={securityControl}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          }
                          label={t("admin.settings.twoFactor")}
                        />
                      )}
                    />

                    <Controller
                      name="require_phone_verification"
                      control={securityControl}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          }
                          label={t("admin.settings.requirePhone")}
                        />
                      )}
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="session_timeout"
                          control={securityControl}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t("admin.settings.sessionTimeout")}
                              type="number"
                              fullWidth
                              inputProps={{ min: 5, max: 480 }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="max_login_attempts"
                          control={securityControl}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t("admin.settings.maxLoginAttempts")}
                              type="number"
                              fullWidth
                              inputProps={{ min: 3, max: 10 }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>

                    <Controller
                      name="password_min_length"
                      control={securityControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("admin.settings.passwordMinLength")}
                          type="number"
                          fullWidth
                          inputProps={{ min: 6, max: 20 }}
                        />
                      )}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Alert severity="warning">
                    <Typography variant="body2">
                      {t("admin.settings.securityWarning")}
                    </Typography>
                  </Alert>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Save />}
                    disabled={!isSecurityDirty || isLoading}
                    fullWidth
                  >
                    {isLoading
                      ? t("common.loading")
                      : t("admin.settings.saveSecurity")}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        {/* Notification Settings */}
        <TabPanel value={selectedTab} index={2}>
          <form onSubmit={handleNotificationSubmit(onNotificationSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardHeader title={t("admin.settings.notificationPrefs")} />
                  <CardContent
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Controller
                      name="email_notifications"
                      control={notificationControl}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          }
                          label={t("admin.settings.emailNotifications")}
                        />
                      )}
                    />

                    <Controller
                      name="sms_notifications"
                      control={notificationControl}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          }
                          label={t("admin.settings.smsNotifications")}
                        />
                      )}
                    />

                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {t("admin.settings.alertTypes")}
                    </Typography>

                    <Controller
                      name="new_user_alerts"
                      control={notificationControl}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          }
                          label={t("admin.settings.newUserAlerts")}
                        />
                      )}
                    />

                    <Controller
                      name="low_stock_alerts"
                      control={notificationControl}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          }
                          label={t("admin.settings.lowStockAlerts")}
                        />
                      )}
                    />

                    <Controller
                      name="order_notifications"
                      control={notificationControl}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          }
                          label={t("admin.settings.orderNotifications")}
                        />
                      )}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<Save />}
                  disabled={!isNotificationDirty || isLoading}
                  fullWidth
                >
                  {isLoading
                    ? t("common.loading")
                    : t("admin.settings.saveNotifications")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        {/* Backup & Restore */}
        <TabPanel value={selectedTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Database Backup */}
                <Card>
                  <CardHeader title={t("admin.settings.databaseBackup")} />
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      {t("admin.settings.backupDescription")}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                      <Button
                        variant="contained"
                        startIcon={<Backup />}
                        onClick={() => setBackupDialog(true)}
                      >
                        {t("admin.settings.createBackup")}
                      </Button>
                      <Button variant="outlined" startIcon={<CloudSync />}>
                        {t("admin.settings.scheduleBackup")}
                      </Button>
                    </Box>

                    <Alert severity="info">
                      <Typography variant="body2">
                        {t("admin.settings.backupInfo")}
                      </Typography>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Recent Backups */}
                <Card>
                  <CardHeader title={t("admin.settings.recentBackups")} />
                  <CardContent>
                    <List>
                      {[
                        {
                          date: "2024-01-15 02:00",
                          size: "45.2 MB",
                          type: t("admin.settings.automatic"),
                        },
                        {
                          date: "2024-01-14 02:00",
                          size: "44.8 MB",
                          type: t("admin.settings.automatic"),
                        },
                        {
                          date: "2024-01-13 14:30",
                          size: "44.5 MB",
                          type: t("admin.settings.manual"),
                        },
                      ].map((backup, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${t("admin.settings.backup")} - ${
                              backup.date
                            }`}
                            secondary={
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  alignItems: "center",
                                }}
                              >
                                <Chip
                                  label={backup.type}
                                  size="small"
                                  variant="outlined"
                                />
                                <Box>
                                  <Typography variant="caption">
                                    {backup.size}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton size="small">
                              <RestoreFromTrash />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>{t("common.important")}:</strong>{" "}
                  {t("admin.settings.backupTestWarning")}
                </Typography>
              </Alert>

              <Alert severity="error">
                <Typography variant="body2">
                  <strong>{t("admin.settings.dangerZone")}:</strong>{" "}
                  {t("admin.settings.restoreWarning")}
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Backup Confirmation Dialog */}
      <Dialog open={backupDialog} onClose={() => setBackupDialog(false)}>
        <DialogTitle>{t("admin.settings.createBackupTitle")}</DialogTitle>
        <DialogContent>
          <Typography>{t("admin.settings.backupConfirmation")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackupDialog(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleBackup}
            variant="contained"
            disabled={isLoading}
          >
            {isLoading
              ? t("admin.settings.creating")
              : t("admin.settings.createBackup")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
