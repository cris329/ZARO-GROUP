import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrders } from '@/hooks/useOrders'
import { useProducts } from '@/hooks/useProducts'
import { OrderForm } from '@/components/orders/OrderForm'
import { Card } from '@/components/common/Card'
import { ROUTES } from '@/utils/constants'

export const CreateOrder: FC = () => {
  const navigate = useNavigate()
  const { createOrder, isLoading } = useOrders()
  const { products, fetchProducts } = useProducts()

  useEffect(() => {
    void fetchProducts({ page: 1, limit: 100 })
  }, [fetchProducts])

  const productOptions = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
  }))

  const handleSubmit = async (data: {
    products: { product_id: string; name: string; quantity: number; price: number }[]
    client_name: string
    client_phone: string
    notes: string
  }) => {
    try {
      const orderData = {
        ...data,
        products: data.products.map(p => ({
          ...p,
          subtotal: p.quantity * p.price
        }))
      }
      await createOrder(orderData)
      navigate(ROUTES.orders)
    } catch {
      // Toast global
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <button
          onClick={() => navigate(ROUTES.orders)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          ← Volver a pedidos
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo pedido</h1>
        <p className="text-gray-500 text-sm mt-1">Registre un nuevo pedido</p>
      </div>

      <Card>
        <OrderForm products={productOptions} onSubmit={handleSubmit} isLoading={isLoading} />
      </Card>
    </div>
  )
}