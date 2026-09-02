import { useEffect, useRef, useState } from 'react'

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(true)
  const isOnlineRef = useRef(true)

  useEffect(() => {
    // En React Native se usa NetInfo; el syncStore lo gestiona.
    // Este hook provee la misma API para consistencia con web.
    return () => undefined
  }, [])

  return {
    isOnline,
    isOnlineRef,
  }
}

export const useDebounce = <T>(value: T, delay = 300): T => {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}