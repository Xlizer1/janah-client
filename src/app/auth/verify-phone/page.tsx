"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { PhoneAndroid, Refresh, CheckCircle } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { authService } from "@/services/auth.service";
import type { VerifyPhoneFormData } from "@/types";

// Validation schema
const verifyPhoneSchema = yup.object({
  phone_number: yup.string().required("Phone number is required"),
  verification_code: yup
    .string()
    .required("Verification code is required")
    .length(6, "Verification code must be 6 digits")
    .matches(/^\d{6}$/, "Verification code must contain only numbers"),
});

function VerifyPhoneContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneFromUrl = searchParams.get("phone") || "";

  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm<VerifyPhoneFormData>({
    resolver: yupResolver(verifyPhoneSchema),
    defaultValues: {
      phone_number: phoneFromUrl,
    },
  });

  // Timer for resend button
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Auto-fill phone number from URL
  useEffect(() => {
    if (phoneFromUrl) {
      setValue("phone_number", phoneFromUrl);
    }
  }, [phoneFromUrl, setValue]);

  // Verify phone mutation
  const verifyMutation = useMutation({
    mutationFn: authService.verifyPhone,
    onSuccess: (data) => {
      toast.success("Phone number verified successfully!");
      router.push("/auth/login?verified=true");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Verification failed";

      if (message.includes("Invalid or expired")) {
        setError("verification_code", {
          message: "Invalid or expired verification code",
        });
      } else {
        toast.error(message);
      }
    },
  });

  // Resend code mutation
  const resendMutation = useMutation({
    mutationFn: (phone_number: string) =>
      authService.resendCode({ phone_number, type: "registration" }),
    onSuccess: (data) => {
      toast.success("Verification code sent successfully!");
      setTimeLeft(120);
      setCanResend(false);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to resend code";
      toast.error(message);
    },
  });

  const onSubmit = (data: VerifyPhoneFormData) => {
    verifyMutation.mutate(data);
  };

  const handleResendCode = () => {
    const phoneNumber = phoneFromUrl || "";
    if (!phoneNumber) {
      toast.error("Phone number is required");
      return;
    }
    resendMutation.mutate(phoneNumber);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <PhoneAndroid
            sx={{
              fontSize: 48,
              color: "primary.main",
              mb: 2,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: "linear-gradient(45deg, #0ea5e9 30%, #3b82f6 90%)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Verify Your Phone
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            We've sent a 6-digit verification code to your phone number
          </Typography>
          {phoneFromUrl && (
            <Typography
              variant="body2"
              color="primary.main"
              sx={{ fontWeight: 600 }}
            >
              {phoneFromUrl}
            </Typography>
          )}
        </Box>

        {/* Verification Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Phone Number (read-only if from URL) */}
            <TextField
              fullWidth
              label="Phone Number"
              {...register("phone_number")}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
              InputProps={{
                readOnly: !!phoneFromUrl,
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroid color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-input": {
                  bgcolor: phoneFromUrl ? "grey.50" : "transparent",
                },
              }}
            />

            {/* Verification Code */}
            <TextField
              fullWidth
              label="Verification Code"
              placeholder="Enter 6-digit code"
              {...register("verification_code")}
              error={!!errors.verification_code}
              helperText={errors.verification_code?.message}
              inputProps={{
                maxLength: 6,
                style: {
                  textAlign: "center",
                  fontSize: "1.5rem",
                  letterSpacing: "0.5rem",
                },
              }}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "monospace",
                },
              }}
            />

            {/* Timer and Resend */}
            <Box sx={{ textAlign: "center" }}>
              {!canResend ? (
                <Typography variant="body2" color="text.secondary">
                  Resend code in {formatTime(timeLeft)}
                </Typography>
              ) : (
                <Button
                  variant="text"
                  startIcon={
                    resendMutation.isPending ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Refresh />
                    )
                  }
                  onClick={handleResendCode}
                  disabled={resendMutation.isPending}
                  sx={{ textTransform: "none" }}
                >
                  {resendMutation.isPending ? "Sending..." : "Resend Code"}
                </Button>
              )}
            </Box>

            {/* Verify Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={verifyMutation.isPending}
              sx={{
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                background: "linear-gradient(45deg, #0ea5e9 30%, #3b82f6 90%)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #0284c7 30%, #2563eb 90%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 20px rgba(14, 165, 233, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {verifyMutation.isPending ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Verifying...
                </Box>
              ) : (
                "Verify Phone Number"
              )}
            </Button>
          </Box>
        </form>

        <Divider sx={{ my: 3 }} />

        {/* Info and Help */}
        <Box sx={{ textAlign: "center" }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              After phone verification, your account will be pending admin
              approval. You'll receive notification once approved.
            </Typography>
          </Alert>

          <Typography variant="body2" color="text.secondary">
            Didn't receive the code? Check your SMS messages or try resending.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default function VerifyPhonePage() {
  return (
    <Suspense
      fallback={
        <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
          <CircularProgress />
        </Container>
      }
    >
      <VerifyPhoneContent />
    </Suspense>
  );
}
