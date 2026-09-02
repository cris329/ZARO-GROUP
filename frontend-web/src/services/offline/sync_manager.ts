import { syncService } from '../api/sync'
import { queueManager, QueueEntry } from './queue_manager'
import { offlineDB } from './indexeddb'
import { SyncResult } from '@/types'
import { withRetry } from '@/utils/helpers'

type SyncCallback = {
  onPendingChange?: (count: number) => void
  onSyncComplete?: (result: SyncResult) => void
  onConflict?: (count: number) => void
  onError?: (error: unknown) => void
}

class SyncManager {
  private syncing = false
  private callbacks: SyncCallback = {}
  private syncTimer: ReturnType<typeof setInterval> | null = null

  setCallbacks(callbacks: SyncCallback): void {
    this.callbacks = callbacks
  }

  start() {
    if (this.syncTimer) return
    this.syncTimer = setInterval(() => {
      void this.syncNow()
    }, 30000)
  }

  stop() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
      this.syncTimer = null
    }
  }

  async syncNow(): Promise<void> {
    if (this.syncing || !navigator.onLine) return
    this.syncing = true

    try {
      const queue = await queueManager.getQueue()
      if (queue.length === 0) {
        this.callbacks.onPendingChange?.(0)
        return
      }

      this.callbacks.onPendingChange?.(queue.length)

      const result = await this.pushWithRetry(queue)
      const syncedIds = new Set(
        result.synced_items
          .filter((i) => i.status === 'synced')
          .map((i) => i.entity_id),
      )

      for (const entry of queue) {
        if (syncedIds.has(entry.entity_id)) {
          await queueManager.remove(entry.id)
        } else if (result.conflicts.length > 0) {
          // Resolución de conflictos: el servidor ganó, usar datos del servidor
          await queueManager.remove(entry.id)
        }
      }

      const remaining = await queueManager.count()
      this.callbacks.onPendingChange?.(remaining)
      this.callbacks.onSyncComplete?.(result)

      if (result.conflicts.length > 0) {
        this.callbacks.onConflict?.(result.conflicts.length)
      }
    } catch (error) {
      this.callbacks.onError?.(error)
    } finally {
      this.syncing = false
    }
  }

  private async pushWithRetry(queue: QueueEntry[]): Promise<SyncResult> {
    return withRetry(
      () =>
        syncService.push(
          queue.map(({ entity_type, operation_type, entity_id, data, client_version, timestamp }) => ({
            entity_type,
            operation_type,
            entity_id,
            data,
            client_version,
            timestamp,
          })),
        ),
      [1000, 2000, 4000, 8000, 16000],
    )
  }

  async isOnline(): Promise<boolean> {
    return navigator.onLine
  }
}

export const syncManager = new SyncManager()