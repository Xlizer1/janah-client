import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import type { Product, CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;

  addItem: (
    product: Product,
    quantity?: number,
    selling_price?: number
  ) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateSellingPrice: (productId: number, selling_price: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  validateSellingPrices: () => boolean;
  getItemsWithSellingPrices: () => Array<{
    product_id: number;
    quantity: number;
    selling_price?: number;
  }>;
}

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.subtotal, 0);
  return { totalItems, totalPrice };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0,

      addItem: (product: Product, quantity = 1, selling_price?: number) => {
        const { items } = get();
        const existingItem = items.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;

          if (newQuantity > product.stock_quantity) {
            toast.error(`Only ${product.stock_quantity} items available`);
            return;
          }

          const updatedItems = items.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: newQuantity,
                  subtotal: newQuantity * product.price,
                  selling_price: selling_price || item.selling_price,
                }
              : item
          );

          const totals = calculateTotals(updatedItems);

          set({
            items: updatedItems,
            ...totals,
          });

          toast.success(`Updated ${product.name} quantity`);
        } else {
          if (quantity > product.stock_quantity) {
            toast.error(`Only ${product.stock_quantity} items available`);
            return;
          }

          const newItem: CartItem = {
            product,
            quantity,
            subtotal: quantity * product.price,
            selling_price: selling_price,
          };

          const updatedItems = [...items, newItem];
          const totals = calculateTotals(updatedItems);

          set({
            items: updatedItems,
            ...totals,
          });

          toast.success(`Added ${product.name} to cart`);
        }
      },

      removeItem: (productId: number) => {
        const { items } = get();
        const item = items.find((item) => item.product.id === productId);

        const updatedItems = items.filter(
          (item) => item.product.id !== productId
        );
        const totals = calculateTotals(updatedItems);

        set({
          items: updatedItems,
          ...totals,
        });

        if (item) {
          toast.success(`Removed ${item.product.name} from cart`);
        }
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const { items } = get();
        const item = items.find((item) => item.product.id === productId);

        if (!item) return;

        if (quantity > item.product.stock_quantity) {
          toast.error(`Only ${item.product.stock_quantity} items available`);
          return;
        }

        const updatedItems = items.map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity,
                subtotal: quantity * item.product.price,
              }
            : item
        );

        const totals = calculateTotals(updatedItems);

        set({
          items: updatedItems,
          ...totals,
        });
      },

      updateSellingPrice: (productId: number, selling_price: number) => {
        const { items } = get();

        const updatedItems = items.map((item) =>
          item.product.id === productId
            ? {
                ...item,
                selling_price,
              }
            : item
        );

        set({
          items: updatedItems,
        });
      },

      validateSellingPrices: () => {
        const { items } = get();
        return items.every((item) => {
          if (item.selling_price === undefined || item.selling_price === null) {
            return false;
          }
          return item.selling_price > 0;
        });
      },

      getItemsWithSellingPrices: () => {
        const { items } = get();
        return items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          selling_price: item.selling_price,
        }));
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
        toast.success("Cart cleared");
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
      }),
      // Rehydrate totals when loading from storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          const totals = calculateTotals(state.items);
          state.totalItems = totals.totalItems;
          state.totalPrice = totals.totalPrice;
        }
      },
    }
  )
);

export const useCart = () => {
  const store = useCartStore();
  return {
    items: store.items,
    isOpen: store.isOpen,
    totalItems: store.totalItems,
    totalPrice: store.totalPrice,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    updateSellingPrice: store.updateSellingPrice,
    clearCart: store.clearCart,
    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,
    validateSellingPrices: store.validateSellingPrices,
    getItemsWithSellingPrices: store.getItemsWithSellingPrices,
  };
};
