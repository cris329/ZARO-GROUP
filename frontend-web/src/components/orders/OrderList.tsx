import { FC } from 'react'
import { Order } from '@/types'
import { formatCOP, formatDate } from '@/utils/formatters'
import { Button } from '@/components/common/Button'

interface OrderListProps {
  orders: Order[]
  onView: (id: string) => void
  isLoading?: boolean
}

const statusStyles: Record<Order['status'], string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusLabels: Record<Order['status'], string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

export const OrderList: FC<OrderListProps> = ({ orders, onView, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">📋</p>
        <h3 className="text-lg font-semibold text-gray-900">No hay pedidos</h3>
        <p className="text-sm text-gray-500 mt-1">Cree su primer pedido</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-600">
          <tr>
            <th className="px-5 py-3">Cliente</th>
            <th className="px-5 py-3">Fecha</th>
            <th className="px-5 py-3">Estado</th>
            <th className="px-5 py-3 text-right">Total</th>
            <th className="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-5 py-3">
                <div className="font-medium text-gray-900">{o.client_name || 'Sin cliente'}</div>
                <div className="text-xs text-gray-500">{o.id}</div>
              </td>
              <td className="px-5 py-3">{formatDate(o.created_at)}</td>
              <td className="px-5 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[o.status]}`}
                >
                  {statusLabels[o.status]}
                </span>
              </td>
              <td className="px-5 py-3 text-right font-medium">{formatCOP(o.total)}</td>
              <td className="px-5 py-3 text-right">
                <Button size="sm" variant="ghost" onClick={() => onView(o.id)}>
                  Ver
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}