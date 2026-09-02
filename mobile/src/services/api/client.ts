import axios, { AxiosError } from 'axios'
import * as SecureStore from 'expo-secure-store'
import { API_URL } from '@/utils/constants'

const TOKEN_KEY = 'access_token'
const REFRESH_KEY = 'refresh_token'

export const httpClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

httpClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshing = false

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && !refreshing) {
      refreshing = true
      try {
        const refreshToken = await SecureStore.getItemAsync(REFRESH_KEY)
        if (!refreshToken) throw error

        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })
        await SecureStore.setItemAsync(TOKEN_KEY, data.data.access_token)
        await SecureStore.setItemAsync(REFRESH_KEY, data.data.refresh_token)

        const originalConfig = error.config
        if (originalConfig) {
          originalConfig.headers.Authorization = `Bearer ${data.data.access_token}`
          return axios.request(originalConfig)
        }
      } catch {
        await SecureStore.deleteItemAsync(TOKEN_KEY)
        await SecureStore.deleteItemAsync(REFRESH_KEY)
      } finally {
        refreshing = false
      }
    }
    return Promise.reject(error)
  },
)

export const secureStorage = {
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY)
  },
  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token)
  },
  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_KEY)
  },
  async setRefreshToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(REFRESH_KEY, token)
  },
  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
    await SecureStore.deleteItemAsync(REFRESH_KEY)
  },
}

export const get = <T>(url: string, params?: Record<string, unknown>): Promise<T> =>
  httpClient.get(url, { params }).then((r) => r.data as T)

export const post = <T>(url: string, body?: unknown): Promise<T> =>
  httpClient.post(url, body).then((r) => r.data as T)

export const put = <T>(url: string, body?: unknown): Promise<T> =>
  httpClient.put(url, body).then((r) => r.data as T)

export const del = <T>(url: string): Promise<T> =>
  httpClient.delete(url).then((r) => r.data as T)