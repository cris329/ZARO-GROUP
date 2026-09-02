import { create } from 'zustand'

interface SyncState {
  pendingCount: number
  isSyncing: boolean
  lastSync: string | null
  conflicts: number
  isOnline: boolean
  setPendingCount: (count: number) => void
  setIsSyncing: (syncing: boolean) => void
  setLastSync: (time: string) => void
  setConflicts: (count: number) => void
  setOnline: (online: boolean) => void
  reset: () => void
}

export const useSyncStore = create<SyncState>((set) => ({
  pendingCount: 0,
  isSyncing: false,
  lastSync: null,
  conflicts: 0,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,

  setPendingCount: (count) => set({ pendingCount: count }),
  setIsSyncing: (syncing) => set({ isSyncing: syncing }),
  setLastSync: (time) => set({ lastSync: time }),
  setConflicts: (count) => set({ conflicts: count }),
  setOnline: (online) => set({ isOnline: online }),
  reset: () =>
    set({ pendingCount: 0, isSyncing: false, lastSync: null, conflicts: 0, isOnline: true }),
}))