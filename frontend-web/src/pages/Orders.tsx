import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrders } from '@/hooks/useOrders'
import { OrderList } from '@/components/orders/OrderList'
import { Pagination } from '@/components/common/Pagination'
import { Button } from '@/components/common/Button'
import { ROUTES } from '@/utils/constants'

export const Orders: FC = () => {
  const navigate = useNavigate()
  const { orders, total, isLoading, fetchOrders } = useOrders()
  const [page, setPage] = useState(1)
  const limit = 20

  useEffect(() => {
    void fetchOrders(page, limit)
  }, [fetchOrders, page])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-500 text-sm mt-1">{total} pedido(s) registrados</p>
        </div>
        <Button onClick={() => navigate(ROUTES.createOrder)}>Nuevo pedido</Button>
      </div>

      <OrderList
        orders={orders}
        isLoading={isLoading}
        onView={(id) => navigate(ROUTES.orderDetail(id))}
      />

      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(total / limit))}
        onChange={setPage}
      />
    </div>
  )
}