"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  Paper,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  PhotoCamera,
  Image as ImageIcon,
  DragIndicator,
} from "@mui/icons-material";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

interface MultiImageUploadProps {
  value?: string[]; // Array of image URLs
  onChange: (imageUrls: string[]) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number; // maximum number of files
  label?: string;
  helperText?: string;
  showPreview?: boolean;
  variant?: "button" | "dropzone";
}

export function MultiImageUpload({
  value = [],
  onChange,
  onError,
  disabled = false,
  accept = "image/*",
  maxSize = 5,
  maxFiles = 5,
  label = "Upload Images",
  helperText,
  showPreview = true,
  variant = "dropzone",
}: MultiImageUploadProps) {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Please select an image file";
    }

    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSize) {
      return `File size must be less than ${maxSize}MB`;
    }

    return null;
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (files: FileList) => {
    setError(null);

    // Check if adding these files would exceed the maximum
    if (value.length + files.length > maxFiles) {
      const error = `Maximum ${maxFiles} images allowed. You can add ${
        maxFiles - value.length
      } more.`;
      setError(error);
      onError?.(error);
      return;
    }

    setIsUploading(true);

    try {
      const newImageUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validationError = validateFile(file);

        if (validationError) {
          throw new Error(validationError);
        }

        const base64Url = await convertToBase64(file);
        newImageUrls.push(base64Url);
      }

      onChange([...value, ...newImageUrls]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
    setError(null);
  };

  const handleReorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...value];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const canAddMore = value.length < maxFiles;

  if (variant === "button") {
    return (
      <Box>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={disabled || isUploading || !canAddMore}
          multiple
        />

        <Button
          variant="outlined"
          startIcon={
            isUploading ? <CircularProgress size={20} /> : <CloudUpload />
          }
          onClick={handleButtonClick}
          disabled={disabled || isUploading || !canAddMore}
          fullWidth
        >
          {isUploading ? "Uploading..." : label}
        </Button>

        {helperText && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            {helperText}
          </Typography>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}

        {showPreview && value.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Images ({value.length}/{maxFiles})
            </Typography>
            <Grid container spacing={2}>
              {value.map((imageUrl, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Paper
                    sx={{
                      position: "relative",
                      aspectRatio: "1",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={imageUrl}
                      alt={`Preview ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <IconButton
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "rgba(255,255,255,0.9)",
                        color: "error.main",
                        "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                      }}
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                    {index === 0 && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 4,
                          left: 4,
                          bgcolor: "primary.main",
                          color: "white",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: "0.75rem",
                        }}
                      >
                        Main
                      </Box>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={disabled || isUploading || !canAddMore}
        multiple
      />

      {/* Upload Area */}
      {canAddMore && (
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleButtonClick}
          sx={{
            border: 2,
            borderColor: dragOver ? "primary.main" : "divider",
            borderStyle: "dashed",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: disabled || isUploading ? "not-allowed" : "pointer",
            bgcolor: dragOver ? "action.hover" : "background.paper",
            transition: "all 0.2s ease",
            mb: value.length > 0 ? 2 : 0,
            "&:hover": {
              bgcolor:
                disabled || isUploading ? "background.paper" : "action.hover",
              borderColor: disabled || isUploading ? "divider" : "primary.main",
            },
          }}
        >
          {isUploading ? (
            <Box>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="body2">Uploading...</Typography>
            </Box>
          ) : (
            <Box>
              <CloudUpload
                sx={{
                  fontSize: 48,
                  color: "text.secondary",
                  mb: 2,
                }}
              />
              <Typography variant="h6" sx={{ mb: 1 }}>
                {label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Drag and drop images here, or click to select
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {value.length}/{maxFiles} images • Multiple selection supported
              </Typography>
              {helperText && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  {helperText}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      )}

      {/* Image Preview Grid */}
      {showPreview && value.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Images ({value.length}/{maxFiles})
            {value.length > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                • First image will be the main product image
              </Typography>
            )}
          </Typography>

          <Grid container spacing={2}>
            {value.map((imageUrl, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Paper
                  sx={{
                    position: "relative",
                    aspectRatio: "1",
                    overflow: "hidden",
                    border: index === 0 ? 2 : 1,
                    borderColor: index === 0 ? "primary.main" : "divider",
                  }}
                >
                  <Image
                    src={imageUrl}
                    alt={`Product image ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />

                  {/* Action Buttons */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      display: "flex",
                      gap: 0.5,
                    }}
                  >
                    <IconButton
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.9)",
                        color: "error.main",
                        "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                      }}
                      size="small"
                      disabled={disabled || isUploading}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Main Image Indicator */}
                  {index === 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 4,
                        left: 4,
                        bgcolor: "primary.main",
                        color: "white",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      Main Image
                    </Box>
                  )}

                  {/* Image Number */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 4,
                      right: 4,
                      bgcolor: "rgba(0,0,0,0.7)",
                      color: "white",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: "0.75rem",
                    }}
                  >
                    {index + 1}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!canAddMore && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Maximum number of images ({maxFiles}) reached.
        </Alert>
      )}
    </Box>
  );
}
