"use client";

import React from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ShoppingBag, TrendingUp, Star } from "@mui/icons-material";
import { useTranslation } from "@/hooks/useTranslation";

export function HeroSection() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #8b5cf6 100%)",
        color: "white",
        py: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  fontWeight: 800,
                  mb: 2,
                  background:
                    "linear-gradient(45deg, #ffffff 30%, #e0f2fe 90%)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t("hero.title")}
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                {t("hero.subtitle")}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "center", sm: "flex-start" },
                }}
              >
                <Link href="/products">
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingBag />}
                    sx={{
                      bgcolor: "white",
                      color: "primary.main",
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                      "&:hover": {
                        bgcolor: "gray.50",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {t("hero.shopNow")}
                  </Button>
                </Link>

                <Link href="/products?featured=true">
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<TrendingUp />}
                    sx={{
                      borderColor: "white",
                      color: "white",
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      borderRadius: 2,
                      borderWidth: 2,
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                        borderWidth: 2,
                      },
                    }}
                  >
                    {t("hero.viewTrending")}
                  </Button>
                </Link>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: { xs: 300, md: 400 },
                position: "relative",
              }}
            >
              {/* Placeholder for hero image */}
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <Typography variant="h6" sx={{ opacity: 0.8 }}>
                  {t("hero.imagePlaceholder")}
                </Typography>
              </Box>

              {/* Floating stats cards */}
              <Box
                sx={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  bgcolor: "rgba(255,255,255,0.95)",
                  color: "text.primary",
                  p: 2,
                  borderRadius: 2,
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  display: { xs: "none", md: "block" },
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Star sx={{ color: "#fbbf24", fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={600}>
                    {t("hero.rating")}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {t("hero.reviews")}
                </Typography>
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  bgcolor: "rgba(255,255,255,0.95)",
                  color: "text.primary",
                  p: 2,
                  borderRadius: 2,
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  display: { xs: "none", md: "block" },
                }}
              >
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  10,000+
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t("hero.happyCustomers")}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
