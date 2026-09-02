import { useProductStore } from '@/store/productStore'

export const useProducts = () => {
  const {
    products,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    error,
    filters,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    setFilter,
    reset,
  } = useProductStore()

  return {
    products,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    error,
    filters,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    setFilter,
    reset,
  }
}