import { FC } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useProducts } from '@/hooks/useProducts'
import { useOrders } from '@/hooks/useOrders'
import { useSync } from '@/hooks/useSync'
import { formatCOP } from '@/utils/formatters'
import { Card } from '@/components/common/Card'
import { SyncStatus } from '@/components/sync/SyncStatus'
import { useEffect } from 'react'

export const Dashboard: FC = () => {
  const { user } = useAuth()
  const { products, fetchProducts, isLoading: productsLoading } = useProducts()
  const { orders, fetchOrders, isLoading: ordersLoading } = useOrders()
  const { isOnline } = useSync()

  useEffect(() => {
    void fetchProducts({ page: 1, limit: 5 })
    void fetchOrders(1, 5)
  }, [fetchProducts, fetchOrders])

  const totalInventory = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0,
  )
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0)
  const lowStock = products.filter((p) => p.quantity <= 10).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hola, {user?.name?.split(' ')[0] ?? 'usuario'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Panel de gestión</p>
        </div>
        <SyncStatus />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Inventario total"
          value={formatCOP(totalInventory)}
          icon="🌾"
          loading={productsLoading}
        />
        <StatCard
          label="Ventas"
          value={formatCOP(totalSales)}
          icon="💰"
          loading={ordersLoading}
        />
        <StatCard label="Productos" value={String(products.length)} icon="📦" loading={productsLoading} />
        <StatCard label="Bajo stock" value={String(lowStock)} icon="⚠️" loading={productsLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Productos recientes">
          {productsLoading ? (
            <p className="text-sm text-gray-500">Cargando...</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {products.map((p) => (
                <li key={p.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.quantity} unidades</p>
                  </div>
                  <p className="font-medium text-green-700">{formatCOP(p.price)}</p>
                </li>
              ))}
              {products.length === 0 && (
                <li className="py-6 text-center text-sm text-gray-500">
                  No hay productos registrados
                </li>
              )}
            </ul>
          )}
        </Card>

        <Card title="Pedidos recientes">
          {ordersLoading ? (
            <p className="text-sm text-gray-500">Cargando...</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {orders.map((o) => (
                <li key={o.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{o.client_name || 'Sin cliente'}</p>
                    <p className="text-xs text-gray-500 capitalize">{o.status}</p>
                  </div>
                  <p className="font-medium text-green-700">{formatCOP(o.total)}</p>
                </li>
              ))}
              {orders.length === 0 && (
                <li className="py-6 text-center text-sm text-gray-500">
                  No hay pedidos registrados
                </li>
              )}
            </ul>
          )}
        </Card>
      </div>

      {!isOnline && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          <strong>Modo offline:</strong> sus cambios se guardarán localmente y se sincronizarán
          automáticamente cuando haya conexión.
        </div>
      )}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  icon: string
  loading?: boolean
}

const StatCard: FC<StatCardProps> = ({ label, value, icon, loading = false }) => (
  <Card className="p-5">
    <div className="flex items-center gap-3">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        {loading ? (
          <div className="h-5 w-20 bg-gray-100 rounded animate-pulse mt-1" />
        ) : (
          <p className="text-xl font-bold text-gray-900">{value}</p>
        )}
      </div>
    </div>
  </Card>
)