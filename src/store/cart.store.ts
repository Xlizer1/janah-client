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

          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? {
                    ...item,
                    quantity: newQuantity,
                    subtotal: newQuantity * product.price,
                    selling_price: selling_price || item.selling_price,
                  }
                : item
            ),
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

      updateSellingPrice: (productId: number, selling_price: number) => {
        const { items } = get();

        set({
          items: items.map((item) =>
            item.product.id === productId
              ? {
                  ...item,
                  selling_price,
                }
              : item
          ),
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
