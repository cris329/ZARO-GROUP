import { FC, useEffect, useState } from 'react'
import { useOrders } from '@/hooks/useOrders'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { formatCOP, formatNumber, formatDate } from '@/utils/formatters'
import { get } from '@/services/api/client'
import { ApiResponse } from '@/types'
import { Spinner } from '@/components/common/Button'

interface ReportData {
  total_sales: number
  order_count: number
  status_count: Record<string, number>
}

export const Reports: FC = () => {
  const { orders, isLoading, fetchOrders } = useOrders()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [stats, setStats] = useState<ReportData | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)

  useEffect(() => {
    void fetchOrders(1, 100)
  }, [fetchOrders])

  const loadStats = async () => {
    setLoadingStats(true)
    try {
      const params: Record<string, string> = {}
      if (from) params.from = from
      if (to) params.to = to
      const res = await get<ApiResponse<ReportData>>('/reports/sales', params)
      setStats(res.data)
    } finally {
      setLoadingStats(false)
    }
  }

  const exportInventory = async () => {
    const url =
      import.meta.env.VITE_API_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '') + '/api/v1/reports/inventory/export'
    const token = localStorage.getItem('access_token')
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    const blob = await res.blob()
    const downloadUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = 'inventario.xlsx'
    a.click()
    URL.revokeObjectURL(downloadUrl)
  }

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
        <p className="text-gray-500 text-sm mt-1">Reportes de ventas e inventario</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Resumen de ventas">
          {isLoading ? (
            <Spinner />
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Ventas totales</p>
                <p className="text-2xl font-bold text-gray-900">{formatCOP(totalSales)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(orders.length)}</p>
              </div>
            </div>
          )}
        </Card>

        <Card title="Filtrar por fecha">
          <div className="space-y-3">
            <label className="block text-sm text-gray-600">
              Desde
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </label>
            <label className="block text-sm text-gray-600">
              Hasta
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </label>
            <Button onClick={loadStats} loading={loadingStats} fullWidth>
              Calcular
            </Button>
          </div>
          {stats && (
            <div className="mt-4 text-sm text-gray-600">
              <p>Ventas: <strong>{formatCOP(stats.total_sales)}</strong></p>
              <p>Pedidos: <strong>{formatNumber(stats.order_count)}</strong></p>
            </div>
          )}
        </Card>

        <Card title="Exportar">
          <div className="space-y-3">
            <Button variant="secondary" onClick={exportInventory} fullWidth>
              Exportar inventario (Excel)
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                const token = localStorage.getItem('access_token')
                const res = await fetch(
                  (import.meta.env.VITE_API_URL || '/api/v1') + '/reports/sales/export',
                  { headers: { Authorization: `Bearer ${token}` } },
                )
                const blob = await res.blob()
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'ventas.xlsx'
                a.click()
                URL.revokeObjectURL(url)
              }}
              fullWidth
            >
              Exportar ventas (Excel)
            </Button>
          </div>
        </Card>
      </div>

      <Card title="Pedidos recientes">
        <ul className="divide-y divide-gray-50">
          {orders.map((o) => (
            <li key={o.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{o.client_name || 'Sin cliente'}</p>
                <p className="text-xs text-gray-500">{formatDate(o.created_at)}</p>
              </div>
              <p className="font-medium text-green-700">{formatCOP(o.total)}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}