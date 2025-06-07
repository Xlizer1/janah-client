"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Alert,
  Pagination,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Add,
  ContentCopy,
  Visibility,
  Block,
  MoreVert,
  Refresh,
  Download,
  FilterList,
  VpnKey,
  CheckCircle,
  Cancel,
  Schedule,
  Person,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { useTranslation } from "@/hooks/useTranslation";

const generateCodeSchema = yup.object({
  format: yup.string().oneOf(["JANAH", "PREMIUM", "TRIAL", "CUSTOM"] as const),
  expires_in_days: yup
    .number()
    .min(1, "Must be at least 1 day")
    .max(365, "Cannot exceed 365 days"),
  notes: yup.string().max(500, "Notes cannot exceed 500 characters"),
  custom_code: yup.string().when("format", {
    is: "CUSTOM",
    then: (schema) => schema.required("Custom code is required"),
    otherwise: (schema) => schema.optional(),
  }),
});

interface GenerateCodeFormData {
  format: "JANAH" | "PREMIUM" | "TRIAL" | "CUSTOM";
  expires_in_days: number;
  notes?: string;
  custom_code?: string;
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

function ActivationCodesContent() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<GenerateCodeFormData>({
    resolver: yupResolver(generateCodeSchema) as Resolver<GenerateCodeFormData>,
    defaultValues: {
      format: "JANAH",
      expires_in_days: 30,
      notes: "",
      custom_code: "",
    },
  });

  const format = watch("format");

  const { data: codesData, isLoading } = useQuery({
    queryKey: ["activationCodes", page, statusFilter],
    queryFn: () =>
      authService.admin.getAllActivationCodes({
        page,
        limit: 20,
        status: statusFilter === "all" ? undefined : (statusFilter as any),
      }),
  });

  const { data: statsData } = useQuery({
    queryKey: ["activationCodeStats"],
    queryFn: () => authService.admin.getActivationCodeStats(),
  });

  const generateCodeMutation = useMutation({
    mutationFn: authService.admin.generateActivationCode,
    onSuccess: () => {
      toast.success("Activation code generated successfully!");
      setGenerateDialogOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ["activationCodes"] });
      queryClient.invalidateQueries({ queryKey: ["activationCodeStats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to generate code");
    },
  });

