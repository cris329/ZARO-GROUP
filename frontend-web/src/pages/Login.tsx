/**
 * Login - Página de inicio de sesión premium para ZARO GROUP.
 * Diseño elegante con modo claro/oscuro inspirado en el diseño de referencia.
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
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-700 relative overflow-hidden ${
      isLight
        ? 'bg-gradient-to-br from-[#f8f6f3] via-[#f5f2ed] to-[#ede8e0]'
        : 'bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0d0d0d]'
    }`}>
      {/* Decorative golden curves - Light mode */}
      {isLight && (
        <>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <svg className="absolute -top-20 -left-20 w-[500px] h-[500px] opacity-[0.15]" viewBox="0 0 500 500" fill="none">
              <path d="M-50 250C-50 100 100-50 250-50" stroke="url(#gold1)" strokeWidth="1.5" />
              <path d="M-30 280C-30 130 120-30 270-30" stroke="url(#gold1)" strokeWidth="1" />
              <defs>
                <linearGradient id="gold1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c9a84c" />
                  <stop offset="50%" stopColor="#d4a843" />
                  <stop offset="100%" stopColor="#b8922e" />
                </linearGradient>
              </defs>
            </svg>
            <svg className="absolute -bottom-20 -right-20 w-[500px] h-[500px] opacity-[0.12]" viewBox="0 0 500 500" fill="none">
              <path d="M550 250C550 400 400 550 250 550" stroke="url(#gold2)" strokeWidth="1.5" />
              <path d="M530 220C530 370 380 520 230 520" stroke="url(#gold2)" strokeWidth="1" />
              <defs>
                <linearGradient id="gold2" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#c9a84c" />
                  <stop offset="50%" stopColor="#d4a843" />
                  <stop offset="100%" stopColor="#b8922e" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </>
      )}

      {/* Decorative golden curves - Dark mode */}
      {!isLight && (
        <>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <svg className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.2]" viewBox="0 0 600 600" fill="none">
              <path d="M600 0C600 150 450 300 300 300C150 300 0 150 0 0" stroke="url(#goldDark1)" strokeWidth="1" />
              <path d="M600 50C600 180 470 310 320 310C170 310 40 180 40 50" stroke="url(#goldDark1)" strokeWidth="0.8" />
              <path d="M580 0C580 130 440 270 300 270C160 270 20 130 20 0" stroke="url(#goldDark1)" strokeWidth="0.6" />
              <defs>
                <linearGradient id="goldDark1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#d4a843" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#b8922e" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>
            <svg className="absolute -bottom-10 -left-10 w-[400px] h-[400px] opacity-[0.15]" viewBox="0 0 400 400" fill="none">
              <path d="M0 400C0 250 150 100 300 100" stroke="url(#goldDark2)" strokeWidth="1" />
              <path d="M20 380C20 240 160 100 300 100" stroke="url(#goldDark2)" strokeWidth="0.7" />
              <defs>
                <linearGradient id="goldDark2" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#b8922e" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </>
      )}

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-5 right-5 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-300 z-50 backdrop-blur-sm ${
          isLight
            ? 'bg-white/70 text-[#5a5a5a] hover:bg-white border border-[#e8e4dc] shadow-sm'
            : 'bg-[#1a1a1a]/80 text-[#c9a84c] hover:bg-[#1a1a1a] border border-[#c9a84c]/20 shadow-lg'
        }`}
        aria-label={isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
      >
        {isLight ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span className="hidden sm:inline">Cambiar a modo oscuro</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="hidden sm:inline">Cambiar a modo claro</span>
          </>
        )}
      </button>

      {/* Login Card */}
      <div className={`w-full max-w-[420px] transition-all duration-700 relative z-10 ${
        isLight
          ? 'bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.06)]'
          : 'bg-[#1a1a1a] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-[#2a2a2a]'
      }`}>
        <div className="p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className={`w-[88px] h-[88px] mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-500 ${
              isLight
                ? 'bg-gradient-to-br from-[#d4a843] to-[#b8922e] shadow-[0_4px_20px_rgba(184,146,46,0.25)]'
                : 'bg-gradient-to-br from-[#d4a843] to-[#b8922e] shadow-[0_4px_24px_rgba(184,146,46,0.3)] ring-1 ring-[#d4a843]/20'
            }`}>
              <span className="text-white font-serif text-[32px] font-semibold tracking-tight">ZG</span>
            </div>
            <h1 className={`font-serif text-[26px] font-medium tracking-[0.02em] ${
              isLight ? 'text-[#1a1a1a]' : 'text-[#f0ece4]'
            }`}>
              ZARO GROUP
            </h1>
          </div>

          {/* Decorative ornament */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`h-[1px] w-12 ${isLight ? 'bg-[#d4a843]/40' : 'bg-[#d4a843]/30'}`} />
            <svg className={`w-4 h-4 ${isLight ? 'text-[#d4a843]' : 'text-[#d4a843]/70'}`} viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" />
            </svg>
            <div className={`h-[1px] w-12 ${isLight ? 'bg-[#d4a843]/40' : 'bg-[#d4a843]/30'}`} />
          </div>

          {/* Title */}
          <div className="text-center mb-7">
            <h2 className={`text-[19px] font-semibold mb-1.5 ${
              isLight ? 'text-[#1a1a1a]' : 'text-[#f0ece4]'
            }`}>
              Iniciar sesión
            </h2>
            <p className={`text-[13px] ${isLight ? 'text-[#8a8a8a]' : 'text-[#7a7a7a]'}`}>
              Ingresa tus credenciales para acceder
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Bottom decorative line */}
          <div className="mt-8 flex items-center justify-center">
            <div className={`h-[1px] w-16 ${isLight ? 'bg-[#d4a843]/30' : 'bg-[#d4a843]/20'}`} />
            <div className={`w-1.5 h-1.5 rounded-full mx-3 ${isLight ? 'bg-[#d4a843]/50' : 'bg-[#d4a843]/40'}`} />
            <div className={`h-[1px] w-16 ${isLight ? 'bg-[#d4a843]/30' : 'bg-[#d4a843]/20'}`} />
          </div>
        </div>
      </div>
    </div>
  )
}
