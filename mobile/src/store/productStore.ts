import { create } from 'zustand'
import { Product } from '@/types'
import { productQueries } from '@/services/database'
import { get, post, put, del } from '@/services/api/client'
import { ApiResponse } from '@/types'

interface ProductState {
  products: Product[]
  isLoading: boolean
  error: string | null
  loadLocal: () => Promise<void>
  fetchFromServer: () => Promise<void>
  createProduct: (data: Partial<Product>) => Promise<Product>
  updateProduct: (id: string, data: Partial<Product>) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>
  reset: () => void
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  loadLocal: async () => {
    const products = await productQueries.getAll()
    set({ products })
  },

  fetchFromServer: async () => {
    try {
      const res = await get<ApiResponse<{ products: Product[] }>>('/products', { limit: 500 })
      set({ products: res.data.products })
    } catch {
      await get().loadLocal()
    }
  },

  createProduct: async (data) => {
    const res = await post<ApiResponse<Product>>('/products', data)
    const product = res.data
    await productQueries.create({ ...product, synced: true })
    await get().loadLocal()
    return product
  },

  updateProduct: async (id, data) => {
    const res = await put<ApiResponse<Product>>(`/products/${id}`, data)
    const product = res.data
    await productQueries.update({ ...product, synced: true })
    await get().loadLocal()
    return product
  },

  deleteProduct: async (id) => {
    await del<ApiResponse<unknown>>(`/products/${id}`)
    await productQueries.remove(id)
    await get().loadLocal()
  },

  reset: () => set({ products: [], error: null }),
}))