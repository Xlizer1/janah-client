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
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  LockReset,
  ArrowBack,
  CheckCircle,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import { useAuth } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import type { LoginFormData } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

const loginSchema = yup.object({
  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      Cookies.set("user", JSON.stringify(data.user), { expires: 7 });

      login(data);

      if (data.user.role === "admin") {
        router.push("/admin");
        toast.success(`Welcome back, ${data.user.first_name}!`);
      } else {
        router.push("/");
        toast.success("Login successful!");
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Login failed";

      if (message.includes("phone number or password")) {
        setError("phone_number", {
          message: "Invalid phone number or password",
        });
        setError("password", { message: "Invalid phone number or password" });
      } else if (message.includes("verify your phone")) {
        setError("phone_number", {
          message: "Please verify your phone number first",
        });
      } else if (message.includes("pending admin activation")) {
        setError("phone_number", {
          message:
            "Your account is pending admin activation. Please contact support.",
        });
      } else {
        toast.error(message);
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
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
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <LoginIcon
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
            {t("auth.login.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("auth.login.subtitle")}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              fullWidth
              label={t("auth.phone")}
              placeholder="+964 773 300 2076"
              {...register("phone_number")}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label={t("auth.password")}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
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

            <Box sx={{ textAlign: "right" }}>
              <Link href="/auth/forgot-password">
                <Typography
                  variant="body2"
                  color="primary.main"
                  sx={{
                    cursor: "pointer",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {t("auth.forgotPassword")}
                </Typography>
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loginMutation.isPending}
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
              {loginMutation.isPending ? "Signing In..." : t("auth.signIn")}
            </Button>
          </Box>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {t("auth.dontHaveAccount")}
          </Typography>
        </Divider>

        <Box sx={{ textAlign: "center" }}>
          <Link href="/auth/register">
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
              {t("auth.createAccount")}
            </Button>
          </Link>
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">{t("auth.infoAlert")}</Typography>
        </Alert>
      </Paper>
    </Container>
  );
}

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
        error.response?.data?.message || "Failed to send reset code";

      if (message.includes("phone number")) {
        setError("phone_number", {
          message: "Please check your phone number and try again",
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              fullWidth
              label={t("auth.phone")}
              placeholder="+964 773 300 2076"
              {...register("phone_number")}
              error={!!errors.phone_number}
              helperText={
                errors.phone_number?.message ||
                "Enter the phone number associated with your account"
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
            />

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

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">{t("auth.infoAlert.reset")}</Typography>
        </Alert>
      </Paper>
    </Container>
  );
}
