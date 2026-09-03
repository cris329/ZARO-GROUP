/**
 * ThemeToggle - Botón para alternar entre modo claro y oscuro.
 * Muestra únicamente la acción disponible: "Modo oscuro" o "Modo claro".
 * @author = Cristian Deysdayr Jiménez
 */
import { FC } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export const ThemeToggle: FC = () => {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <div
      className="fixed top-4 right-4 sm:top-5 sm:right-5 z-50"
      role="group"
      aria-label="Cambiar tema de apariencia"
    >
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 h-11 px-4 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
          isLight
            ? 'bg-white/90 text-[#6a6a6a] hover:bg-white border border-[#e0dcd4] shadow-sm backdrop-blur-sm'
            : 'bg-[#1a1a1a]/90 text-[#d4a843] hover:bg-[#1a1a1a] border border-[#d4a843]/20 shadow-lg backdrop-blur-sm'
        }`}
        aria-label={isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
        aria-pressed={isLight ? 'false' : 'true'}
      >
        {isLight ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span>Modo oscuro</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Modo claro</span>
          </>
        )}
      </button>
    </div>
  )
}
