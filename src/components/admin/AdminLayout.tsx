"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Breadcrumbs,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Inventory,
  Category,
  People,
  Analytics,
  Settings,
  Logout,
  AccountCircle,
  Home,
  ChevronRight,
  FilePresent,
} from "@mui/icons-material";
import { useAuth } from "@/store/auth.store";
import { toast } from "react-toastify";

const drawerWidth = 260;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
    handleUserMenuClose();
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: Dashboard,
      href: "/admin",
    },
    {
      text: "Products",
      icon: Inventory,
      href: "/admin/products",
    },
    {
      text: "Categories",
      icon: Category,
      href: "/admin/categories",
    },
    {
      text: "Users",
      icon: People,
      href: "/admin/users",
    },
    {
      text: "Analytics",
      icon: Analytics,
      href: "/admin/analytics",
    },
    {
      text: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
    // {
    //   text: "Bulk Operations",
    //   icon: Settings,
    //   href: "/admin/bulk-operations",
    // },
    {
      text: "Import/Export",
      icon: FilePresent,
      href: "/admin/import-export",
    },
  ];

  const generateBreadcrumbs = (pathname: string) => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs = [
      { label: "Home", href: "/" },
      { label: "Admin", href: "/admin" },
    ];

    if (paths.length > 1) {
      for (let i = 1; i < paths.length; i++) {
        const path = `/${paths.slice(0, i + 1).join("/")}`;
        const label = paths[i].charAt(0).toUpperCase() + paths[i].slice(1);
        breadcrumbs.push({ label, href: path });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs(pathname);

  const drawer = (
    <Box>
      {/* Logo */}
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "primary.main" }}
        >
          Janah Admin
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <Link
                href={item.href}
                style={{ width: "100%", textDecoration: "none" }}
              >
                <ListItemButton
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "white",
                      },
                    },
                  }}
                >
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mt: "auto" }} />

      {/* Back to Store */}
      <Box sx={{ p: 2 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <ListItemButton sx={{ borderRadius: 2 }}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Back to Store" />
          </ListItemButton>
        </Link>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Breadcrumbs */}
          <Box sx={{ flexGrow: 1 }}>
            <Breadcrumbs separator={<ChevronRight fontSize="small" />}>
              {breadcrumbs.map((crumb, index) => (
                <Link key={crumb.href} href={crumb.href}>
                  <Typography
                    color={
                      index === breadcrumbs.length - 1
                        ? "primary.main"
                        : "text.secondary"
                    }
                    sx={{ cursor: "pointer", fontSize: "0.875rem" }}
                  >
                    {crumb.label}
                  </Typography>
                </Link>
              ))}
            </Breadcrumbs>
          </Box>

          {/* User Menu */}
          <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
              {user?.first_name?.[0]?.toUpperCase() || "A"}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
          >
            <MenuItem
              onClick={() => {
                router.push("/profile");
                handleUserMenuClose();
              }}
            >
              <AccountCircle sx={{ mr: 2 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: "grey.50",
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
