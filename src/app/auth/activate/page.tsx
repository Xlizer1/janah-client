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
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { VpnKey, CheckCircle, Phone, ArrowBack } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Link from "next/link";

import { authService } from "@/services/auth.service";
import { useTranslation } from "@/hooks/useTranslation";

interface ActivationFormData {
  phone_number: string;
  activation_code: string;
}

function ActivatePageContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const phoneFromUrl = searchParams.get("phone") || "";
  const [isSuccess, setIsSuccess] = useState(false);

  const activationSchema = yup.object({
    phone_number: yup
      .string()
      .required(t("validation.required"))
      .matches(/^\+?[1-9]\d{1,14}$/, t("validation.phone.invalid")),
    activation_code: yup
      .string()
      .required(t("validation.required"))
      .min(8, t("auth.activation.codeMinLength")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<ActivationFormData>({
    resolver: yupResolver(activationSchema),
    defaultValues: {
      phone_number: phoneFromUrl,
      activation_code: "",
    },
  });

  useEffect(() => {
    if (phoneFromUrl) {
      setValue("phone_number", phoneFromUrl);
    }
  }, [phoneFromUrl, setValue]);

  const activationMutation = useMutation({
    mutationFn: authService.activateAccount,
    onSuccess: (data) => {
      setIsSuccess(true);
      toast.success(t("auth.activation.success"));
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || t("auth.activation.failed");

      if (
        message.includes("Invalid or expired") ||
        message.includes("not found")
      ) {
        setError("activation_code", {
          message: t("auth.activation.codeInvalid"),
        });
      } else if (message.includes("already used")) {
        setError("activation_code", {
          message: t("auth.activation.codeUsed"),
        });
      } else if (message.includes("User not found")) {
        setError("phone_number", {
          message: t("auth.activation.userNotFound"),
        });
      } else if (message.includes("already activated")) {
        toast.info(t("auth.activation.alreadyActivated"));
        router.push("/auth/login");
        return;
      } else {
        toast.error(message);
      }
    },
  });

  const onSubmit = (data: ActivationFormData) => {
    activationMutation.mutate(data);
  };

  const handleContinueToLogin = () => {
    router.push("/auth/login");
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
            {t("auth.activation.complete")}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.6 }}
          >
            {t("auth.activation.welcome")}
          </Typography>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleContinueToLogin}
            sx={{
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
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
            {t("auth.activation.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {t("auth.activation.subtitle")}
          </Typography>
        </Box>

        {/* Activation Info */}
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>{t("auth.activation.howToGet")}</strong>
            <br />
            📞 {t("auth.activation.call")}: <strong>+964 773 300 2076</strong>
            <br />
            ✉️ {t("auth.activation.email")}: <strong>support@janah.com</strong>
            <br />
            {t("auth.activation.purchase")}
          </Typography>
        </Alert>

        {/* Activation Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              fullWidth
              label={t("auth.phone")}
              placeholder="+964 773 300 2076"
              {...register("phone_number")}
              error={!!errors.phone_number}
              helperText={
                errors.phone_number?.message || t("auth.activation.phoneHelper")
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
                readOnly: !!phoneFromUrl,
              }}
              sx={{
                "& .MuiInputBase-input": {
                  bgcolor: phoneFromUrl ? "grey.50" : "transparent",
                },
              }}
            />

            <TextField
              fullWidth
              label={t("auth.activation.code")}
              placeholder={t("auth.activation.codePlaceholder")}
              {...register("activation_code")}
              error={!!errors.activation_code}
              helperText={
                errors.activation_code?.message ||
                t("auth.activation.codeExample")
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
                  {t("auth.activation.activating")}
                </Box>
              ) : (
                t("auth.activation.activate")
              )}
            </Button>
          </Box>
        </form>

        {/* Help */}
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>{t("auth.activation.needCode")}</strong>
            <br />
            {t("auth.activation.contact")}
          </Typography>
        </Alert>

        {/* Already have account */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {t("auth.activation.alreadyActivated")}?{" "}
            <Link href="/auth/login">
              <Typography
                component="span"
                color="primary.main"
                sx={{
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {t("auth.activation.loginHere")}
              </Typography>
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default function ActivatePage() {
  return (
    <Suspense
      fallback={
        <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
          <CircularProgress />
        </Container>
      }
    >
      <ActivatePageContent />
    </Suspense>
  );
}
