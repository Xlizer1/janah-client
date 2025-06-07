"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { VpnKey, CheckCircle, Phone } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { useAuth } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { useTranslation } from "@/hooks/useTranslation";

const activationSchema = yup.object({
  activation_code: yup
    .string()
    .required("Activation code is required")
    .min(8, "Activation code must be at least 8 characters"),
});

interface ActivationFormData {
  activation_code: string;
}

export default function ActivatePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, updateUser, logout } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ActivationFormData>({
    resolver: yupResolver(activationSchema),
  });

  const activationMutation = useMutation({
    mutationFn: authService.activateAccount,
    onSuccess: (data) => {
      updateUser(data.user);
      setIsSuccess(true);
      toast.success("Account activated successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Activation failed";

      if (message.includes("Invalid or expired")) {
        setError("activation_code", {
          message: "Invalid or expired activation code",
        });
      } else if (message.includes("already used")) {
        setError("activation_code", {
          message: "This activation code has already been used",
        });
      } else {
        toast.error(message);
      }
    },
  });

  const onSubmit = (data: ActivationFormData) => {
    activationMutation.mutate(data);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const handleContinue = () => {
    if (user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  // Redirect if user is already active
  if (user?.is_active) {
    router.push("/");
    return null;
  }

  // Redirect if not logged in
  if (!user) {
    router.push("/auth/login");
    return null;
  }

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
            Account Activated!
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.6 }}
          >
            Welcome to Janah! Your account has been successfully activated. You
            now have full access to our store.
          </Typography>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleContinue}
            sx={{
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Continue to Store
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
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <VpnKey
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
            Activate Your Account
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Enter your activation code to unlock full access to Janah
          </Typography>

          {/* User Info */}
          <Box
            sx={{
              bgcolor: "grey.50",
              p: 2,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Phone sx={{ color: "text.secondary" }} />
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user.first_name} {user.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.phone_number}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Activation Info */}
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>How to get an activation code:</strong>
            <br />
            📞 Call: <strong>+964 773 300 2076</strong>
            <br />
            ✉️ Email: <strong>support@janah.com</strong>
            <br />
            Purchase an activation code to unlock full shopping access.
          </Typography>
        </Alert>

        {/* Activation Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              fullWidth
              label="Activation Code"
              placeholder="Enter your activation code"
              {...register("activation_code")}
              error={!!errors.activation_code}
              helperText={
                errors.activation_code?.message ||
                "Example: JANAH-2024-ABC123 or PREMIUM-XYZ789"
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "monospace",
                  fontSize: "1.1rem",
                  textTransform: "uppercase",
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={activationMutation.isPending}
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
              {activationMutation.isPending ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Activating...
                </Box>
              ) : (
                "Activate Account"
              )}
            </Button>
          </Box>
        </form>

        {/* Logout Option */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="text"
            onClick={handleLogout}
            sx={{ textTransform: "none" }}
          >
            Logout and use different account
          </Button>
        </Box>

        {/* Help */}
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Don't have an activation code?</strong>
            <br />
            Contact our sales team to purchase an activation code and start
            shopping today!
          </Typography>
        </Alert>
      </Paper>
    </Container>
  );
}
