import { FC } from 'react'
import { useSync } from '@/hooks/useSync'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Button'

export const SyncButton: FC = () => {
  const { pendingCount, isSyncing, isOnline, manualSync } = useSync()

  if (pendingCount === 0 && !isSyncing) return null

  return (
    <Button
      onClick={manualSync}
      disabled={!isOnline || isSyncing}
      size="sm"
      variant="secondary"
      loading={isSyncing}
      className="shrink-0"
    >
      {isSyncing ? (
        <Spinner className="w-4 h-4 mr-1" />
      ) : (
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      )}
      {isSyncing ? 'Sincronizando...' : `Sincronizar (${pendingCount})`}
    </Button>
  )
}