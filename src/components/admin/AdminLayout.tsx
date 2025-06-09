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
  Receipt,
  VpnKey,
} from "@mui/icons-material";
import { useAuth } from "@/store/auth.store";
import { toast } from "react-toastify";
import { useTranslation } from "@/hooks/useTranslation";

const drawerWidth = 260;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const theme = useTheme();
  const { t } = useTranslation();
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
      toast.success(t("auth.success"));
    } catch (error) {
      toast.error(t("auth.error"));
    }
    handleUserMenuClose();
  };

  const menuItems = [
    {
      text: t("admin.dashboard"),
      icon: Dashboard,
      href: "/admin",
    },
    {
      text: t("admin.products"),
      icon: Inventory,
      href: "/admin/products",
    },
    {
      text: t("admin.categories"),
      icon: Category,
      href: "/admin/categories",
    },
    {
      text: t("nav.orders"),
      icon: Receipt,
      href: "/admin/orders",
    },
    {
      text: t("admin.users"),
      icon: People,
      href: "/admin/users",
    },
    {
      text: t("admin.analytics"),
      icon: Analytics,
      href: "/admin/analytics",
    },
    {
      text: t("admin.settings"),
      icon: Settings,
      href: "/admin/settings",
    },
    {
      text: t("admin.importExport"),
      icon: FilePresent,
      href: "/admin/import-export",
    },
    {
      text: t("admin.activationCodes"),
      href: "/admin/activation-codes",
      icon: VpnKey,
    },
  ];

  const generateBreadcrumbs = (pathname: string) => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs = [
      { label: t("nav.home"), href: "/" },
      { label: t("admin.dashboard"), href: "/admin" },
    ];

    if (paths.length > 1) {
      for (let i = 1; i < paths.length; i++) {
        const path = `/${paths.slice(0, i + 1).join("/")}`;
        const pathSegment = paths[i];

        // Translate known path segments
        let label = pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);
        switch (pathSegment) {
          case "products":
            label = t("admin.products");
            break;
          case "categories":
            label = t("admin.categories");
            break;
          case "users":
            label = t("admin.users");
            break;
          case "analytics":
            label = t("admin.analytics");
            break;
          case "settings":
            label = t("admin.settings");
            break;
          case "import-export":
            label = t("admin.importExport");
            break;
          case "orders":
            label = t("nav.orders");
            break;
          case "pending":
            label = t("admin.users.pending.title");
            break;
          case "activation-codes":
            label = t("admin.activationCodes");
            break;
          default:
            // Keep the default capitalized label for dynamic routes
            break;
        }

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
          {t("admin.brandName")}
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
            <ListItemText primary={t("admin.back")} />
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
        elevation={0}
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
              {t("nav.profile")}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 2 }} />
              {t("nav.logout")}
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
