import { create } from 'zustand'

export type ThemeMode = 'light' | 'dark'

interface UIState {
  theme: ThemeMode
  sidebarOpen: boolean
  toast: { id: number; message: string; type: 'success' | 'error' | 'info' } | null
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
  toggleSidebar: () => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: 'light',
  sidebarOpen: true,
  toast: null,

  toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
  setTheme: (theme) => set({ theme }),

  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),

  showToast: (message, type = 'info') => {
    set({ toast: { id: Date.now(), message, type } })
    setTimeout(() => get().clearToast(), 4000)
  },

  clearToast: () => set({ toast: null }),
}))