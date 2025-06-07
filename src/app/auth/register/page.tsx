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
  Grid,
} from "@mui/material";
import {
  Phone,
  Lock,
  Person,
  Email,
  Visibility,
  VisibilityOff,
  PersonAdd,
  CheckCircle,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { authService } from "@/services/auth.service";
import type { RegisterFormData } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

// Updated schema - removed phone verification requirement
const registerSchema = yup.object({
  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirm_password: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
  first_name: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  last_name: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: yup.string().email("Please enter a valid email address").optional(),
});

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredData, setRegisteredData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data, variables) => {
      setRegisteredData(data);
      setIsSuccess(true);
      toast.success(
        "Registration successful! You can now login with your credentials."
      );
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || t("auth.registerFailed");

      if (message.includes("phone number already exists")) {
        setError("phone_number", {
          message: t("auth.phoneExists"),
        });
      } else if (message.includes("email already exists")) {
        setError("email", {
          message: t("auth.emailExists"),
        });
      } else {
        toast.error(message);
      }
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
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
            Registration Successful!
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, lineHeight: 1.6 }}
          >
            Your account has been created successfully. You can now login and
            activate your account using an activation code.
          </Typography>

          <Alert severity="info" sx={{ mb: 3, textAlign: "left" }}>
            <Typography variant="body2">
              <strong>Next Steps:</strong>
              <br />• Login with your credentials
              <br />• Enter your activation code to unlock full access
              <br />• Start shopping once activated!
            </Typography>
          </Alert>

          <Alert severity="warning" sx={{ mb: 3, textAlign: "left" }}>
            <Typography variant="body2">
              <strong>Need an activation code?</strong>
              <br />
              Contact us at <strong>+964 773 300 2076</strong> to purchase one.
            </Typography>
          </Alert>

          <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
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
              }}
            >
              Continue to Login
            </Button>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => window.open("tel:+9647733002076")}
              sx={{
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Contact Us for Activation Code
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
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
          <PersonAdd
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
            Create Your Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join Janah and start shopping today
          </Typography>
        </Box>

        {/* Updated Registration Process Info */}
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>New Registration Process:</strong>
            <br />
            1. Create your account below
            <br />
            2. Login with your credentials
            <br />
            3. Enter your activation code to unlock full access
            <br />
            <br />
            <strong>Need an activation code?</strong> Contact us at{" "}
            <strong>+964 773 300 2076</strong>
          </Typography>
        </Alert>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Name Fields */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t("auth.firstName")}
                  {...register("first_name")}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t("auth.lastName")}
                  {...register("last_name")}
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Phone Number */}
            <TextField
              fullWidth
              label={t("auth.phone")}
              placeholder="+964 773 300 2076"
              {...register("phone_number")}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message || "Your login username"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Email */}
            <TextField
              fullWidth
              type="email"
              label={t("auth.emailOptional")}
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Fields */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
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

            {/* Register Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={registerMutation.isPending}
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
              {registerMutation.isPending
                ? t("auth.creating")
                : "Create Account"}
            </Button>
          </Box>
        </form>

        {/* Divider */}
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {t("auth.alreadyHaveAccount")}
          </Typography>
        </Divider>

        {/* Login Link */}
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
              {t("auth.signInInstead")}
            </Button>
          </Link>
        </Box>

        {/* Contact Info */}
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>To activate your account after registration:</strong>
            <br />
            📞 Call: <strong>+964 773 300 2076</strong>
            <br />
            ✉️ Email: <strong>support@janah.com</strong>
            <br />
            Purchase an activation code to unlock full shopping access.
          </Typography>
        </Alert>
      </Paper>
    </Container>
  );
}
