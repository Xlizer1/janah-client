"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/store/auth.store";
import { Box, Typography } from "@mui/material";
import React from "react";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingSpinner fullHeight />;
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <Box sx={{ p: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          You don't have permission to access this page.
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}

export default function AdminAnalyticsPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <AnalyticsDashboard />
      </AdminLayout>
    </AdminGuard>
  );
}
