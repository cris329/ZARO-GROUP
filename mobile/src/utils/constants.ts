import { Platform } from 'react-native'

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  'http://10.0.2.2:8080/api/v1' // 10.0.2.2 = localhost desde el emulador Android

export const APP_NAME = 'OMEBLAS'

export const SYNC_INTERVAL_MS = 30000
export const RETRY_BACKOFF_MS = [1000, 2000, 4000, 8000, 16000]

export const isDev = __DEV__

export const PLATFORM = Platform.OS