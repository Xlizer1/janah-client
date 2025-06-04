"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Email, Send, CheckCircle } from "@mui/icons-material";
import { toast } from "react-toastify";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubscribed(true);
      setEmail("");
      toast.success("Successfully subscribed to newsletter!");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CheckCircle sx={{ fontSize: 60, color: "white", mb: 2 }} />
        <Typography
          variant="h4"
          sx={{ color: "white", fontWeight: 700, mb: 2 }}
        >
          Thank You!
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem" }}
        >
          You've successfully subscribed to our newsletter. Get ready for
          amazing deals and updates!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: "center", color: "white" }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
              }}
            >
              Stay in the Loop
            </Typography>

            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                fontSize: "1.1rem",
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              Subscribe to our newsletter and be the first to know about new
              products, exclusive deals, and special offers. No spam, just great
              content!
            </Typography>

            {/* Newsletter Benefits */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              {[
                "🎉 Exclusive discounts and early access",
                "📦 New product announcements",
                "💡 Tech tips and buying guides",
                "🎁 Special member-only offers",
              ].map((benefit, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    opacity: 0.8,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {benefit}
                </Typography>
              ))}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.1)",
              borderRadius: 3,
              p: 4,
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Join 10,000+ Subscribers
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "rgba(255,255,255,0.7)" }} />
                      </InputAdornment>
                    ),
                    sx: {
                      bgcolor: "rgba(255,255,255,0.9)",
                      borderRadius: 2,
                      "& input": {
                        py: 1.5,
                      },
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.95)",
                      },
                      "&.Mui-focused": {
                        bgcolor: "white",
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  endIcon={<Send />}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.9)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    },
                    "&:disabled": {
                      bgcolor: "rgba(255,255,255,0.7)",
                      color: "rgba(14, 165, 233, 0.7)",
                    },
                  }}
                >
                  {isLoading ? "Subscribing..." : "Subscribe Now"}
                </Button>
              </Box>
            </form>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 2,
                opacity: 0.7,
                fontSize: "0.8rem",
              }}
            >
              By subscribing, you agree to our privacy policy. Unsubscribe at
              any time.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
