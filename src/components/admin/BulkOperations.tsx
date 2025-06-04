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
import { useTranslation } from "@/hooks/useTranslation";

export function BulkOperations() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [selectedOperation, setSelectedOperation] = useState<string>("");
  const [bulkData, setBulkData] = useState<string>("");
  const [confirmDialog, setConfirmDialog] = useState(false);

  const bulkUpdateCategoriesMutation = useMutation({
    mutationFn: adminService.bulk.updateCategories,
    onSuccess: (data) => {
      toast.success(
        t("admin.bulk.updateSuccess", { count: data.updated.length })
      );
      if (data.failed.length > 0) {
        toast.warning(
          t("admin.bulk.updateFailed", { count: data.failed.length })
        );
      }
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setConfirmDialog(false);
      setBulkData("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("admin.error"));
    },
  });

  const bulkUpdatePricesMutation = useMutation({
    mutationFn: adminService.bulk.updatePrices,
    onSuccess: (data) => {
      toast.success(
        t("admin.bulk.priceUpdateSuccess", { count: data.updated.length })
      );
      if (data.failed.length > 0) {
        toast.warning(
          t("admin.bulk.priceUpdateFailed", { count: data.failed.length })
        );
      }
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setConfirmDialog(false);
      setBulkData("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("admin.error"));
    },
  });

  const bulkUpdateCodesMutation = useMutation({
    mutationFn: adminService.bulk.updateProductCodes,
    onSuccess: (data) => {
      toast.success(
        t("admin.bulk.codeUpdateSuccess", { count: data.updated.length })
      );
      if (data.failed.length > 0) {
        toast.warning(
          t("admin.bulk.codeUpdateFailed", { count: data.failed.length })
        );
      }
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setConfirmDialog(false);
      setBulkData("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("admin.error"));
    },
  });

  const handleBulkOperation = () => {
    if (!bulkData.trim()) {
      toast.error(t("admin.bulk.enterData"));
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
          toast.error(t("admin.bulk.selectOperation"));
      }
    } catch (error) {
      toast.error(t("admin.bulk.invalidJSON"));
    }
  };

  const operationExamples = {
    update_categories: {
      title: t("admin.bulk.updateCategories.title"),
      description: t("admin.bulk.updateCategories.description"),
      example: `{
  "updates": [
    { "product_id": 1, "category_id": 2 },
    { "product_code": "PROD001", "category_code": "ELEC" }
  ]
}`,
    },
    update_prices: {
      title: t("admin.bulk.updatePrices.title"),
      description: t("admin.bulk.updatePrices.description"),
      example: `{
  "operation": "percentage",
  "updates": [
    { "product_id": 1, "value": 10 },
    { "product_id": 2, "value": -5 }
  ]
}`,
    },
    update_codes: {
      title: t("admin.bulk.updateCodes.title"),
      description: t("admin.bulk.updateCodes.description"),
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
          {t("admin.bulk.title")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("admin.bulk.subtitle")}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Operation Selector */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title={t("admin.bulk.selectOperation")} />
            <CardContent>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>{t("admin.bulk.bulkOperation")}</InputLabel>
                <Select
                  value={selectedOperation}
                  label={t("admin.bulk.bulkOperation")}
                  onChange={(e) => setSelectedOperation(e.target.value)}
                >
                  <MenuItem value="update_categories">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Category fontSize="small" />
                      {t("admin.bulk.updateCategories.short")}
                    </Box>
                  </MenuItem>
                  <MenuItem value="update_prices">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AttachMoney fontSize="small" />
                      {t("admin.bulk.updatePrices.short")}
                    </Box>
                  </MenuItem>
                  <MenuItem value="update_codes">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Code fontSize="small" />
                      {t("admin.bulk.updateCodes.short")}
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
                        {t("admin.bulk.useJSONFormat")}
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
              title={t("admin.bulk.bulkDataInput")}
              action={
                <Button
                  variant="contained"
                  onClick={() => setConfirmDialog(true)}
                  disabled={!selectedOperation || !bulkData.trim()}
                >
                  {t("admin.bulk.executeOperation")}
                </Button>
              }
            />
            <CardContent>
              <TextField
                fullWidth
                multiline
                rows={15}
                label={t("admin.bulk.jsonData")}
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                placeholder={t("admin.bulk.jsonPlaceholder")}
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
                      {t("admin.bulk.exampleFormat")}:
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
        <DialogTitle>{t("admin.bulk.confirmOperation")}</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t("admin.bulk.operationWarning")}
          </Alert>
          <Typography>{t("admin.bulk.operationConfirmation")}</Typography>
          {selectedOperation && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t("common.operation")}:{" "}
              {
                operationExamples[
                  selectedOperation as keyof typeof operationExamples
                ]?.title
              }
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>
            {t("common.cancel")}
          </Button>
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
              ? t("admin.bulk.processing")
              : t("admin.bulk.execute")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
