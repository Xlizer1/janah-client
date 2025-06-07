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
  VpnKey,
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

export default function LoginPage() {
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
      // Store user data
      Cookies.set("user", JSON.stringify(data.user), { expires: 7 });

      // Check if user needs activation
      if (!data.user.is_active) {
        // User exists but not activated - store auth and redirect to activation
        login(data);
        router.push("/auth/activate");
        toast.info("Please activate your account to continue");
        return;
      }

      // User is fully activated
      login(data);

      if (data.user.role === "admin") {
        router.push("/admin");
        toast.success(t("auth.welcomeBack", { name: data.user.first_name }));
      } else {
        router.push("/");
        toast.success(t("auth.loginSuccess"));
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || t("auth.loginFailed");

      if (message.includes("phone number or password")) {
        setError("phone_number", {
          message: t("auth.invalidCredentials"),
        });
        setError("password", { message: t("auth.invalidCredentials") });
      } else if (message.includes("verify your phone")) {
        setError("phone_number", {
          message: t("auth.verifyPhoneFirst"),
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

        {/* Login Flow Info */}
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Login Process:</strong>
            <br />
            • Enter your phone number and password
            <br />
            • If your account needs activation, you'll be redirected to enter
            your activation code
            <br />• Once activated, enjoy full access to the store!
          </Typography>
        </Alert>

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
              {loginMutation.isPending ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  {t("auth.signingIn")}
                </Box>
              ) : (
                t("auth.signIn")
              )}
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

        {/* Activation Code Info */}
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <VpnKey
              sx={{ fontSize: 16, mr: 1, verticalAlign: "text-bottom" }}
            />
            <strong>Need an activation code?</strong>
            <br />
            Call us at <strong>+964 773 300 2076</strong> to purchase an
            activation code and unlock full access.
          </Typography>
        </Alert>

        {/* Quick Access for Testing */}
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Demo Account (for testing):</strong>
            <br />
            Phone: <code>+964770123456</code>
            <br />
            Password: <code>password123</code>
            <br />
            <em>This account will redirect to activation screen</em>
          </Typography>
        </Alert>
      </Paper>
    </Container>
  );
}
