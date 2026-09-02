import { get, post, put, del } from './client'
import { ApiResponse, Order, OrderList } from '@/types'

export const ordersService = {
  async list(page = 1, limit = 20): Promise<OrderList> {
    const res = await get<ApiResponse<OrderList>>('/orders', { page, limit })
    return res.data
  },

  async get(id: string): Promise<Order> {
    const res = await get<ApiResponse<Order>>(`/orders/${id}`)
    return res.data
  },

  async create(data: Partial<Order>): Promise<Order> {
    const res = await post<ApiResponse<Order>>('/orders', data)
    return res.data
  },

  async update(id: string, data: Partial<Order>): Promise<Order> {
    const res = await put<ApiResponse<Order>>(`/orders/${id}`, data)
    return res.data
  },

  async remove(id: string): Promise<void> {
    await del<ApiResponse<unknown>>(`/orders/${id}`)
  },
}