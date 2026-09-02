import { create } from 'zustand'
import { Order } from '@/types'
import { ordersService } from '@/services/api/orders'

interface OrderState {
  orders: Order[]
  total: number
  isLoading: boolean
  error: string | null
  fetchOrders: (page?: number, limit?: number) => Promise<void>
  fetchOrder: (id: string) => Promise<Order>
  createOrder: (data: Partial<Order>) => Promise<Order>
  updateOrder: (id: string, data: Partial<Order>) => Promise<Order>
  deleteOrder: (id: string) => Promise<void>
  reset: () => void
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  total: 0,
  isLoading: false,
  error: null,

  fetchOrders: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null })
    try {
      const data = await ordersService.list(page, limit)
      set({ orders: data.orders, total: data.total, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  fetchOrder: async (id) => {
    return ordersService.get(id)
  },

  createOrder: async (data) => {
    const order = await ordersService.create(data)
    await get().fetchOrders()
    return order
  },

  updateOrder: async (id, data) => {
    const order = await ordersService.update(id, data)
    await get().fetchOrders()
    return order
  },

  deleteOrder: async (id) => {
    await ordersService.remove(id)
    await get().fetchOrders()
  },

  reset: () => set({ orders: [], total: 0 }),
}))