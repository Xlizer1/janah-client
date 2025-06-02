// src/components/admin/BulkOperations.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  CloudUpload,
  GetApp,
  Category,
  Inventory,
  Edit,
  Code,
  AttachMoney,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { adminService } from "@/services/admin.service";

export function BulkOperations() {
  const queryClient = useQueryClient();
  const [selectedOperation, setSelectedOperation] = useState<string>("");
  const [bulkData, setBulkData] = useState<string>("");
  const [confirmDialog, setConfirmDialog] = useState(false);

  // Bulk update mutations
  const bulkUpdateCategoriesMutation = useMutation({
    mutationFn: adminService.bulk.updateCategories,
    onSuccess: (data) => {
      toast.success(`Updated ${data.updated.length} products successfully`);
      if (data.failed.length > 0) {
        toast.warning(`${data.failed.length} updates failed`);
      }
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setConfirmDialog(false);
      setBulkData("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Bulk operation failed");
    },
  });

  const bulkUpdatePricesMutation = useMutation({
    mutationFn: adminService.bulk.updatePrices,
    onSuccess: (data) => {
      toast.success(`Updated ${data.updated.length} product prices`);
      if (data.failed.length > 0) {
        toast.warning(`${data.failed.length} price updates failed`);
      }
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setConfirmDialog(false);
      setBulkData("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Price update failed");
    },
  });

  const bulkUpdateCodesMutation = useMutation({
    mutationFn: adminService.bulk.updateProductCodes,
    onSuccess: (data) => {
      toast.success(`Updated ${data.updated.length} product codes`);
      if (data.failed.length > 0) {
        toast.warning(`${data.failed.length} code updates failed`);
      }
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setConfirmDialog(false);
      setBulkData("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Code update failed");
    },
  });

  const handleBulkOperation = () => {
    if (!bulkData.trim()) {
      toast.error("Please enter bulk data");
      return;
    }

    try {
      const data = JSON.parse(bulkData);

      switch (selectedOperation) {
        case "update_categories":
          bulkUpdateCategoriesMutation.mutate(data.updates);
          break;
        case "update_prices":
          bulkUpdatePricesMutation.mutate(data);
          break;
        case "update_codes":
          bulkUpdateCodesMutation.mutate(data.updates);
          break;
        default:
          toast.error("Please select an operation");
      }
    } catch (error) {
      toast.error("Invalid JSON format");
    }
  };

  const operationExamples = {
    update_categories: {
      title: "Update Product Categories",
      description: "Assign products to different categories",
      example: `{
  "updates": [
    { "product_id": 1, "category_id": 2 },
    { "product_code": "PROD001", "category_code": "ELEC" }
  ]
}`,
    },
    update_prices: {
      title: "Update Product Prices",
      description: "Set, increase, or apply percentage changes to prices",
      example: `{
  "operation": "percentage",
  "updates": [
    { "product_id": 1, "value": 10 },
    { "product_id": 2, "value": -5 }
  ]
}`,
    },
    update_codes: {
      title: "Update Product Codes",
      description: "Change product codes in bulk",
      example: `{
  "updates": [
    { "product_id": 1, "new_code": "NEWCODE1" },
    { "product_code": "OLDCODE2", "new_code": "NEWCODE2" }
  ]
}`,
    },
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Bulk Operations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Perform bulk updates on products and categories
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Operation Selector */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Select Operation" />
            <CardContent>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Bulk Operation</InputLabel>
                <Select
                  value={selectedOperation}
                  label="Bulk Operation"
                  onChange={(e) => setSelectedOperation(e.target.value)}
                >
                  <MenuItem value="update_categories">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Category fontSize="small" />
                      Update Categories
                    </Box>
                  </MenuItem>
                  <MenuItem value="update_prices">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AttachMoney fontSize="small" />
                      Update Prices
                    </Box>
                  </MenuItem>
                  <MenuItem value="update_codes">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Code fontSize="small" />
                      Update Product Codes
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              {selectedOperation &&
                operationExamples[
                  selectedOperation as keyof typeof operationExamples
                ] && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {
                        operationExamples[
                          selectedOperation as keyof typeof operationExamples
                        ].title
                      }
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {
                        operationExamples[
                          selectedOperation as keyof typeof operationExamples
                        ].description
                      }
                    </Typography>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="caption">
                        Use the JSON format shown in the example panel
                      </Typography>
                    </Alert>
                  </Box>
                )}
            </CardContent>
          </Card>
        </Grid>

        {/* Data Input */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Bulk Data Input"
              action={
                <Button
                  variant="contained"
                  onClick={() => setConfirmDialog(true)}
                  disabled={!selectedOperation || !bulkData.trim()}
                >
                  Execute Operation
                </Button>
              }
            />
            <CardContent>
              <TextField
                fullWidth
                multiline
                rows={15}
                label="JSON Data"
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                placeholder="Enter your bulk operation data in JSON format..."
                sx={{ mb: 2 }}
              />

              {selectedOperation &&
                operationExamples[
                  selectedOperation as keyof typeof operationExamples
                ] && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Example Format:
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                      <pre
                        style={{
                          margin: 0,
                          fontSize: "0.875rem",
                          overflow: "auto",
                        }}
                      >
                        {
                          operationExamples[
                            selectedOperation as keyof typeof operationExamples
                          ].example
                        }
                      </pre>
                    </Paper>
                  </Box>
                )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Bulk Operation</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action will affect multiple records and cannot be undone!
          </Alert>
          <Typography>
            Are you sure you want to execute this bulk operation?
          </Typography>
          {selectedOperation && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Operation:{" "}
              {
                operationExamples[
                  selectedOperation as keyof typeof operationExamples
                ]?.title
              }
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button
            onClick={handleBulkOperation}
            variant="contained"
            color="error"
            disabled={
              bulkUpdateCategoriesMutation.isPending ||
              bulkUpdatePricesMutation.isPending ||
              bulkUpdateCodesMutation.isPending
            }
          >
            {bulkUpdateCategoriesMutation.isPending ||
            bulkUpdatePricesMutation.isPending ||
            bulkUpdateCodesMutation.isPending
              ? "Processing..."
              : "Execute"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
