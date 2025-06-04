"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Phone, LockReset, ArrowBack, CheckCircle } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { authService } from "@/services/auth.service";
import { useTranslation } from "@/hooks/useTranslation";

const forgotPasswordSchema = yup.object({
  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
});

interface ForgotPasswordFormData {
  phone_number: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedPhone, setSubmittedPhone] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (data, variables) => {
      setSubmittedPhone(variables.phone_number);
      setIsSuccess(true);
      toast.success(t("auth.resetCode.sent"));
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || t("auth.resetCode.sendFailed");

      if (message.includes("phone number")) {
        setError("phone_number", {
          message: t("auth.phoneCheckAndRetry"),
        });
      } else {
        toast.error(message);
      }
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data);
  };

  const handleContinueToReset = () => {
    router.push(
      `/auth/reset-password?phone=${encodeURIComponent(submittedPhone)}`
    );
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
            {t("auth.resetCode.sent")}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.6 }}
          >
            {t("auth.resetCode.sentTo")}
          </Typography>

          <Typography
            variant="body1"
            sx={{ fontWeight: 600, mb: 4, color: "primary.main" }}
          >
            {submittedPhone}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {t("auth.resetCode.checkSMS")}
          </Typography>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleContinueToReset}
            sx={{
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              mb: 2,
            }}
          >
            {t("auth.continueToReset")}
          </Button>

          <Button
            variant="text"
            onClick={() => setIsSuccess(false)}
            sx={{ textTransform: "none" }}
          >
            {t("auth.differentPhone")}
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
          <Link href="/auth/login">
            <Button
              startIcon={<ArrowBack />}
              sx={{ textTransform: "none", color: "text.secondary" }}
            >
              {t("auth.backToLogin")}
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
            {t("auth.forgotPassword.title")}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            {t("auth.forgotPassword.subtitle")}
          </Typography>
        </Box>

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Phone Number */}
            <TextField
              fullWidth
              label={t("auth.phone")}
              placeholder="+964 773 300 2076"
              {...register("phone_number")}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message || t("auth.phoneHelper")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={forgotPasswordMutation.isPending}
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
              {forgotPasswordMutation.isPending ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  {t("auth.sending")}
                </Box>
              ) : (
                t("auth.sendResetCode")
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
          <Typography variant="body2">{t("auth.infoAlert.reset")}</Typography>
        </Alert>
      </Paper>
    </Container>
  );
}
