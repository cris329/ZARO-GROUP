import { FC } from 'react'
import { Order } from '@/types'
import { formatCOP, formatDateTime } from '@/utils/formatters'
import { Card } from '@/components/common/Card'

interface OrderDetailsProps {
  order: Order
}

const statusLabels: Record<Order['status'], string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

export const OrderDetails: FC<OrderDetailsProps> = ({ order }) => {
  return (
    <div className="space-y-4">
      <Card
        title={`Pedido ${order.client_name || 'Sin cliente'}`}
        subtitle={`ID: ${order.id}`}
        actions={
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              order.status === 'cancelled'
                ? 'bg-red-100 text-red-800'
                : order.status === 'delivered'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
            }`}
          >
            {statusLabels[order.status]}
          </span>
        }
      >
        <div className="space-y-4">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="py-1">Producto</th>
                <th className="py-1 text-center">Cantidad</th>
                <th className="py-1 text-right">Precio</th>
                <th className="py-1 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {order.products.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2 font-medium text-gray-900">{item.name}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-right">{formatCOP(item.price)}</td>
                  <td className="py-2 text-right font-medium">{formatCOP(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCOP(order.total)}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Datos del cliente">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-gray-500">Nombre</dt>
            <dd className="text-gray-900">{order.client_name || '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Teléfono</dt>
            <dd className="text-gray-900">{order.client_phone || '—'}</dd>
          </div>
        </dl>
        {order.notes && (
          <p className="mt-3 text-sm text-gray-600 whitespace-pre-wrap">
            <span className="font-medium">Notas: </span>
            {order.notes}
          </p>
        )}
      </Card>

      <Card title="Información general">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-gray-500">Creado</dt>
            <dd className="text-gray-900">{formatDateTime(order.created_at)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Actualizado</dt>
            <dd className="text-gray-900">{formatDateTime(order.updated_at)}</dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}