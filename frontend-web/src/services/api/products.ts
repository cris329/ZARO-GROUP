import { get, post, put, del } from './client'
import { ApiResponse, Product, ProductList, PaginationParams } from '@/types'

export const productsService = {
  async list(params: PaginationParams = {}): Promise<ProductList> {
    const res = await get<ApiResponse<ProductList>>('/products', params as Record<string, unknown>)
    return res.data
  },

  async get(id: string): Promise<Product> {
    const res = await get<ApiResponse<Product>>(`/products/${id}`)
    return res.data
  },

  async create(data: Omit<Product, 'id' | 'user_id' | 'synced' | 'version' | 'created_at' | 'updated_at'>): Promise<Product> {
    const res = await post<ApiResponse<Product>>('/products', data)
    return res.data
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const res = await put<ApiResponse<Product>>(`/products/${id}`, data)
    return res.data
  },

  async remove(id: string): Promise<void> {
    await del<ApiResponse<unknown>>(`/products/${id}`)
  },
}