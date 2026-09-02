import { create } from 'zustand'
import { User } from '@/types'
import { post, secureStorage } from '@/services/api/client'
import { ApiResponse, AuthResponse } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  hydrate: async () => {
    const token = await secureStorage.getToken()
    if (token) {
      set({ token, isAuthenticated: true })
    }
  },

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const res = await post<ApiResponse<AuthResponse>>('/auth/login', { email, password })
      await secureStorage.setToken(res.data.access_token)
      await secureStorage.setRefreshToken(res.data.refresh_token)
      set({
        user: res.data.user,
        token: res.data.access_token,
        isAuthenticated: true,
        isLoading: false,
      })
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true })
    try {
      const res = await post<ApiResponse<AuthResponse>>('/auth/register', {
        name,
        email,
        password,
      })
      await secureStorage.setToken(res.data.access_token)
      await secureStorage.setRefreshToken(res.data.refresh_token)
      set({
        user: res.data.user,
        token: res.data.access_token,
        isAuthenticated: true,
        isLoading: false,
      })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    await secureStorage.clear()
    set({ user: null, token: null, isAuthenticated: false })
  },
}))