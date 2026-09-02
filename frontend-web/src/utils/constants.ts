export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

export const ROUTES = {
  dashboard: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  products: '/products',
  productDetail: (id: string) => `/products/${id}`,
  createProduct: '/products/new',
  editProduct: (id: string) => `/products/${id}/edit`,
  orders: '/orders',
  orderDetail: (id: string) => `/orders/${id}`,
  createOrder: '/orders/new',
  reports: '/reports',
  profile: '/profile',
  settings: '/settings',
} as const

export const APP_NAME = 'ZARO GROUP'

export const SYNC_INTERVAL_MS = 30000
export const RETRY_BACKOFF_MS = [1000, 2000, 4000, 8000, 16000]