  const deactivateCodeMutation = useMutation({
    mutationFn: authService.admin.deactivateActivationCode,
    onSuccess: () => {
      toast.success("Activation code deactivated successfully!");
      queryClient.invalidateQueries({ queryKey: ["activationCodes"] });
      queryClient.invalidateQueries({ queryKey: ["activationCodeStats"] });
      setActionMenuAnchor(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to deactivate code");
    },
  });

  const onSubmit = (data: GenerateCodeFormData) => {
    generateCodeMutation.mutate(data);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const handleViewDetails = async (code: string) => {
    try {
      const details = await authService.admin.getActivationCodeDetails(code);
      setSelectedCode(details.activation_code);
      setDetailsDialogOpen(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load details");
    }
  };

  const handleDeactivateCode = (code: string) => {
    if (window.confirm("Are you sure you want to deactivate this code?")) {
      deactivateCodeMutation.mutate(code);
    }
  };

  const getStatusColor = (code: any) => {
    if (!code.is_active) return "default";
    if (code.used_by) return "success";
    if (new Date(code.expires_at) < new Date()) return "error";
    return "warning";
  };

  const getStatusText = (code: any) => {
    if (!code.is_active) return "Disabled";
    if (code.used_by) return "Used";
    if (new Date(code.expires_at) < new Date()) return "Expired";
    return "Available";
  };

  const codes = codesData?.codes || [];
  const pagination = codesData?.pagination;
  const stats = statsData?.statistics;

  if (isLoading) {
    return <LoadingSpinner message="Loading activation codes..." />;
  }

  return (
    <Box>
      {/* Header */}
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
            Activation Codes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Generate and manage activation codes for user account activation
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["activationCodes"] })
            }
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setGenerateDialogOpen(true)}
          >
            Generate Code
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <VpnKey sx={{ color: "primary.main" }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats?.total_codes || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Codes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CheckCircle sx={{ color: "success.main" }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats?.used_codes || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Used Codes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Schedule sx={{ color: "warning.main" }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats?.available_codes || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Cancel sx={{ color: "error.main" }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats?.expired_codes || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Expired
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Block sx={{ color: "text.secondary" }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats?.disabled_codes || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Disabled
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
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                label="Status Filter"
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={<FilterList sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All Codes</MenuItem>
                <MenuItem value="unused">Available</MenuItem>
                <MenuItem value="used">Used</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              fullWidth
              disabled
            >
              Export (Coming Soon)
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Codes Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Used By</TableCell>
              <TableCell>Used Date</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {codes.map((code) => (
              <TableRow key={code.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", fontWeight: 600 }}
                    >
                      {code.code}
                    </Typography>
                    <Tooltip title="Copy code">
                      <IconButton
                        size="small"
                        onClick={() => handleCopyCode(code.code)}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(code)}
                    color={getStatusColor(code)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(code.created_at).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(code.expires_at).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  {code.user_name ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Person fontSize="small" />
                      <Typography variant="body2">{code.user_name}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {code.used_at
                      ? new Date(code.used_at).toLocaleDateString()
                      : "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {code.notes || "-"}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="View details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(code.code)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {code.is_active && !code.used_by && (
                      <Tooltip title="Deactivate">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeactivateCode(code.code)}
                          disabled={deactivateCodeMutation.isPending}
                        >
                          <Block fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
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
            page={page}
            onChange={(e, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      )}

      {/* Generate Code Dialog */}
      <Dialog
        open={generateDialogOpen}
        onClose={() => setGenerateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Generate Activation Code</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}
            >
              <FormControl fullWidth>
                <InputLabel>Code Format</InputLabel>
                <Select
                  {...register("format")}
                  label="Code Format"
                  defaultValue="JANAH"
                >
                  <MenuItem value="JANAH">JANAH (Standard)</MenuItem>
                  <MenuItem value="PREMIUM">PREMIUM (Premium users)</MenuItem>
                  <MenuItem value="TRIAL">TRIAL (Trial users)</MenuItem>
                  <MenuItem value="CUSTOM">CUSTOM (Custom code)</MenuItem>
                </Select>
              </FormControl>

              {format === "CUSTOM" && (
                <TextField
                  fullWidth
                  label="Custom Code"
                  {...register("custom_code")}
                  error={!!errors.custom_code}
                  helperText={
                    errors.custom_code?.message ||
                    "Enter your custom activation code"
                  }
                />
              )}

              <TextField
                fullWidth
                type="number"
                label="Expires in Days"
                {...register("expires_in_days")}
                error={!!errors.expires_in_days}
                helperText={
                  errors.expires_in_days?.message ||
                  "Number of days until the code expires"
                }
                inputProps={{ min: 1, max: 365 }}
              />

              <TextField
                fullWidth
                label="Notes (Optional)"
                multiline
                rows={3}
                {...register("notes")}
                error={!!errors.notes}
                helperText={
                  errors.notes?.message ||
                  "Optional notes about this activation code"
                }
                inputProps={{ maxLength: 500 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGenerateDialogOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={generateCodeMutation.isPending}
            >
              {generateCodeMutation.isPending
                ? "Generating..."
                : "Generate Code"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Code Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Activation Code Details</DialogTitle>
        <DialogContent>
          {selectedCode && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Code"
                    value={selectedCode.code}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <IconButton
                          onClick={() => handleCopyCode(selectedCode.code)}
                        >
                          <ContentCopy />
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Status"
                    value={getStatusText(selectedCode)}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Created"
                    value={new Date(selectedCode.created_at).toLocaleString()}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expires"
                    value={new Date(selectedCode.expires_at).toLocaleString()}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Used By"
                    value={selectedCode.user_name || "Not used"}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                {selectedCode.used_at && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Used Date"
                      value={new Date(selectedCode.used_at).toLocaleString()}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                )}
                {selectedCode.notes && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notes"
                      multiline
                      rows={3}
                      value={selectedCode.notes}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function AdminActivationCodesPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ActivationCodesContent />
      </AdminLayout>
    </AdminGuard>
  );
}
