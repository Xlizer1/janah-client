// src/services/server.service.ts - New service for server info
import { api } from "@/lib/api-client";

interface ServerVersion {
  version: string;
  build: string;
  environment: string;
  timestamp: string;
  git_commit?: string;
  api_version: string;
}

interface HealthStatus {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  uptime: number;
  version: string;
  database: {
    status: "connected" | "disconnected";
    latency_ms?: number;
  };
  services: {
    [key: string]: {
      status: "healthy" | "unhealthy";
      latency_ms?: number;
    };
  };
}

export const serverService = {
  // Get server version and build info
  getVersion: async (): Promise<ServerVersion> => {
    return api.get("/");
  },

  // Health check endpoint
  getHealth: async (): Promise<HealthStatus> => {
    // Note: Health endpoint uses different base URL
    const healthUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
      "http://localhost:8000";

    try {
      const response = await fetch(`${healthUrl}/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      // Return unhealthy status if health check fails
      return {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        uptime: 0,
        version: "unknown",
        database: {
          status: "disconnected",
        },
        services: {},
      };
    }
  },

  // Combined server info (useful for admin dashboard)
  getServerInfo: async (): Promise<{
    version: ServerVersion;
    health: HealthStatus;
  }> => {
    const [version, health] = await Promise.all([
      serverService.getVersion(),
      serverService.getHealth(),
    ]);

    return { version, health };
  },
};

export default serverService;
