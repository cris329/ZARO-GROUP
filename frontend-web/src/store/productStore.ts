import { create } from 'zustand'
import { Product, ProductList, PaginationParams } from '@/types'
import { productsService } from '@/services/api/products'

interface ProductState {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
  isLoading: boolean
  error: string | null
  filters: PaginationParams
  fetchProducts: (params?: PaginationParams) => Promise<void>
  fetchProduct: (id: string) => Promise<Product>
  createProduct: (data: Partial<Product>) => Promise<Product>
  updateProduct: (id: string, data: Partial<Product>) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>
  setFilter: (filter: Partial<PaginationParams>) => void
  reset: () => void
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  isLoading: false,
  error: null,
  filters: { page: 1, limit: 20 },

  fetchProducts: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const filters = { ...get().filters, ...(params ?? {}) }
      const data: ProductList = await productsService.list(filters)
      set({
        products: data.products,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.total_pages,
        filters,
        isLoading: false,
      })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  fetchProduct: async (id) => {
    return productsService.get(id)
  },

  createProduct: async (data) => {
    const product = await productsService.create(data)
    await get().fetchProducts()
    return product
  },

  updateProduct: async (id, data) => {
    const product = await productsService.update(id, data)
    await get().fetchProducts()
    return product
  },

  deleteProduct: async (id) => {
    await productsService.remove(id)
    await get().fetchProducts()
  },

  setFilter: (filter) => {
    set({ filters: { ...get().filters, ...filter } })
  },

  reset: () => {
    set({ products: [], total: 0, page: 1, totalPages: 0, filters: { page: 1, limit: 20 } })
  },
}))