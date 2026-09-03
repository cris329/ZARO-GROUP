/**
 * ThemeToggle - Botón para alternar entre modo claro y oscuro.
 * Iconos de sol/luna con animación de deslizamiento y labels claros.
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
        className={`relative flex items-center gap-2 h-11 rounded-full transition-all duration-300 pl-3 pr-4 text-xs font-medium ${
          isLight
            ? 'bg-white/90 text-[#6a6a6a] hover:bg-white border border-[#e0dcd4] shadow-sm backdrop-blur-sm'
            : 'bg-[#1a1a1a]/90 text-[#d4a843] hover:bg-[#1a1a1a] border border-[#d4a843]/20 shadow-lg backdrop-blur-sm'
        }`}
        aria-label={isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
        aria-pressed={isLight ? 'false' : 'true'}
      >
        {/* Icono sol */}
        <svg
          className={`w-[18px] h-[18px] transition-all duration-300 ${
            isLight ? 'text-[#d4a843] scale-100' : 'text-[#666] scale-75 opacity-40'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>

        {/* Pista del toggle */}
        <span
          className={`relative w-8 h-[18px] rounded-full transition-colors duration-300 ${
            isLight ? 'bg-[#e8e4dc]' : 'bg-[#333]'
          }`}
          aria-hidden="true"
        >
          {/* Icono deslizante */}
          <span
            className={`absolute top-[2px] w-[14px] h-[14px] rounded-full transition-all duration-300 flex items-center justify-center ${
              isLight ? 'left-[2px] bg-[#d4a843]' : 'left-[14px] bg-[#c9a84c]'
            }`}
          >
            {isLight ? (
              <svg className="w-[8px] h-[8px] text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-[8px] h-[8px] text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </span>
        </span>

        {/* Icono luna */}
        <svg
          className={`w-[18px] h-[18px] transition-all duration-300 ${
            !isLight ? 'text-[#d4a843] scale-100' : 'text-[#999] scale-75 opacity-40'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>
    </div>
  )
}
