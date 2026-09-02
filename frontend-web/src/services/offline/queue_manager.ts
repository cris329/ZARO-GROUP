import { offlineDB } from './indexeddb'
import { SyncItem } from '@/types'

interface QueueEntry extends SyncItem {
  id: string
  queued_at: string
  attempts: number
}

const QUEUE_META_KEY = 'sync_queue'

const nowISO = (): string => new Date().toISOString()

export const queueManager = {
  async getQueue(): Promise<QueueEntry[]> {
    const queue = await offlineDB.getMeta<QueueEntry[]>(QUEUE_META_KEY)
    return queue ?? []
  },

  async enqueue(item: Omit<QueueEntry, 'id' | 'queued_at' | 'attempts'>): Promise<void> {
    const queue = await this.getQueue()

    // Deduplicación: si ya existe la misma operación para la misma entidad, se actualiza
    const existingIdx = queue.findIndex(
      (e) => e.entity_id === item.entity_id && e.entity_type === item.entity_type,
    )

    const entry: QueueEntry = {
      ...item,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      queued_at: nowISO(),
      attempts: 0,
    }

    if (existingIdx >= 0) {
      queue[existingIdx] = entry
    } else {
      queue.push(entry)
    }

    await offlineDB.setMeta(QUEUE_META_KEY, queue)
  },

  async remove(id: string): Promise<void> {
    const queue = await this.getQueue()
    await offlineDB.setMeta(
      QUEUE_META_KEY,
      queue.filter((e) => e.id !== id),
    )
  },

  async markAttempt(id: string): Promise<void> {
    const queue = await this.getQueue()
    const entry = queue.find((e) => e.id === id)
    if (entry) {
      entry.attempts += 1
      await offlineDB.setMeta(QUEUE_META_KEY, queue)
    }
  },

  async count(): Promise<number> {
    return (await this.getQueue()).length
  },
}

export type { QueueEntry }