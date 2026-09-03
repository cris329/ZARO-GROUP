/**
 * Login - Página de inicio de sesión premium para ZARO GROUP.
 * Diseño responsivo con modo claro/oscuro, curvas decorativas doradas.
 * @author = Cristian Deysdayr Jiménez
 */
import { FC, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import { LoginForm } from '@/components/auth/LoginForm'
import { BackgroundCurves } from '@/components/auth/BackgroundCurves'
import { ThemeToggle } from '@/components/auth/ThemeToggle'

export const Login: FC = () => {
  const { isAuthenticated } = useAuth()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/'
    }
  }, [isAuthenticated])

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 transition-colors duration-700 relative overflow-hidden ${
        isLight
          ? 'bg-gradient-to-br from-[#faf9f7] via-[#f5f3ef] to-[#ede9e2]'
          : 'bg-[#0a0a0a]'
      }`}
      role="main"
      aria-label="Página de inicio de sesión"
    >
      <BackgroundCurves />
      <ThemeToggle />

      {/* ── Tarjeta de login ── */}
      <section
        className={`w-full max-w-sm sm:max-w-md relative z-10 transition-all duration-500 mx-auto ${
          isLight
            ? 'bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_8px_48px_rgba(0,0,0,0.07)]'
            : 'bg-[#141414]/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_48px_rgba(0,0,0,0.6)] border border-[#2a2a2a]'
        }`}
      >
        <div className="p-6 sm:p-8 md:p-10">
          {/* Logo ZG con borde dorado */}
          <header className="text-center mb-4 sm:mb-5">
            <div
              className={`w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center transition-all duration-500 ${
                isLight
                  ? 'border-2 border-[#c9a84c] bg-white shadow-[0_2px_16px_rgba(184,146,46,0.12)]'
                  : 'border-2 border-[#c9a84c]/60 bg-transparent shadow-[0_2px_20px_rgba(184,146,46,0.15)]'
              }`}
            >
              <span className={`font-serif text-[28px] sm:text-[32px] font-semibold tracking-tight ${
                isLight ? 'text-[#b8922e]' : 'text-[#d4a843]'
              }`}>
                ZG
              </span>
            </div>
            <h1 className={`font-serif text-xl sm:text-[26px] font-medium tracking-[0.03em] ${
              isLight ? 'text-[#b8922e]' : 'text-[#d4a843]'
            }`}>
              ZARO GROUP
            </h1>
          </header>

          {/* Ornamento decorativo */}
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-5" aria-hidden="true">
            <div className={`h-[1px] w-8 sm:w-10 ${isLight ? 'bg-[#c9a84c]/40' : 'bg-[#c9a84c]/30'}`} />
            <svg className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isLight ? 'text-[#c9a84c]' : 'text-[#c9a84c]/70'}`} viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" />
            </svg>
            <div className={`h-[1px] w-8 sm:w-10 ${isLight ? 'bg-[#c9a84c]/40' : 'bg-[#c9a84c]/30'}`} />
          </div>

          {/* Título */}
          <div className="text-center mb-5 sm:mb-6">
            <h2 className={`text-base sm:text-lg font-semibold mb-1 ${isLight ? 'text-[#1a1a1a]' : 'text-[#f0ece4]'}`}>
              Iniciar sesión
            </h2>
            <p className={`text-xs sm:text-[13px] ${isLight ? 'text-[#8a8a8a]' : 'text-[#6a6a6a]'}`}>
              Ingresa tus credenciales para acceder
            </p>
          </div>

          {/* Formulario */}
          <LoginForm />

          {/* Línea decorativa inferior */}
          <div className="mt-6 sm:mt-8 flex items-center justify-center" aria-hidden="true">
            <div className={`h-[1px] w-12 sm:w-14 ${isLight ? 'bg-[#c9a84c]/30' : 'bg-[#c9a84c]/20'}`} />
            <div className={`w-1.5 h-1.5 rounded-full mx-3 ${isLight ? 'bg-[#c9a84c]/50' : 'bg-[#c9a84c]/40'}`} />
            <div className={`h-[1px] w-12 sm:w-14 ${isLight ? 'bg-[#c9a84c]/30' : 'bg-[#c9a84c]/20'}`} />
          </div>
        </div>
      </section>
    </div>
  )
}
