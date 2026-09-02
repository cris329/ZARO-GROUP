import { FC, ReactNode, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login'
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}