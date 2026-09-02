import { FC } from 'react'
import { useUIStore } from '@/store/uiStore'

export const Toast: FC = () => {
  const { toast, clearToast } = useUIStore()

  if (!toast) return null

  const typeClasses = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-gray-800',
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] animate-slide-in">
      <div className={`${typeClasses[toast.type]} text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
        <span className="text-sm">{toast.message}</span>
        <button onClick={clearToast} className="text-white/70 hover:text-white" aria-label="Cerrar">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}