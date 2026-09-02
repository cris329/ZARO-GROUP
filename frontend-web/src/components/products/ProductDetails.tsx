import { FC } from 'react'
import { Product } from '@/types'
import { formatCOP, formatQuantity, formatDateTime } from '@/utils/formatters'
import { Card } from '@/components/common/Card'

interface ProductDetailsProps {
  product: Product
}

export const ProductDetails: FC<ProductDetailsProps> = ({ product }) => {
  return (
    <div className="space-y-4">
      <Card title={product.name} subtitle={`ID: ${product.id}`}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">Cantidad disponible</p>
            <p className="text-xl font-semibold text-gray-900">
              {formatQuantity(product.quantity)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Precio</p>
            <p className="text-xl font-semibold text-green-700">{formatCOP(product.price)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Valor total</p>
            <p className="text-xl font-semibold text-gray-900">
              {formatCOP(product.price * product.quantity)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Estado de sincronización</p>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                product.synced ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {product.synced ? 'Sincronizado' : 'Pendiente'}
            </span>
          </div>
        </div>
      </Card>

      <Card title="Descripción">
        <p className="text-gray-600 whitespace-pre-wrap">
          {product.description || 'Sin descripción'}
        </p>
      </Card>

      <Card title="Información general">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-gray-500">Creado</dt>
            <dd className="text-gray-900">{formatDateTime(product.created_at)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Actualizado</dt>
            <dd className="text-gray-900">{formatDateTime(product.updated_at)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Versión</dt>
            <dd className="text-gray-900">v{product.version}</dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}