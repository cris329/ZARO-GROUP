/**
 * LoginForm - Formulario de login con diseño premium refinado.
 * Estilo minimalista, campos sutiles, botón dorado gradiente.
 * @author = Cristian Deysdayr Jiménez
 */
import { FC, useState, FormEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'

export const LoginForm: FC = () => {
  const { login, isLoading } = useAuth()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  /** Maneja el envío del formulario con validación básica */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors: typeof errors = {}
    if (!email.trim()) newErrors.email = 'El usuario es requerido'
    if (!password) newErrors.password = 'La contraseña es requerida'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    await login(email, password)
  }

  /** Clases base reutilizables para los campos de entrada */
  const inputBase =
    'w-full py-3 rounded-lg text-[15px] transition-all duration-300 outline-none font-normal'
  const inputLight =
    'bg-[#f7f6f4] border border-[#e5e2dc] text-[#2a2a2a] placeholder-[#a0a0a0] focus:border-[#c9a84c] focus:bg-white focus:ring-1 focus:ring-[#c9a84c]/20'
  const inputDark =
    'bg-[#1e1e1e] border border-[#333] text-[#e8e4dc] placeholder-[#666] focus:border-[#c9a84c] focus:bg-[#222] focus:ring-1 focus:ring-[#c9a84c]/20'

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* ── Campo: Usuario ── */}
      <fieldset className="space-y-1.5" aria-describedby="email-error">
        <label htmlFor="login-email" className="sr-only">
          Usuario
        </label>
        <div className="relative">
          <span
            className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
              isLight ? 'text-[#b8922e]' : 'text-[#c9a84c]'
            }`}
            aria-hidden="true"
          >
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </span>
          <input
            id="login-email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Usuario"
            autoComplete="username"
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            className={`${inputBase} pl-11 pr-4 ${isLight ? inputLight : inputDark}`}
          />
        </div>
        {errors.email && (
          <p id="email-error" className="text-xs text-red-500 pl-1" role="alert">
            {errors.email}
          </p>
        )}
      </fieldset>

      {/* ── Campo: Contraseña ── */}
      <fieldset className="space-y-1.5" aria-describedby="password-error">
        <label htmlFor="login-password" className="sr-only">
          Contraseña
        </label>
        <div className="relative">
          <span
            className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
              isLight ? 'text-[#b8922e]' : 'text-[#c9a84c]'
            }`}
            aria-hidden="true"
          >
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </span>
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            autoComplete="current-password"
            required
            aria-required="true"
            aria-invalid={!!errors.password}
            className={`${inputBase} pl-11 pr-11 ${isLight ? inputLight : inputDark}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors duration-200 ${
              isLight
                ? 'text-[#a0a0a0] hover:text-[#b8922e]'
                : 'text-[#666] hover:text-[#c9a84c]'
            }`}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.573 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-xs text-red-500 pl-1" role="alert">
            {errors.password}
          </p>
        )}
      </fieldset>

      {/* ── Botón: Iniciar sesión (estilo outline dorado) ── */}
      <button
        type="submit"
        disabled={isLoading}
        aria-label="Iniciar sesión"
        className={`w-full h-[48px] rounded-lg text-[15px] font-semibold transition-all duration-300 mt-3 outline outline-[2px] ${
          isLoading
            ? 'outline-[#c9a84c]/40 text-[#c9a84c]/60 bg-transparent cursor-not-allowed'
            : 'outline-[#c9a84c] bg-gradient-to-r from-[#c9a84c] via-[#d4a843] to-[#b8922e] text-white hover:from-[#b8922e] hover:via-[#c9a84c] hover:to-[#a8862a] shadow-[0_4px_16px_rgba(184,146,46,0.25)] hover:shadow-[0_6px_24px_rgba(184,146,46,0.35)] active:scale-[0.98] focus:ring-2 focus:ring-[#c9a84c]/40 focus:outline-none'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Iniciando sesión...
          </span>
        ) : (
          'Iniciar sesión'
        )}
      </button>
    </form>
  )
}
