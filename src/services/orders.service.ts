import { api } from "@/lib/api-client";
import type {
  Order,
  OrderCreateData,
  OrderItem,
  OrdersResponse,
  OrderFilters,
} from "@/types";

const normalizeOrder = (order: any): Order => {
  return {
    ...order,
    items: order.items || [],
    items_count: order.items_count || order.items?.length || 0,
    delivery_notes: order.delivery_notes || "",
    confirmed_at: order.confirmed_at || null,
    shipped_at: order.shipped_at || null,
    delivered_at: order.delivered_at || null,
    cancelled_at: order.cancelled_at || null,
    cancellation_reason: order.cancellation_reason || null,
  };
};

export const ordersService = {
  customer: {
    createOrder: async (
      data: OrderCreateData
    ): Promise<{ order: Order; message: string }> => {
      return api.post("/orders", data);
    },

    getMyOrders: async (
      filters: OrderFilters = {}
    ): Promise<OrdersResponse> => {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      );
      return api.get("/orders/my-orders", cleanFilters);
    },

    getMyOrder: async (orderId: number): Promise<{ order: Order }> => {
      return api.get(`/orders/my-orders/${orderId}`);
    },

    trackOrder: async (
      orderNumber: string
    ): Promise<{
      order: Order;
      status_history: Array<{
        id: number;
        status: string;
        notes?: string;
        created_at: string;
      }>;
    }> => {
      return api.get(`/orders/track/${orderNumber}`);
    },
  },

  admin: {
    getAllOrders: async (
      filters: OrderFilters = {}
    ): Promise<OrdersResponse> => {
      try {
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(
            ([_, value]) =>
              value !== undefined && value !== null && value !== ""
          )
        );

        const response = await api.get("/orders/admin/all", cleanFilters);

        if (response.orders && Array.isArray(response.orders)) {
          response.orders = response.orders.map(normalizeOrder);
        }

        return response;
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        throw error;
      }
    },

    getOrder: async (orderId: number): Promise<{ order: Order }> => {
      try {
        const response = await api.get(`/orders/admin/${orderId}`);

        if (response.order) {
          response.order = normalizeOrder(response.order);
        }

        return response;
      } catch (error) {
        console.error(`Failed to fetch order ${orderId}:`, error);
        throw error;
      }
    },

    updateOrderStatus: async (
      orderId: number,
      data: { status: string; notes?: string }
    ): Promise<{ order: Order }> => {
      return api.put(`/orders/admin/${orderId}/status`, data);
    },

    cancelOrder: async (
      orderId: number,
      reason: string
    ): Promise<{ order: Order }> => {
      return api.post(`/orders/admin/${orderId}/cancel`, { reason });
    },

    getOrdersByStatus: async (
      status: string,
      filters: { page?: number; limit?: number } = {}
    ): Promise<OrdersResponse> => {
      try {
        const response = await api.get(
          `/orders/admin/status/${status}`,
          filters
        );

        if (response.orders && Array.isArray(response.orders)) {
          response.orders = response.orders.map(normalizeOrder);
        }

        return response;
      } catch (error) {
        console.error(`Failed to fetch ${status} orders:`, error);
        throw error;
      }
    },

    getOrderStatistics: async (params?: {
      start_date?: string;
      end_date?: string;
    }): Promise<{
      total_orders: number;
      pending_orders: number;
      confirmed_orders: number;
      shipped_orders: number;
      delivered_orders: number;
      cancelled_orders: number;
      total_revenue: number;
      average_order_value: number;
    }> => {
      return api.get("/orders/admin/statistics", params);
    },

    getOrderHistory: async (
      orderId: number
    ): Promise<{
      history: Array<{
        id: number;
        status: string;
        notes?: string;
        created_at: string;
        created_by?: string;
      }>;
    }> => {
      return api.get(`/orders/admin/${orderId}/history`);
    },
  },
};

export default ordersService;
