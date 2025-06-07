"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Button,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ShoppingCart,
  Search,
  Menu as MenuIcon,
  Person,
  Login,
  Dashboard,
  Logout,
  AccountCircle,
} from "@mui/icons-material";
import { useAuth } from "@/store/auth.store";
import { useCart } from "@/store/cart.store";
import { useUI } from "@/store/ui.store";
import { SearchBar } from "@/components/search/SearchBar";
import { toast } from "react-toastify";

import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";

export function Header() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { totalItems, openCart } = useCart();
  const { toggleMobileMenu, isSearchOpen, toggleSearch } = useUI();

  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
      toast.success(t("auth.success"));
    } catch (error) {
      toast.error(t("auth.error"));
    }
    handleUserMenuClose();
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    handleUserMenuClose();
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{ bgcolor: "white", color: "text.primary" }}
        elevation={1}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0, sm: 2 } }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={toggleMobileMenu}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  textDecoration: "none",
                  mr: 4,
                }}
              >
                Janah
              </Typography>
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 3, mr: "auto" }}>
                <Link href="/products">
                  <Button color="inherit" sx={{ fontWeight: 500 }}>
                    {t("nav.products")}
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button color="inherit" sx={{ fontWeight: 500 }}>
                    {t("nav.categories")}
                  </Button>
                </Link>
                {isAuthenticated && (
                  <Link href="/orders">
                    <Button color="inherit" sx={{ fontWeight: 500 }}>
                      {t("nav.orders")}
                    </Button>
                  </Link>
                )}
                <Link href="/about">
                  <Button color="inherit" sx={{ fontWeight: 500 }}>
                    {t("nav.about")}
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button color="inherit" sx={{ fontWeight: 500 }}>
                    {t("nav.contact")}
                  </Button>
                </Link>
              </Box>
            )}

            {/* Spacer for mobile */}
            {isMobile && <Box sx={{ flexGrow: 1 }} />}

            {/* Search Bar - Desktop */}
            {!isMobile && !isSearchOpen && (
              <Box sx={{ flexGrow: 1, maxWidth: 600, mx: 2 }}>
                <SearchBar />
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Search Button - Mobile */}
              {isMobile && (
                <IconButton color="inherit" onClick={toggleSearch}>
                  <Search />
                </IconButton>
              )}

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Cart Button */}
              <IconButton color="inherit">
                <Link href={"/cart"}>
                  <Badge badgeContent={totalItems} color="primary">
                    <ShoppingCart />
                  </Badge>
                </Link>
              </IconButton>

              {/* User Menu */}
              {isAuthenticated ? (
                <>
                  <IconButton
                    color="inherit"
                    onClick={handleUserMenuOpen}
                    sx={{ p: 0.5 }}
                  >
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                    >
                      {user?.first_name?.[0]?.toUpperCase() || "U"}
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem onClick={() => handleNavigation("/profile")}>
                      <AccountCircle sx={{ mr: 1 }} />
                      {t("nav.profile")}
                    </MenuItem>

                    {isAdmin && (
                      <MenuItem onClick={() => handleNavigation("/admin")}>
                        <Dashboard sx={{ mr: 1 }} />
                        {t("nav.admin")}
                      </MenuItem>
                    )}

                    <MenuItem onClick={handleLogout}>
                      <Logout sx={{ mr: 1 }} />
                      {t("nav.logout")}
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Login />}
                    onClick={() => router.push("/auth/login")}
                    sx={{ display: { xs: "none", sm: "flex" } }}
                  >
                    {t("nav.login")}
                  </Button>
                  <IconButton
                    color="inherit"
                    onClick={() => router.push("/auth/login")}
                    sx={{ display: { xs: "flex", sm: "none" } }}
                  >
                    <Person />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Search Bar */}
      {isMobile && isSearchOpen && (
        <Box
          sx={{
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
            p: 2,
          }}
        >
          <SearchBar />
        </Box>
      )}
    </>
  );
}
