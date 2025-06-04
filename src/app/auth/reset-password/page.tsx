"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
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
  IconButton,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
  LockReset,
  CheckCircle,
  ArrowBack,
  Refresh,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { authService } from "@/services/auth.service";
import { useTranslation } from "@/hooks/useTranslation";

const resetPasswordSchema = yup.object({
  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
  verification_code: yup
    .string()
    .required("Verification code is required")
    .length(6, "Verification code must be 6 digits")
    .matches(/^\d{6}$/, "Verification code must contain only numbers"),
  new_password: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
  confirm_password: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("new_password")], "Passwords do not match"),
});

interface ResetPasswordFormData {
  phone_number: string;
  verification_code: string;
  new_password: string;
  confirm_password: string;
}

function ResetPasswordContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const phoneFromUrl = searchParams.get("phone") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      phone_number: phoneFromUrl,
    },
  });

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (phoneFromUrl) {
      setValue("phone_number", phoneFromUrl);
    }
  }, [phoneFromUrl, setValue]);

  const resetPasswordMutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      setIsSuccess(true);
      toast.success(t("auth.resetPassword.complete"));
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || t("auth.resetPassword.failed");

      if (message.includes("Invalid or expired")) {
        setError("verification_code", {
          message: t("auth.codeInvalid"),
        });
      } else if (message.includes("phone number")) {
        setError("phone_number", {
          message: t("auth.phoneNotFound"),
        });
      } else {
        toast.error(message);
      }
    },
  });

  const resendMutation = useMutation({
    mutationFn: (phone_number: string) =>
      authService.resendCode({ phone_number, type: "password_reset" }),
    onSuccess: () => {
      toast.success(t("auth.resetCode.sent"));
      setTimeLeft(600);
      setCanResend(false);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || t("auth.resendFailed");
      toast.error(message);
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(data);
  };

  const handleResendCode = () => {
    const phoneNumber = watch("phone_number");
    if (!phoneNumber) {
      toast.error(t("auth.phoneRequired"));
      return;
    }
    resendMutation.mutate(phoneNumber);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isSuccess) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
            textAlign: "center",
          }}
        >
          {/* Success Icon */}
          <CheckCircle
            sx={{
              fontSize: 64,
              color: "success.main",
              mb: 2,
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "success.main",
            }}
          >
            {t("auth.resetPassword.complete")}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.6 }}
          >
            {t("auth.resetPassword.success")}
          </Typography>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => router.push("/auth/login")}
            sx={{
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              mb: 2,
            }}
          >
            {t("auth.continueToLogin")}
          </Button>
        </Paper>
      </Container>
    );
  }

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
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Link href="/auth/forgot-password">
            <Button
              startIcon={<ArrowBack />}
              sx={{ textTransform: "none", color: "text.secondary" }}
            >
              {t("auth.backToForgotPassword")}
            </Button>
          </Link>
        </Box>

        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <LockReset
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
            {t("auth.resetPassword.title")}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            {t("auth.resetPassword.subtitle")}
          </Typography>
        </Box>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Phone Number */}
            <TextField
              fullWidth
              label={t("auth.phone")}
              {...register("phone_number")}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
              InputProps={{
                readOnly: !!phoneFromUrl,
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
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
            <Box>
              <TextField
                fullWidth
                label={t("auth.verification.code")}
                placeholder={t("auth.enterCode")}
                {...register("verification_code")}
                error={!!errors.verification_code}
                helperText={errors.verification_code?.message}
                inputProps={{
                  maxLength: 6,
                  style: {
                    textAlign: "center",
                    fontSize: "1.25rem",
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
              <Box sx={{ textAlign: "center", mt: 1 }}>
                {!canResend ? (
                  <Typography variant="body2" color="text.secondary">
                    {t("auth.codeExpires")} {formatTime(timeLeft)}
                  </Typography>
                ) : (
                  <Button
                    variant="text"
                    size="small"
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
                    {resendMutation.isPending
                      ? t("auth.sending")
                      : t("auth.resendCode")}
                  </Button>
                )}
              </Box>
            </Box>

            {/* Password Fields */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  label={t("auth.newPassword")}
                  {...register("new_password")}
                  error={!!errors.new_password}
                  helperText={errors.new_password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type={showConfirmPassword ? "text" : "password"}
                  label={t("auth.confirmPassword")}
                  {...register("confirm_password")}
                  error={!!errors.confirm_password}
                  helperText={errors.confirm_password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={resetPasswordMutation.isPending}
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
              {resetPasswordMutation.isPending ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  {t("auth.resetting")}
                </Box>
              ) : (
                t("auth.resetPassword")
              )}
            </Button>
          </Box>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {t("auth.rememberPassword")}
          </Typography>
        </Divider>

        {/* Back to Login */}
        <Box sx={{ textAlign: "center" }}>
          <Link href="/auth/login">
            <Button
              variant="outlined"
              size="large"
              fullWidth
              sx={{
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                  transform: "translateY(-1px)",
                },
              }}
            >
              {t("auth.backToLogin")}
            </Button>
          </Link>
        </Box>

        {/* Info Alert */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            {t("auth.resetPassword.message")}
          </Typography>
        </Alert>
      </Paper>
    </Container>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
          <CircularProgress />
        </Container>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
