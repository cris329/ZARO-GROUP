import axios, { AxiosError } from 'axios'
import { API_URL } from '@/utils/constants'
import { ApiError } from '@/utils/helpers'

export const httpClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as { _retry?: boolean } & typeof error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) throw error

        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })
        localStorage.setItem('access_token', data.data.access_token)
        localStorage.setItem('refresh_token', data.data.refresh_token)

        return httpClient(originalRequest)
      } catch {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    const status = error.response?.status ?? 0
    const serverMessage =
      (error.response?.data as Record<string, unknown>)?.message ??
      (error.message || 'Error de conexión')
    return Promise.reject(new ApiError(String(serverMessage), status))
  },
)

export const get = <T>(url: string, params?: Record<string, unknown>): Promise<T> =>
  httpClient.get(url, { params }).then((r) => r.data as T)

export const post = <T>(url: string, body?: unknown): Promise<T> =>
  httpClient.post(url, body).then((r) => r.data as T)

export const put = <T>(url: string, body?: unknown): Promise<T> =>
  httpClient.put(url, body).then((r) => r.data as T)

export const del = <T>(url: string): Promise<T> =>
  httpClient.delete(url).then((r) => r.data as T)