/**
 * Login - Página de inicio de sesión premium para ZARO GROUP.
 * Diseño elegante con modo claro/oscuro, curvas decorativas doradas.
 * @author = Cristian Deysdayr Jiménez
 */
import { FC, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import { LoginForm } from '@/components/auth/LoginForm'

export const Login: FC = () => {
  const { isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/'
    }
  }, [isAuthenticated])

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-700 relative overflow-hidden ${
        isLight
          ? 'bg-gradient-to-br from-[#faf9f7] via-[#f5f3ef] to-[#ede9e2]'
          : 'bg-[#0a0a0a]'
      }`}
      role="main"
      aria-label="Página de inicio de sesión"
    >
      {/* ── Curvas decorativas doradas – Light ── */}
      {isLight && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="lgLight1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4a843" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#b8922e" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="lgLight2" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#d4a843" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#b8922e" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          {/* Arco superior-izquierdo */}
          <path d="M-200 900 C-200 400 200 0 720 0" stroke="url(#lgLight1)" strokeWidth="1.5" />
          <path d="M-160 900 C-160 430 230 40 720 40" stroke="url(#lgLight1)" strokeWidth="1" />
          <path d="M-120 900 C-120 460 260 80 720 80" stroke="url(#lgLight1)" strokeWidth="0.7" />
          {/* Arco inferior-derecho */}
          <path d="M1640 0 C1640 500 1240 900 720 900" stroke="url(#lgLight2)" strokeWidth="1.5" />
          <path d="M1600 0 C1600 470 1210 860 720 860" stroke="url(#lgLight2)" strokeWidth="1" />
          <path d="M1560 0 C1560 440 1180 820 720 820" stroke="url(#lgLight2)" strokeWidth="0.7" />
        </svg>
      )}

      {/* ── Curvas decorativas doradas – Dark ── */}
      {!isLight && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="lgDark1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4a843" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#c9a84c" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#b8922e" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="lgDark2" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#d4a843" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#b8922e" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          {/* Arco superior-derecho */}
          <path d="M1640 0 C1640 400 1100 900 500 900" stroke="url(#lgDark1)" strokeWidth="1.2" />
          <path d="M1600 40 C1560 420 1060 860 520 870" stroke="url(#lgDark1)" strokeWidth="0.9" />
          <path d="M1560 80 C1500 430 1020 820 540 840" stroke="url(#lgDark1)" strokeWidth="0.6" />
          {/* Arco inferior-izquierdo */}
          <path d="M-200 0 C-200 500 300 900 900 900" stroke="url(#lgDark2)" strokeWidth="1.2" />
          <path d="M-160 40 C-120 460 340 860 880 870" stroke="url(#lgDark2)" strokeWidth="0.9" />
          <path d="M-120 80 C-60 470 380 820 860 840" stroke="url(#lgDark2)" strokeWidth="0.6" />
        </svg>
      )}

      {/* ── Toggle de tema ── */}
      <button
        onClick={toggleTheme}
        className={`fixed top-5 right-5 z-50 w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 ${
          isLight
            ? 'bg-white/80 text-[#8a7a5a] hover:bg-white border border-[#e0dcd4] shadow-sm backdrop-blur-sm'
            : 'bg-[#1a1a1a]/80 text-[#d4a843] hover:bg-[#1a1a1a] border border-[#d4a843]/20 shadow-lg backdrop-blur-sm'
        }`}
        aria-label={isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
      >
        {isLight ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </button>

      {/* ── Tarjeta de login ── */}
      <section
        className={`w-full max-w-[420px] relative z-10 transition-all duration-500 ${
          isLight
            ? 'bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_8px_48px_rgba(0,0,0,0.07)]'
            : 'bg-[#141414]/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_48px_rgba(0,0,0,0.6)] border border-[#2a2a2a]'
        }`}
      >
        <div className="p-8 sm:p-10">
          {/* Logo ZG con borde dorado */}
          <header className="text-center mb-5">
            <div
              className={`w-[90px] h-[90px] mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-500 ${
                isLight
                  ? 'border-2 border-[#c9a84c] bg-white shadow-[0_2px_16px_rgba(184,146,46,0.12)]'
                  : 'border-2 border-[#c9a84c]/60 bg-transparent shadow-[0_2px_20px_rgba(184,146,46,0.15)]'
              }`}
            >
              <span
                className={`font-serif text-[34px] font-semibold tracking-tight ${
                  isLight ? 'text-[#b8922e]' : 'text-[#d4a843]'
                }`}
              >
                ZG
              </span>
            </div>
            <h1
              className={`font-serif text-[26px] font-medium tracking-[0.03em] ${
                isLight ? 'text-[#b8922e]' : 'text-[#d4a843]'
              }`}
            >
              ZARO GROUP
            </h1>
          </header>

          {/* Ornamento decorativo */}
          <div className="flex items-center justify-center gap-2 mb-5" aria-hidden="true">
            <div className={`h-[1px] w-10 ${isLight ? 'bg-[#c9a84c]/40' : 'bg-[#c9a84c]/30'}`} />
            <svg className={`w-3.5 h-3.5 ${isLight ? 'text-[#c9a84c]' : 'text-[#c9a84c]/70'}`} viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" />
            </svg>
            <div className={`h-[1px] w-10 ${isLight ? 'bg-[#c9a84c]/40' : 'bg-[#c9a84c]/30'}`} />
          </div>

          {/* Título */}
          <div className="text-center mb-6">
            <h2 className={`text-lg font-semibold mb-1 ${isLight ? 'text-[#1a1a1a]' : 'text-[#f0ece4]'}`}>
              Iniciar sesión
            </h2>
            <p className={`text-[13px] ${isLight ? 'text-[#8a8a8a]' : 'text-[#6a6a6a]'}`}>
              Ingresa tus credenciales para acceder
            </p>
          </div>

          {/* Formulario */}
          <LoginForm />

          {/* Línea decorativa inferior */}
          <div className="mt-8 flex items-center justify-center" aria-hidden="true">
            <div className={`h-[1px] w-14 ${isLight ? 'bg-[#c9a84c]/30' : 'bg-[#c9a84c]/20'}`} />
            <div className={`w-1.5 h-1.5 rounded-full mx-3 ${isLight ? 'bg-[#c9a84c]/50' : 'bg-[#c9a84c]/40'}`} />
            <div className={`h-[1px] w-14 ${isLight ? 'bg-[#c9a84c]/30' : 'bg-[#c9a84c]/20'}`} />
          </div>
        </div>
      </section>
    </div>
  )
}
