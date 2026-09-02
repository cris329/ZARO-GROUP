export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'farmer' | 'manager'
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  quantity: number
  price: number
  user_id: string
  synced: boolean
  version: number
  created_at: string
  updated_at: string
}

export interface ProductList {
  products: Product[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface OrderItem {
  product_id: string
  name: string
  quantity: number
  price: number
  subtotal: number
}

export interface Order {
  id: string
  user_id: string
  products: OrderItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  synced: boolean
  client_name: string
  client_phone: string
  notes: string
  created_at: string
  updated_at: string
}

export interface SyncItem {
  entity_type: 'product' | 'order'
  operation_type: 'create' | 'update' | 'delete'
  entity_id: string
  data: unknown
  client_version: number
  timestamp: string
}

export interface SyncItemResult {
  entity_id: string
  entity_type: string
  status: 'synced' | 'failed' | 'conflict'
}

export interface SyncConflict {
  entity_id: string
  entity_type: string
  resolution: string
}

export interface SyncResult {
  logs_synced: number
  conflicts: SyncConflict[]
  synced_items: SyncItemResult[]
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
  message?: string
}