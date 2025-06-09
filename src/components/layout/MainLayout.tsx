"use client";

import React from "react";
import { Box } from "@mui/material";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MobileMenu } from "./MobileMenu";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { RTLProvider } from "./RTLProvider";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <RTLProvider>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />

        <Box component="main" sx={{ flex: 1 }}>
          {children}
        </Box>

        <Footer />

        {/* Cart Drawer */}
        <CartDrawer />

        {/* Mobile Menu */}
        <MobileMenu />
      </Box>
    </RTLProvider>
  );
}
