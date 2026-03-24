import { create } from "zustand";

interface UIState {
  sidebarCollapsed: boolean;
  cartDrawerOpen:   boolean;
  toggleSidebar:    () => void;
  openCartDrawer:   () => void;
  closeCartDrawer:  () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,
  cartDrawerOpen:   false,
  toggleSidebar:    () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  openCartDrawer:   () => set({ cartDrawerOpen: true }),
  closeCartDrawer:  () => set({ cartDrawerOpen: false }),
}));

/**
 * Hook used by AdminSidebar and SellerSidebar.
 * Named "SellerSidebarStore" for historic reasons in the codebase.
 */
export const useSellerSidebarStore = () => {
  const isCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle      = useUIStore((s) => s.toggleSidebar);
  return { isCollapsed, toggle };
};
