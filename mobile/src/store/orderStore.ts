import { create } from 'zustand'
import { Order } from '@/types'
import { orderQueries, syncQueueQueries } from '@/services/database'
import { getOnline } from '@/services/sync/sync_manager'
import { get } from '@/services/api/client'
import { ApiResponse } from '@/types'

interface OrderState {
  orders: Order[]
  isLoading: boolean
  error: string | null
  loadLocal: () => Promise<void>
  fetchFromServer: () => Promise<void>
  createOrder: (data: Partial<Order>) => Promise<Order>
  updateOrder: (id: string, data: Partial<Order>) => Promise<Order>
  deleteOrder: (id: string) => Promise<void>
  reset: () => void
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  loadLocal: async () => {
    const orders = await orderQueries.getAll()
    set({ orders })
  },

  fetchFromServer: async () => {
    try {
      const res = await get<ApiResponse<{ orders: Order[] }>>('/orders', { limit: 500 })
      set({ orders: res.data.orders })
    } catch {
      await get().loadLocal()
    }
  },

  createOrder: async (data) => {
    // Orden offline-first: guardar local y encolar
    const order: Partial<Order> & { id: string } = {
      ...data,
      id: `ord_${Date.now().toString(36)}`,
      status: 'pending',
      synced: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      products: (data.products ?? []).map((p) => ({
        ...(p as Order['products'][number]),
        subtotal: p.quantity * p.price,
      })),
      total: (data.products ?? []).reduce((s, p) => s + p.quantity * p.price, 0),
    }

    await orderQueries.create(order as Order)

    if (getOnline()) {
      try {
        const res = await get<ApiResponse<Order>>(`/orders/${order.id}`)
        void res
      } catch {
        await syncQueueQueries.add({
          entity_type: 'order',
          operation_type: 'create',
          entity_id: order.id,
          data: order,
        })
      }
    }

    await get().loadLocal()
    return order as Order
  },

  updateOrder: async (id, data) => {
    const existing = await orderQueries.getById(id)
    if (!existing) throw new Error('Orden no encontrada')
    const updated = { ...existing, ...data, updated_at: new Date().toISOString() }
    await orderQueries.update(updated)

    if (!getOnline()) {
      await syncQueueQueries.add({
        entity_type: 'order',
        operation_type: 'update',
        entity_id: id,
        data: updated,
      })
    }

    await get().loadLocal()
    return updated
  },

  deleteOrder: async (id) => {
    await orderQueries.remove(id)
    await get().loadLocal()
  },

  reset: () => set({ orders: [], error: null }),
}))