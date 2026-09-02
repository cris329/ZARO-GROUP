import { FC } from 'react'
import { useSync } from '@/hooks/useSync'

export const OfflineBanner: FC = () => {
  const { isOnline, pendingCount } = useSync()

  if (isOnline && pendingCount === 0) return null

  return (
    <div
      className={`w-full px-4 py-2 text-center text-sm font-medium ${
        isOnline
          ? 'bg-amber-50 text-amber-800 border-b border-amber-100'
          : 'bg-red-50 text-red-800 border-b border-red-100'
      }`}
      role="status"
    >
      {isOnline
        ? `${pendingCount} cambio(s) pendiente(s) de sincronizar`
        : 'Sin conexión - trabajando en modo offline'}
    </div>
  )
}