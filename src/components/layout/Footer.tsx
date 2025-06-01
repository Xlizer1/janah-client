"use client";

import React from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Phone,
  Email,
  LocationOn,
  ArrowUpward,
} from "@mui/icons-material";

export function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    products: [
      { label: "All Products", href: "/products" },
      { label: "Electronics", href: "/categories/electronics" },
      { label: "Computers", href: "/categories/computers" },
      { label: "Smartphones", href: "/categories/smartphones" },
      { label: "Accessories", href: "/categories/accessories" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/story" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "Returns", href: "/returns" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Size Guide", href: "/size-guide" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Refund Policy", href: "/refunds" },
      { label: "Security", href: "/security" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: LinkedIn, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: YouTube, href: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "grey.900",
        color: "white",
        pt: 8,
        pb: 3,
        position: "relative",
      }}
    >
      <Container maxWidth="xl">
        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "primary.light",
              }}
            >
              Janah
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mb: 3,
                opacity: 0.8,
                lineHeight: 1.6,
                maxWidth: 300,
              }}
            >
              Your trusted partner for quality electronics and gadgets. We bring
              you the latest technology at unbeatable prices with exceptional
              customer service.
            </Typography>

            {/* Contact Info */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Phone sx={{ fontSize: 18, opacity: 0.7 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +964 773 300 2076
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Email sx={{ fontSize: 18, opacity: 0.7 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  support@janah.com
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn sx={{ fontSize: 18, opacity: 0.7 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Baghdad, Iraq
                </Typography>
              </Box>
            </Box>

            {/* Social Links */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": {
                      bgcolor: "primary.main",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <social.icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Footer Links */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {/* Products */}
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 2, fontSize: "1rem" }}
                >
                  Products
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {footerLinks.products.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.8,
                          cursor: "pointer",
                          "&:hover": {
                            opacity: 1,
                            color: "primary.light",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        {link.label}
                      </Typography>
                    </Link>
                  ))}
                </Box>
              </Grid>

              {/* Company */}
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 2, fontSize: "1rem" }}
                >
                  Company
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {footerLinks.company.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.8,
                          cursor: "pointer",
                          "&:hover": {
                            opacity: 1,
                            color: "primary.light",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        {link.label}
                      </Typography>
                    </Link>
                  ))}
                </Box>
              </Grid>

              {/* Support */}
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 2, fontSize: "1rem" }}
                >
                  Support
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {footerLinks.support.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.8,
                          cursor: "pointer",
                          "&:hover": {
                            opacity: 1,
                            color: "primary.light",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        {link.label}
                      </Typography>
                    </Link>
                  ))}
                </Box>
              </Grid>

              {/* Legal */}
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 2, fontSize: "1rem" }}
                >
                  Legal
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {footerLinks.legal.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.8,
                          cursor: "pointer",
                          "&:hover": {
                            opacity: 1,
                            color: "primary.light",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        {link.label}
                      </Typography>
                    </Link>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} Janah. All rights reserved.
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Made with ❤️ in Iraq
            </Typography>

            {/* Scroll to Top Button */}
            <IconButton
              onClick={scrollToTop}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.dark",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <ArrowUpward fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
