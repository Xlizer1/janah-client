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

interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{ row: number; data: any; error: string }>;
}

export function ImportExport() {
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
        toast.success(`Successfully imported ${data.successful} items`);
      }
      if (data.failed > 0) {
        toast.warning(`${data.failed} items failed to import`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Import failed");
    },
  });

  const importCategoriesMutation = useMutation({
    mutationFn: ({ file, options }: { file: File; options: any }) =>
      adminService.import.importCategoriesCSV(file, options),
    onSuccess: (data) => {
      setImportResult(data);
      setResultDialog(true);
      if (data.successful > 0) {
        toast.success(`Successfully imported ${data.successful} categories`);
      }
      if (data.failed > 0) {
        toast.warning(`${data.failed} categories failed to import`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Category import failed");
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".csv")) {
        toast.error("Please select a CSV file");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      toast.error("Please select a file to import");
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
        `${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully`
      );
    } catch (error) {
      toast.error(`Export failed: ${error}`);
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
        `${type.charAt(0).toUpperCase() + type.slice(1)} template downloaded`
      );
    } catch (error) {
      toast.error(`Template download failed: ${error}`);
    }
  };

  const isLoading =
    importProductsMutation.isPending || importCategoriesMutation.isPending;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Import / Export
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bulk import and export data using CSV files
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Import Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Import Data"
              avatar={<CloudUpload color="primary" />}
            />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Import Type */}
                <FormControl fullWidth>
                  <InputLabel>Import Type</InputLabel>
                  <Select
                    value={importType}
                    label="Import Type"
                    onChange={(e) =>
                      setImportType(e.target.value as "products" | "categories")
                    }
                  >
                    <MenuItem value="products">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Inventory fontSize="small" />
                        Products
                      </Box>
                    </MenuItem>
                    <MenuItem value="categories">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Category fontSize="small" />
                        Categories
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
                    {selectedFile ? selectedFile.name : "Select CSV File"}
                  </Button>
                  {selectedFile && (
                    <Typography variant="caption" color="text.secondary">
                      File size: {(selectedFile.size / 1024).toFixed(2)} KB
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
                    label="Dry Run (Preview Only)"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={skipErrors}
                        onChange={(e) => setSkipErrors(e.target.checked)}
                      />
                    }
                    label="Skip Errors"
                  />
                </Box>

                {dryRun && (
                  <Alert severity="info">
                    Dry run mode: No data will be actually imported. Use this to
                    validate your CSV file.
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
                  {isLoading ? "Processing..." : `Import ${importType}`}
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
                  Download {importType} Template
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Export Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Export Data"
              avatar={<GetApp color="success" />}
            />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Export your current data to CSV format for backup or analysis
                </Typography>

                {/* Export Products */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleExport("products")}
                  startIcon={<Inventory />}
                  sx={{ mb: 1 }}
                >
                  Export All Products
                </Button>

                {/* Export Categories */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleExport("categories")}
                  startIcon={<Category />}
                  sx={{ mb: 1 }}
                >
                  Export All Categories
                </Button>

                <Divider sx={{ my: 2 }} />

                {/* Template Downloads */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  CSV Templates
                </Typography>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleDownloadTemplate("products")}
                  startIcon={<Description />}
                  sx={{ mb: 1 }}
                >
                  Product Template
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleDownloadTemplate("categories")}
                  startIcon={<Description />}
                >
                  Category Template
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
          Import Results
          {dryRun && <Chip label="Dry Run" color="info" sx={{ ml: 2 }} />}
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
                    <Typography variant="body2">Total Rows</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h4" color="success.main">
                      {importResult.successful}
                    </Typography>
                    <Typography variant="body2">Successful</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h4" color="error.main">
                      {importResult.failed}
                    </Typography>
                    <Typography variant="body2">Failed</Typography>
                  </Paper>
                </Grid>
              </Grid>

              {importResult.errors.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Errors ({importResult.errors.length})
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Row</TableCell>
                          <TableCell>Error</TableCell>
                          <TableCell>Data</TableCell>
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
                      Showing first 10 errors. Total:{" "}
                      {importResult.errors.length}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResultDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
