import { get, post } from './client'
import { AuthResponse, ApiResponse } from '@/types'

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await post<ApiResponse<AuthResponse>>('/auth/login', { email, password })
    return res.data
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await post<ApiResponse<AuthResponse>>('/auth/register', {
      name,
      email,
      password,
    })
    return res.data
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const res = await post<ApiResponse<AuthResponse>>('/auth/refresh', {
      refresh_token: refreshToken,
    })
    return res.data
  },

  async logout(): Promise<void> {
    await post('/auth/logout')
  },

  async me(): Promise<{ user_id: string }> {
    const res = await get<ApiResponse<{ user_id: string }>>('/auth/me')
    return res.data
  },
}