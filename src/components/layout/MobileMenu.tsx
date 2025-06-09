"use client";

import React, { useState } from "react";
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
  Skeleton,
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
  Storefront,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/store/auth.store";
import { useUI } from "@/store/ui.store";
import { categoriesService } from "@/services/categories.service";
import { toast } from "react-toastify";
import { useTranslation } from "@/hooks/useTranslation";

export function MobileMenu() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { isMobileMenuOpen, closeMobileMenu } = useUI();
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  // Fetch categories dynamically
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories", "mobile-menu"],
    queryFn: () => categoriesService.getCategoriesWithCounts(true), // Only active categories
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const handleNavigation = (path: string) => {
    router.push(path);
    closeMobileMenu();
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
      toast.success(t("auth.success"));
    } catch (error) {
      toast.error(t("auth.error"));
    }
    closeMobileMenu();
  };

  const staticMenuItems = [
    {
      label: t("nav.home"),
      icon: Home,
      href: "/",
    },
    {
      label: t("nav.products"),
      icon: ShoppingBag,
      href: "/products",
    },
    ...(isAuthenticated
      ? [
          {
            label: t("nav.orders"),
            icon: Receipt,
            href: "/orders",
          },
        ]
      : []),
    {
      label: t("nav.about"),
      icon: Info,
      href: "/about",
    },
    {
      label: t("nav.contact"),
      icon: ContactMail,
      href: "/contact",
    },
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
              {t("auth.signInToAccess")}
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
                  {t("nav.login")}
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
                  {t("nav.register")}
                </Box>
              </Link>
            </Box>
          </Box>
        )}

        <Divider />

        {/* Main Menu */}
        <List sx={{ flex: 1, py: 0 }}>
          {/* Static Menu Items */}
          {staticMenuItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton onClick={() => handleNavigation(item.href)}>
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}

          {/* Dynamic Categories Section */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => setCategoriesOpen(!categoriesOpen)}>
              <ListItemIcon>
                <Category />
              </ListItemIcon>
              <ListItemText primary={t("nav.categories")} />
              {categoriesLoading ? (
                <Skeleton width={20} height={20} />
              ) : categoriesOpen ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </ListItemButton>
          </ListItem>

          {/* Categories Submenu */}
          <Collapse in={categoriesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* All Categories */}
              <ListItem disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => handleNavigation("/categories")}
                >
                  <ListItemIcon>
                    <Storefront fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t("categories.viewAll")}
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: 600,
                    }}
                  />
                </ListItemButton>
              </ListItem>

              {/* Loading State */}
              {categoriesLoading && (
                <>
                  {[1, 2, 3].map((i) => (
                    <ListItem key={i} disablePadding>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <Skeleton width={20} height={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<Skeleton width={100} height={20} />}
                          secondary={<Skeleton width={60} height={16} />}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </>
              )}

              {/* Dynamic Categories */}
              {categoriesData?.categories?.map((category) => (
                <ListItem key={category.id} disablePadding>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    onClick={() =>
                      handleNavigation(`/products?category=${category.id}`)
                    }
                  >
                    <ListItemIcon>
                      {category.image_url ? (
                        <Box
                          component="img"
                          src={category.image_url}
                          alt={category.name}
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: 0.5,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Category fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={category.name}
                      secondary={
                        category.product_count
                          ? t("categories.productsCount", {
                              count: category.product_count,
                            })
                          : undefined
                      }
                      primaryTypographyProps={{
                        variant: "body2",
                      }}
                      secondaryTypographyProps={{
                        variant: "caption",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}

              {/* Error State */}
              {!categoriesLoading && !categoriesData?.categories?.length && (
                <ListItem disablePadding>
                  <ListItemButton sx={{ pl: 4 }} disabled>
                    <ListItemText
                      primary={t("categories.noCategories")}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </List>
          </Collapse>
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
                <ListItemText primary={t("nav.profile")} />
              </ListItemButton>
            </ListItem>

            {isAdmin && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleNavigation("/admin")}>
                  <ListItemIcon>
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText primary={t("nav.admin")} />
                </ListItemButton>
              </ListItem>
            )}

            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary={t("nav.logout")} />
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
