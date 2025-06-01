import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import type { Product, CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Computed values
  totalItems: number;
  totalPrice: number;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      get totalPrice() {
        return get().items.reduce((total, item) => total + item.subtotal, 0);
      },

      addItem: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          // Update existing item
          const newQuantity = existingItem.quantity + quantity;

          // Check stock
          if (newQuantity > product.stock_quantity) {
            toast.error(`Only ${product.stock_quantity} items available`);
            return;
          }

          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? {
                    ...item,
                    quantity: newQuantity,
                    subtotal: newQuantity * product.price,
                  }
                : item
            ),
          });

          toast.success(`Updated ${product.name} quantity`);
        } else {
          // Add new item
          if (quantity > product.stock_quantity) {
            toast.error(`Only ${product.stock_quantity} items available`);
            return;
          }

          const newItem: CartItem = {
            product,
            quantity,
            subtotal: quantity * product.price,
          };

          set({
            items: [...items, newItem],
          });

          toast.success(`Added ${product.name} to cart`);
        }
      },

      removeItem: (productId: number) => {
        const { items } = get();
        const item = items.find((item) => item.product.id === productId);

        set({
          items: items.filter((item) => item.product.id !== productId),
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

        // Check stock
        if (quantity > item.product.stock_quantity) {
          toast.error(`Only ${item.product.stock_quantity} items available`);
          return;
        }

        set({
          items: items.map((item) =>
            item.product.id === productId
              ? {
                  ...item,
                  quantity,
                  subtotal: quantity * item.product.price,
                }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
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
    }
  )
);

// Helper hook
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
    clearCart: store.clearCart,
    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,
  };
};
