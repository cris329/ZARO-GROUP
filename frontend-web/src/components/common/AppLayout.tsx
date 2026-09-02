import { FC, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '@/store/uiStore'
import { useAuth } from '@/hooks/useAuth'
import { OfflineBanner } from '@/components/sync/OfflineBanner'
import { SyncButton } from '@/components/sync/SyncButton'

interface LayoutProps {
  children: ReactNode
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/products', label: 'Productos', icon: '🌾' },
  { path: '/orders', label: 'Pedidos', icon: '📋' },
  { path: '/reports', label: 'Reportes', icon: '📊' },
  { path: '/profile', label: 'Perfil', icon: '👤' },
  { path: '/settings', label: 'Configuración', icon: '⚙️' },
]

export const AppLayout: FC<LayoutProps> = ({ children }) => {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-white border-r border-gray-100 flex-col transition-all duration-200 overflow-hidden hidden md:flex`}
      >
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold">
            O
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-none">OMEBLAS</p>
            <p className="text-xs text-gray-400 mt-1">Agro gestión</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <SyncButton />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Menú"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <OfflineBanner />
          </div>
          <div className="flex items-center gap-3">
            <SyncButton />
            {isAuthenticated && (
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Salir
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}