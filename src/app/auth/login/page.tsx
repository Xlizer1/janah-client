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
} from "@mui/material";
import {
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

import { useAuth } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import type { LoginFormData } from "@/types";

// Validation schema
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
      // Store user data in cookie for persistence
      Cookies.set("user", JSON.stringify(data.user), { expires: 7 });

      // Update auth store
      login(data);

      toast.success("Login successful!");
      router.push("/");
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
        {/* Header */}
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
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to your account to continue shopping
          </Typography>
        </Box>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Phone Number */}
            <TextField
              fullWidth
              label="Phone Number"
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

            {/* Password */}
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Password"
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

            {/* Forgot Password Link */}
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
                  Forgot your password?
                </Typography>
              </Link>
            </Box>

            {/* Login Button */}
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
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </Button>
          </Box>
        </form>

        {/* Divider */}
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?
          </Typography>
        </Divider>

        {/* Register Link */}
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
              Create New Account
            </Button>
          </Link>
        </Box>

        {/* Info Alert */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            New users need admin approval before accessing the platform. Contact
            support if you need assistance.
          </Typography>
        </Alert>
      </Paper>
    </Container>
  );
}
