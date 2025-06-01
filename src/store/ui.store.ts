import { create } from "zustand";

interface UIState {
  // Theme
  isDarkMode: boolean;

  // Loading states
  loadingStates: Record<string, boolean>;

  // Mobile navigation
  isMobileMenuOpen: boolean;

  // Search
  isSearchOpen: boolean;
  searchQuery: string;

  // Modals
  modals: Record<string, boolean>;

  // Actions
  toggleDarkMode: () => void;
  setLoading: (key: string, loading: boolean) => void;
  clearAllLoading: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleSearch: () => void;
  setSearchQuery: (query: string) => void;
  openModal: (modalKey: string) => void;
  closeModal: (modalKey: string) => void;
  closeAllModals: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  isDarkMode: false,
  loadingStates: {},
  isMobileMenuOpen: false,
  isSearchOpen: false,
  searchQuery: "",
  modals: {},

  // Theme actions
  toggleDarkMode: () => {
    set((state) => ({ isDarkMode: !state.isDarkMode }));
  },

  // Loading actions
  setLoading: (key: string, loading: boolean) => {
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: loading,
      },
    }));
  },

  clearAllLoading: () => {
    set({ loadingStates: {} });
  },

  // Mobile menu actions
  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },

  closeMobileMenu: () => {
    set({ isMobileMenuOpen: false });
  },

  // Search actions
  toggleSearch: () => {
    set((state) => ({ isSearchOpen: !state.isSearchOpen }));
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  // Modal actions
  openModal: (modalKey: string) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalKey]: true,
      },
    }));
  },

  closeModal: (modalKey: string) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalKey]: false,
      },
    }));
  },

  closeAllModals: () => {
    set({ modals: {} });
  },
}));

// Helper hooks
export const useUI = () => {
  const store = useUIStore();
  return {
    isDarkMode: store.isDarkMode,
    isMobileMenuOpen: store.isMobileMenuOpen,
    isSearchOpen: store.isSearchOpen,
    searchQuery: store.searchQuery,
    toggleDarkMode: store.toggleDarkMode,
    toggleMobileMenu: store.toggleMobileMenu,
    closeMobileMenu: store.closeMobileMenu,
    toggleSearch: store.toggleSearch,
    setSearchQuery: store.setSearchQuery,
  };
};

export const useLoading = () => {
  const store = useUIStore();
  return {
    loadingStates: store.loadingStates,
    setLoading: store.setLoading,
    clearAllLoading: store.clearAllLoading,
    isLoading: (key: string) => store.loadingStates[key] || false,
  };
};

export const useModal = () => {
  const store = useUIStore();
  return {
    modals: store.modals,
    openModal: store.openModal,
    closeModal: store.closeModal,
    closeAllModals: store.closeAllModals,
    isModalOpen: (key: string) => store.modals[key] || false,
  };
};
