import { secureStorage, post, get } from '../api/client'
import { syncQueueQueries, productQueries, orderQueries, getDB } from '../database'
import { SyncItem, SyncResult, ApiResponse } from '@/types'
import { withRetry, sleep } from '@/utils'

type Listener = (online: boolean) => void

const listeners = new Set<Listener>()
let isOnline = true

export function setOnline(online: boolean) {
  isOnline = online
  listeners.forEach((l) => l(online))
}

export function getOnline(): boolean {
  return isOnline
}

export function subscribeOnline(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export async function initConnectivity(): Promise<void> {
  try {
    const netinfo = (await import('@react-native-community/netinfo')).default
    netinfo.addEventListener((state) => {
      setOnline(Boolean(state.isConnected && state.isInternetReachable))
    })
  } catch {
    setOnline(true)
  }
}

export async function pushQueue(): Promise<SyncResult> {
  const queue = await syncQueueQueries.getAll()
  if (queue.length === 0) {
    return { logs_synced: 0, conflicts: [], synced_items: [] }
  }

  const items: SyncItem[] = queue.map((q) => ({
    entity_type: q.entity_type as SyncItem['entity_type'],
    operation_type: q.operation_type as SyncItem['operation_type'],
    entity_id: q.entity_id,
    data: JSON.parse(q.data),
    client_version: 1,
    timestamp: new Date().toISOString(),
  }))

  const result = await withRetry(async () => {
    const res = await post<ApiResponse<SyncResult>>('/sync/push', { logs: items })
    return res.data
  })

  for (const syncedItem of result.synced_items) {
    if (syncedItem.status === 'synced') {
      const queued = queue.find((q) => q.entity_id === syncedItem.entity_id)
      if (queued) {
        await syncQueueQueries.remove(queued.id)
      }
    }
  }

  await productQueries.markAllSynced()
  return result
}

export async function pullState(): Promise<void> {
  if (!getOnline()) return

  const token = await secureStorage.getToken()
  if (!token) return

  try {
    const db = await getDB()
    await db.execAsync('BEGIN TRANSACTION')
    try {
      const productsRes = await get<ApiResponse<{ products: unknown[] }>>('/products', {
        limit: 500,
      })
      const ordersRes = await get<ApiResponse<{ orders: unknown[] }>>('/orders', {
        limit: 500,
      })

      const products = productsRes.data.products as Parameters<typeof productQueries.create>[0][]
      const orders = ordersRes.data.orders as Parameters<typeof orderQueries.create>[0][]

      for (const p of products ?? []) {
        const existing = await productQueries.getById(p.id)
        if (!existing) {
          await productQueries.create({ ...p, synced: true })
        }
      }
      for (const o of orders ?? []) {
        const existing = await orderQueries.getById(o.id)
        if (!existing) {
          await orderQueries.create({ ...o, synced: true })
        }
      }
      await db.execAsync('COMMIT')
    } catch (e) {
      await db.execAsync('ROLLBACK')
      throw e
    }
  } catch {
    await sleep(2000)
    throw new Error('No se pudo descargar datos del servidor')
  }
}

export const syncManagerMobile = {
  async syncNow(): Promise<SyncResult> {
    if (!getOnline()) {
      return { logs_synced: 0, conflicts: [], synced_items: [] }
    }
    await pushQueue()
    await pullState()
    return { logs_synced: 0, conflicts: [], synced_items: [] }
  },
}