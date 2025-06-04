import Link from "next/link";
import { Container, Box, Typography, Button, Paper } from "@mui/material";
import { Home, Search, ArrowBack } from "@mui/icons-material";
import { useTranslation } from "@/hooks/useTranslation";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 6,
          textAlign: "center",
          borderRadius: 3,
          background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        {/* 404 Illustration */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "4rem", md: "6rem" },
              fontWeight: 800,
              background: "linear-gradient(45deg, #0ea5e9 30%, #3b82f6 90%)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
            }}
          >
            404
          </Typography>
        </Box>

        {/* Error Message */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: "text.primary",
          }}
        >
          {t("404.title")}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 4,
            fontSize: "1.1rem",
            maxWidth: 500,
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          {t("404.subtitle")}
        </Typography>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexDirection: { xs: "column", sm: "row" },
            maxWidth: 400,
            mx: "auto",
          }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              sx={{
                py: 1.5,
                px: 3,
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
              {t("404.goHome")}
            </Button>
          </Link>

          <Link href="/products" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Search />}
              sx={{
                py: 1.5,
                px: 3,
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
              {t("404.browseProducts")}
            </Button>
          </Link>
        </Box>

        {/* Quick Links */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            {t("404.tryPopular")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/categories" style={{ textDecoration: "none" }}>
              <Typography
                variant="body2"
                color="primary.main"
                sx={{
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {t("nav.categories")}
              </Typography>
            </Link>
            <Typography variant="body2" color="text.disabled">
              •
            </Typography>
            <Link
              href="/products?featured=true"
              style={{ textDecoration: "none" }}
            >
              <Typography
                variant="body2"
                color="primary.main"
                sx={{
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {t("products.featured")}
              </Typography>
            </Link>
            <Typography variant="body2" color="text.disabled">
              •
            </Typography>
            <Link href="/auth/login" style={{ textDecoration: "none" }}>
              <Typography
                variant="body2"
                color="primary.main"
                sx={{
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {t("nav.login")}
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
