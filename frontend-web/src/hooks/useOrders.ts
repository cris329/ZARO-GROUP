import { useOrderStore } from '@/store/orderStore'

export const useOrders = () => {
  const { orders, total, isLoading, error, fetchOrders, fetchOrder, createOrder, updateOrder, deleteOrder, reset } =
    useOrderStore()

  return {
    orders,
    total,
    isLoading,
    error,
    fetchOrders,
    fetchOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    reset,
  }
}