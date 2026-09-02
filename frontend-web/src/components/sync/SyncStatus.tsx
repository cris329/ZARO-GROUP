import { FC } from 'react'
import { useSync } from '@/hooks/useSync'
import { formatDateTime } from '@/utils/formatters'

export const SyncStatus: FC = () => {
  const { pendingCount, lastSync, conflicts, isOnline, isSyncing } = useSync()

  return (
    <div className="flex items-center gap-4 text-xs text-gray-500">
      <div className="flex items-center gap-1.5">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span>{isOnline ? 'En línea' : 'Offline'}</span>
      </div>

      {isSyncing && <span>Sincronizando...</span>}

      {pendingCount > 0 && (
        <span className="text-amber-600">{pendingCount} pendientes</span>
      )}

      {conflicts > 0 && (
        <span className="text-red-600">{conflicts} conflicto(s)</span>
      )}

      {lastSync && <span>Última: {formatDateTime(lastSync)}</span>}
    </div>
  )
}