"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
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
  Description,
  FilePresent,
} from "@mui/icons-material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { adminService } from "@/services/admin.service";
import { useTranslation } from "@/hooks/useTranslation";

interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{ row: number; data: any; error: string }>;
}

export function ImportExport() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<"products" | "categories">(
    "products"
  );
  const [dryRun, setDryRun] = useState(true);
  const [skipErrors, setSkipErrors] = useState(true);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [resultDialog, setResultDialog] = useState(false);

  const importProductsMutation = useMutation({
    mutationFn: ({ file, options }: { file: File; options: any }) =>
      adminService.import.importProductsCSV(file, options),
    onSuccess: (data) => {
      setImportResult(data);
      setResultDialog(true);
      if (data.successful > 0) {
        toast.success(
          t("admin.importExport.importSuccess", { count: data.successful })
        );
      }
      if (data.failed > 0) {
        toast.warning(
          t("admin.importExport.importFailed", { count: data.failed })
        );
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || t("admin.importExport.importError")
      );
    },
  });

  const importCategoriesMutation = useMutation({
    mutationFn: ({ file, options }: { file: File; options: any }) =>
      adminService.import.importCategoriesCSV(file, options),
    onSuccess: (data) => {
      setImportResult(data);
      setResultDialog(true);
      if (data.successful > 0) {
        toast.success(
          t("admin.importExport.categoryImportSuccess", {
            count: data.successful,
          })
        );
      }
      if (data.failed > 0) {
        toast.warning(
          t("admin.importExport.categoryImportFailed", { count: data.failed })
        );
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          t("admin.importExport.categoryImportError")
      );
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".csv")) {
        toast.error(t("admin.importExport.csvFileOnly"));
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      toast.error(t("admin.importExport.selectFile"));
      return;
    }

    const options = { dry_run: dryRun, skip_errors: skipErrors };

    if (importType === "products") {
      importProductsMutation.mutate({ file: selectedFile, options });
    } else {
      importCategoriesMutation.mutate({ file: selectedFile, options });
    }
  };

  const handleExport = async (type: "products" | "categories") => {
    try {
      let blob: Blob;

      if (type === "products") {
        blob = await adminService.import.exportProductsCSV();
      } else {
        blob = await adminService.import.exportCategoriesCSV();
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(
        t("admin.importExport.exportSuccess", { type: t(`admin.${type}`) })
      );
    } catch (error) {
      toast.error(
        t("admin.importExport.exportError", { error: String(error) })
      );
    }
  };

  const handleDownloadTemplate = async (type: "products" | "categories") => {
    try {
      let blob: Blob;

      if (type === "products") {
        blob = await adminService.import.getProductTemplate();
      } else {
        blob = await adminService.import.getCategoryTemplate();
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-template.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(
        t("admin.importExport.templateDownloaded", { type: t(`admin.${type}`) })
      );
    } catch (error) {
      toast.error(
        t("admin.importExport.templateError", { error: String(error) })
      );
    }
  };

  const isLoading =
    importProductsMutation.isPending || importCategoriesMutation.isPending;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {t("admin.importExport.title")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("admin.importExport.subtitle")}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Import Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title={t("admin.importExport.importData")}
              avatar={<CloudUpload color="primary" />}
            />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Import Type */}
                <FormControl fullWidth>
                  <InputLabel>{t("admin.importExport.importType")}</InputLabel>
                  <Select
                    value={importType}
                    label={t("admin.importExport.importType")}
                    onChange={(e) =>
                      setImportType(e.target.value as "products" | "categories")
                    }
                  >
                    <MenuItem value="products">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Inventory fontSize="small" />
                        {t("admin.products")}
                      </Box>
                    </MenuItem>
                    <MenuItem value="categories">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Category fontSize="small" />
                        {t("admin.categories")}
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                {/* File Selection */}
                <Box>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                  />
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => fileInputRef.current?.click()}
                    startIcon={<FilePresent />}
                    sx={{ mb: 1 }}
                  >
                    {selectedFile
                      ? selectedFile.name
                      : t("admin.importExport.selectCSV")}
                  </Button>
                  {selectedFile && (
                    <Typography variant="caption" color="text.secondary">
                      {t("admin.importExport.fileSize")}:{" "}
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </Typography>
                  )}
                </Box>

                {/* Import Options */}
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={dryRun}
                        onChange={(e) => setDryRun(e.target.checked)}
                      />
                    }
                    label={t("admin.importExport.dryRun")}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={skipErrors}
                        onChange={(e) => setSkipErrors(e.target.checked)}
                      />
                    }
                    label={t("admin.importExport.skipErrors")}
                  />
                </Box>

                {dryRun && (
                  <Alert severity="info">
                    {t("admin.importExport.dryRunInfo")}
                  </Alert>
                )}

                {/* Import Button */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleImport}
                  disabled={!selectedFile || isLoading}
                  startIcon={<CloudUpload />}
                >
                  {isLoading
                    ? t("admin.importExport.processing")
                    : t("admin.importExport.import", {
                        type: t(`admin.${importType}`),
                      })}
                </Button>

                {isLoading && <LinearProgress />}

                {/* Download Template */}
                <Divider />
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleDownloadTemplate(importType)}
                  startIcon={<Description />}
                >
                  {t("admin.importExport.downloadTemplate", {
                    type: t(`admin.${importType}`),
                  })}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Export Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title={t("admin.importExport.exportData")}
              avatar={<GetApp color="success" />}
            />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {t("admin.importExport.exportDescription")}
                </Typography>

                {/* Export Products */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleExport("products")}
                  startIcon={<Inventory />}
                  sx={{ mb: 1 }}
                >
                  {t("admin.importExport.exportAllProducts")}
                </Button>

                {/* Export Categories */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleExport("categories")}
                  startIcon={<Category />}
                  sx={{ mb: 1 }}
                >
                  {t("admin.importExport.exportAllCategories")}
                </Button>

                <Divider sx={{ my: 2 }} />

                {/* Template Downloads */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {t("admin.importExport.csvTemplates")}
                </Typography>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleDownloadTemplate("products")}
                  startIcon={<Description />}
                  sx={{ mb: 1 }}
                >
                  {t("admin.importExport.productTemplate")}
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleDownloadTemplate("categories")}
                  startIcon={<Description />}
                >
                  {t("admin.importExport.categoryTemplate")}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Import Results Dialog */}
      <Dialog
        open={resultDialog}
        onClose={() => setResultDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {t("admin.importExport.importResults")}
          {dryRun && (
            <Chip
              label={t("admin.importExport.dryRun")}
              color="info"
              sx={{ ml: 2 }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          {importResult && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h4" color="primary.main">
                      {importResult.total}
                    </Typography>
                    <Typography variant="body2">
                      {t("admin.importExport.totalRows")}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h4" color="success.main">
                      {importResult.successful}
                    </Typography>
                    <Typography variant="body2">
                      {t("admin.importExport.successful")}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h4" color="error.main">
                      {importResult.failed}
                    </Typography>
                    <Typography variant="body2">
                      {t("admin.importExport.failed")}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {importResult.errors.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    {t("admin.importExport.errors")} (
                    {importResult.errors.length})
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t("admin.importExport.row")}</TableCell>
                          <TableCell>{t("admin.importExport.error")}</TableCell>
                          <TableCell>{t("admin.importExport.data")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {importResult.errors
                          .slice(0, 10)
                          .map((error, index) => (
                            <TableRow key={index}>
                              <TableCell>{error.row}</TableCell>
                              <TableCell>{error.error}</TableCell>
                              <TableCell>
                                <Typography variant="caption">
                                  {JSON.stringify(error.data).slice(0, 50)}...
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {importResult.errors.length > 10 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {t("admin.importExport.showingErrors", {
                        showing: 10,
                        total: importResult.errors.length,
                      })}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResultDialog(false)}>
            {t("common.close")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
