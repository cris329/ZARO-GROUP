/**
 * Register - Página de registro premium para ZARO GROUP.
 * Diseño elegante con modo claro/oscuro consistente con Login.
 * @author = Cristian Deysdayr Jiménez
 */
import { FC } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const Register: FC = () => {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${
      isLight
        ? 'bg-gradient-to-br from-white via-amber-50/30 to-white'
        : 'bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950'
    }`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 z-50 ${
          isLight
            ? 'bg-white/80 text-charcoal-700 hover:bg-white border border-charcoal-200/50 shadow-sm'
            : 'bg-charcoal-800/80 text-gold-400 hover:bg-charcoal-800 border border-gold-500/20 shadow-lg'
        }`}
      >
        {isLight ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span className="hidden sm:inline">Cambiar a modo oscuro</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="hidden sm:inline">Cambiar a modo claro</span>
          </>
        )}
      </button>

      {/* Card */}
      <div className={`w-full max-w-md transition-all duration-500 ${
        isLight
          ? 'bg-white rounded-3xl shadow-card-light'
          : 'bg-charcoal-800 rounded-3xl shadow-card-dark border border-gold-500/10'
      }`}>
        <div className="p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className={`w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center transition-all duration-500 ${
              isLight
                ? 'bg-gradient-to-br from-gold-400 to-gold-600 shadow-gold'
                : 'bg-gradient-to-br from-gold-500 to-gold-700 shadow-gold ring-2 ring-gold-400/30'
            }`}>
              <span className="text-white font-serif text-2xl font-bold tracking-wide">ZG</span>
            </div>
            <h1 className={`font-serif text-2xl font-semibold tracking-wide ${
              isLight ? 'text-charcoal-900' : 'text-white'
            }`}>
              ZARO GROUP
            </h1>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className={`text-xl font-semibold mb-2 ${isLight ? 'text-charcoal-800' : 'text-white'}`}>
              Crear cuenta
            </h2>
            <p className={`text-sm ${isLight ? 'text-charcoal-500' : 'text-charcoal-400'}`}>
              Empiece a gestionar su producción hoy
            </p>
          </div>

          <RegisterForm />

          <div className="mt-8 text-center">
            <p className={`text-sm ${isLight ? 'text-charcoal-500' : 'text-charcoal-400'}`}>
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className={`font-medium transition-colors ${
                isLight ? 'text-gold-600 hover:text-gold-700' : 'text-gold-400 hover:text-gold-300'
              }`}>
                Inicia sesión
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative */}
      <div className={`fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden ${
        isLight ? 'opacity-30' : 'opacity-10'
      }`}>
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
          isLight ? 'bg-gold-200' : 'bg-gold-600'
        }`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl ${
          isLight ? 'bg-gold-100' : 'bg-gold-800'
        }`} />
      </div>
    </div>
  )
}
