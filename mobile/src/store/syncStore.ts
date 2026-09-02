import { create } from 'zustand'
import { syncManagerMobile } from '@/services/sync/sync_manager'
import { getOnline, subscribeOnline } from '@/services/sync/sync_manager'

interface SyncState {
  pendingCount: number
  isSyncing: boolean
  lastSync: string | null
  isOnline: boolean
  conflicts: number
  syncNow: () => Promise<void>
  setPendingCount: (count: number) => void
  subscribe: () => void
  reset: () => void
}

export const useSyncStore = create<SyncState>((set, get) => ({
  pendingCount: 0,
  isSyncing: false,
  lastSync: null,
  isOnline: getOnline(),
  conflicts: 0,

  syncNow: async () => {
    if (get().isSyncing) return
    set({ isSyncing: true })
    try {
      const result = await syncManagerMobile.syncNow()
      set({
        lastSync: new Date().toISOString(),
        conflicts: result.conflicts.length,
        isSyncing: false,
      })
    } catch {
      set({ isSyncing: false })
    }
  },

  setPendingCount: (count) => set({ pendingCount: count }),

  subscribe: () => {
    subscribeOnline((online) => set({ isOnline: online }))
  },

  reset: () =>
    set({ pendingCount: 0, isSyncing: false, lastSync: null, conflicts: 0, isOnline: true }),
}))