"use client";

import { useEffect } from "react";
import { useAuth } from "@/store/auth.store";

export function AuthInitializer() {
  const { initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}
