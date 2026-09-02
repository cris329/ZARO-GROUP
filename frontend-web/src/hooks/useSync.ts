import { useEffect, useState } from 'react'
import { useSyncStore } from '@/store/syncStore'
import { syncManager } from '@/services/offline/sync_manager'
import { useOffline } from './useOffline'

export const useSync = () => {
  const { pendingCount, isSyncing, lastSync, conflicts, isOnline, setIsSyncing, setLastSync } =
    useSyncStore()
  const { isOnline: networkOnline } = useOffline()

  useEffect(() => {
    useSyncStore.getState().setOnline(networkOnline)
  }, [networkOnline])

  useEffect(() => {
    syncManager.setCallbacks({
      onPendingChange: (count) => useSyncStore.getState().setPendingCount(count),
      onSyncComplete: () => setLastSync(new Date().toISOString()),
      onConflict: (count) => useSyncStore.getState().setConflicts(count),
      onError: () => undefined,
    })
    syncManager.start()
    void syncManager.syncNow()

    return () => syncManager.stop()
  }, [setLastSync])

  const manualSync = async () => {
    setIsSyncing(true)
    try {
      await syncManager.syncNow()
    } finally {
      setIsSyncing(false)
    }
  }

  return { pendingCount, isSyncing, lastSync, conflicts, isOnline, manualSync }
}