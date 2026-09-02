import { get, post } from './client'
import { ApiResponse, SyncItem, SyncResult, SyncConflict } from '@/types'

export const syncService = {
  async push(logs: SyncItem[]): Promise<SyncResult> {
    const res = await post<ApiResponse<SyncResult>>('/sync/push', {
      logs,
      device_id: getDeviceId(),
      last_sync: new Date().toISOString(),
    })
    return res.data
  },

  async status(): Promise<{ last_sync: string; pending_count: number }> {
    const res = await get<ApiResponse<{ last_sync: string; pending_count: number }>>('/sync/status')
    return res.data
  },
}

export type { SyncConflict }

const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('device_id')
  if (!deviceId) {
    deviceId = `web_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem('device_id', deviceId)
  }
  return deviceId
}