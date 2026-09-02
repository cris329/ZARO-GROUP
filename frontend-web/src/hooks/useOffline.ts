import { useEffect, useRef, useState } from 'react'

export interface UseOfflineOptions {
  onOnline?: () => void
  onOffline?: () => void
}

export const useOffline = (options: UseOfflineOptions = {}) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)
  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      optionsRef.current.onOnline?.()
    }
    const handleOffline = () => {
      setIsOnline(false)
      optionsRef.current.onOffline?.()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline }
}