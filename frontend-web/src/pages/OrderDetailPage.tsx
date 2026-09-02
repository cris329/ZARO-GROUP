import { FC, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useOrders } from '@/hooks/useOrders'
import { OrderDetails } from '@/components/orders/OrderDetails'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { ROUTES } from '@/utils/constants'
import { Order } from '@/types'

export const OrderDetail: FC = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { fetchOrder, deleteOrder, updateOrder } = useOrders()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchOrder(id)
      .then(setOrder)
      .catch(() => navigate(ROUTES.orders))
      .finally(() => setLoading(false))
  }, [id, fetchOrder, navigate])

  const handleDelete = async () => {
    await deleteOrder(id)
    navigate(ROUTES.orders)
  }

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/3" /><div className="h-40 bg-gray-100 rounded-xl" /></div>
  }

  if (!order) return null

  const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(ROUTES.orders)}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            ← Volver a pedidos
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Pedido {order.id.slice(-8)}</h1>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={order.status}
            onChange={(e) => {
              void updateOrder(id, { ...order, status: e.target.value })
            }}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Estado del pedido"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            Eliminar
          </Button>
        </div>
      </div>

      <OrderDetails order={order} />

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Eliminar pedido">
        <p className="text-gray-600 text-sm">
          ¿Está seguro de que desea eliminar este pedido? Esta acción no se puede deshacer.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  )
}