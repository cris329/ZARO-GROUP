import { FC } from 'react'
import { Product } from '@/types'
import { formatCOP, formatQuantity } from '@/utils/formatters'
import { Button } from '@/components/common/Button'

interface ProductListProps {
  products: Product[]
  onView: (id: string) => void
  isLoading?: boolean
}

export const ProductList: FC<ProductListProps> = ({ products, onView, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
            <div className="h-3 bg-gray-100 rounded w-full mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">🌱</p>
        <h3 className="text-lg font-semibold text-gray-900">No hay productos</h3>
        <p className="text-sm text-gray-500 mt-1">Registre su primer producto</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-600">
          <tr>
            <th className="px-5 py-3">Producto</th>
            <th className="px-5 py-3">Cantidad</th>
            <th className="px-5 py-3">Precio</th>
            <th className="px-5 py-3 text-right">Valor total</th>
            <th className="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-5 py-3">
                <div className="font-medium text-gray-900">{p.name}</div>
                <div className="text-xs text-gray-500 line-clamp-1">{p.description}</div>
              </td>
              <td className="px-5 py-3">{formatQuantity(p.quantity)}</td>
              <td className="px-5 py-3">{formatCOP(p.price)}</td>
              <td className="px-5 py-3 text-right font-medium">
                {formatCOP(p.price * p.quantity)}
              </td>
              <td className="px-5 py-3 text-right">
                <Button size="sm" variant="ghost" onClick={() => onView(p.id)}>
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