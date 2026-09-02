import { FC, ReactNode } from 'react'
import { AppLayout } from '@/components/common/AppLayout'
import { Toast } from '@/components/common/Toast'
import { useSync } from '@/hooks/useSync'
import { useEffect } from 'react'

interface AppProps {
  children: ReactNode
}

export const App: FC<AppProps> = ({ children }) => {
  useSync()

  useEffect(() => {
    const handleOffline = () => {
      document.title = '📡 sin conexión'
      setTimeout(() => (document.title = 'OMEBLAS'), 2000)
    }
    window.addEventListener('offline', handleOffline)
    return () => window.removeEventListener('offline', handleOffline)
  }, [])

  return (
    <>
      <AppLayout>{children}</AppLayout>
      <Toast />
    </>
  )
}