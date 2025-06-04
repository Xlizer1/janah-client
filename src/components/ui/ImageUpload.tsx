"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  PhotoCamera,
  Image as ImageIcon,
} from "@mui/icons-material";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

interface ImageUploadProps {
  value?: string; // Current image URL
  onChange: (imageUrl: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  helperText?: string;
  showPreview?: boolean;
  variant?: "button" | "dropzone";
}

export function ImageUpload({
  value,
  onChange,
  onError,
  disabled = false,
  accept = "image/*",
  maxSize = 5,
  label = "Upload Image",
  helperText,
  showPreview = true,
  variant = "dropzone",
}: ImageUploadProps) {
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

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "janah_products"); // You'll need to create this preset
    formData.append("folder", "products");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", // Replace with your cloud name
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (file: File) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      onError?.(validationError);
      return;
    }

    setIsUploading(true);

    try {
      const base64Url = await convertToBase64(file);

      onChange(base64Url);
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
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
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

  const handleRemoveImage = () => {
    onChange("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (variant === "button") {
    return (
      <Box>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={disabled || isUploading}
        />

        <Button
          variant="outlined"
          startIcon={
            isUploading ? <CircularProgress size={20} /> : <CloudUpload />
          }
          onClick={handleButtonClick}
          disabled={disabled || isUploading}
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

        {showPreview && value && (
          <Box sx={{ mt: 2, position: "relative", display: "inline-block" }}>
            <Box
              sx={{
                width: 200,
                height: 200,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Image
                src={value}
                alt="Preview"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
            <IconButton
              onClick={handleRemoveImage}
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                bgcolor: "error.main",
                color: "white",
                "&:hover": { bgcolor: "error.dark" },
              }}
              size="small"
            >
              <Delete fontSize="small" />
            </IconButton>
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
        disabled={disabled || isUploading}
      />

      {!value ? (
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
                Drag and drop an image here, or click to select
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
      ) : (
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Box
            sx={{
              width: "100%",
              maxWidth: 400,
              aspectRatio: "1",
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              src={value}
              alt="Preview"
              fill
              style={{ objectFit: "cover" }}
            />
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 1,
            }}
          >
            <IconButton
              onClick={handleButtonClick}
              sx={{
                bgcolor: "rgba(255,255,255,0.9)",
                "&:hover": { bgcolor: "rgba(255,255,255,1)" },
              }}
              size="small"
              disabled={disabled || isUploading}
            >
              <PhotoCamera fontSize="small" />
            </IconButton>
            <IconButton
              onClick={handleRemoveImage}
              sx={{
                bgcolor: "rgba(255,255,255,0.9)",
                color: "error.main",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,1)",
                  color: "error.dark",
                },
              }}
              size="small"
              disabled={disabled || isUploading}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
