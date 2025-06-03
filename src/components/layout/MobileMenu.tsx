"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  Close,
  Home,
  Category,
  ShoppingBag,
  Person,
  Login,
  Dashboard,
  Logout,
  Info,
  ContactMail,
  ExpandLess,
  ExpandMore,
  Star,
  Receipt,
} from "@mui/icons-material";
import { useAuth } from "@/store/auth.store";
import { useUI } from "@/store/ui.store";
import { toast } from "react-toastify";

export function MobileMenu() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { isMobileMenuOpen, closeMobileMenu } = useUI();
  const [categoriesOpen, setCategoriesOpen] = React.useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
    closeMobileMenu();
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
    closeMobileMenu();
  };

  const menuItems = [
    {
      label: "Home",
      icon: Home,
      href: "/",
    },
    {
      label: "Products",
      icon: ShoppingBag,
      href: "/products",
    },
    {
      label: "Categories",
      icon: Category,
      href: "/categories",
      hasSubmenu: true,
      submenu: [
        { label: "Electronics", href: "/categories/electronics" },
        { label: "Computers", href: "/categories/computers" },
        { label: "Smartphones", href: "/categories/smartphones" },
        { label: "Accessories", href: "/categories/accessories" },
        { label: "All Categories", href: "/categories" },
      ],
    },
    ...(isAuthenticated
      ? [
          {
            label: "My Orders",
            icon: Receipt,
            href: "/orders",
          },
        ]
      : []),
    // {
    //   label: "Featured",
    //   icon: Star,
    //   href: "/products?featured=true",
    // },
    // {
    //   label: "About",
    //   icon: Info,
    //   href: "/about",
    // },
    // {
    //   label: "Contact",
    //   icon: ContactMail,
    //   href: "/contact",
    // },
  ];

  return (
    <Drawer
      anchor="left"
      open={isMobileMenuOpen}
      onClose={closeMobileMenu}
      sx={{
        "& .MuiDrawer-paper": {
          width: 280,
          bgcolor: "background.paper",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Janah
          </Typography>
          <IconButton color="inherit" onClick={closeMobileMenu} edge="end">
            <Close />
          </IconButton>
        </Box>

        {/* User Section */}
        {isAuthenticated ? (
          <Box sx={{ p: 2, bgcolor: "grey.50" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                {user?.first_name?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || user?.phone_number}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ p: 2, bgcolor: "grey.50" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Sign in to access your account
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Link href="/auth/login" className="flex-1">
                <Box
                  component="button"
                  onClick={() => handleNavigation("/auth/login")}
                  sx={{
                    width: "100%",
                    bgcolor: "primary.main",
                    color: "white",
                    border: "none",
                    py: 1,
                    px: 2,
                    borderRadius: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Login
                </Box>
              </Link>
              <Link href="/auth/register" className="flex-1">
                <Box
                  component="button"
                  onClick={() => handleNavigation("/auth/register")}
                  sx={{
                    width: "100%",
                    bgcolor: "transparent",
                    color: "primary.main",
                    border: "1px solid",
                    borderColor: "primary.main",
                    py: 1,
                    px: 2,
                    borderRadius: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Register
                </Box>
              </Link>
            </Box>
          </Box>
        )}

        <Divider />

        {/* Main Menu */}
        <List sx={{ flex: 1, py: 0 }}>
          {menuItems.map((item) => (
            <React.Fragment key={item.label}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() =>
                    item.hasSubmenu
                      ? setCategoriesOpen(!categoriesOpen)
                      : handleNavigation(item.href)
                  }
                >
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  {item.hasSubmenu &&
                    (categoriesOpen ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>

              {/* Submenu */}
              {item.hasSubmenu && (
                <Collapse in={categoriesOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenu?.map((subItem) => (
                      <ListItem key={subItem.href} disablePadding>
                        <ListItemButton
                          sx={{ pl: 4 }}
                          onClick={() => handleNavigation(subItem.href)}
                        >
                          <ListItemText
                            primary={subItem.label}
                            primaryTypographyProps={{
                              variant: "body2",
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>

        <Divider />

        {/* User Actions */}
        {isAuthenticated && (
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation("/profile")}>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>

            {isAdmin && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleNavigation("/admin")}>
                  <ListItemIcon>
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText primary="Admin Dashboard" />
                </ListItemButton>
              </ListItem>
            )}

            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        )}

        {/* Footer */}
        <Box sx={{ p: 2, bgcolor: "grey.100" }}>
          <Typography variant="caption" color="text.secondary" align="center">
            © {new Date().getFullYear()} Janah
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
