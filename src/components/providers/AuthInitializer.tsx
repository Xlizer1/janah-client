"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth.store";

export function AuthInitializer() {
  const { initialize } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only initialize auth on client side to prevent hydration mismatch
    setMounted(true);
    initialize();
  }, [initialize]);

  // Don't render anything during SSR to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return null;
}
