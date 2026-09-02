import { FC } from 'react'
import { Product } from '@/types'
import { formatCOP, formatQuantity } from '@/utils/formatters'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'

interface ProductCardProps {
  product: Product
  onView: (id: string) => void
  onEdit: (id: string) => void
}

export const ProductCard: FC<ProductCardProps> = ({ product, onView, onEdit }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
          {!product.synced && (
            <span className="inline-flex items-center px-2 py-0.5 mt-2 text-xs bg-amber-100 text-amber-800 rounded-full">
              Pendiente de sincronizar
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-500">Cantidad</p>
          <p className="font-medium text-gray-900">{formatQuantity(product.quantity)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Precio</p>
          <p className="font-medium text-green-700">{formatCOP(product.price)}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => onView(product.id)}>
          Ver
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onEdit(product.id)}>
          Editar
        </Button>
      </div>
    </Card>
  )
}