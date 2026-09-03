/**
 * LoginForm - Formulario de login premium con diseño refinado.
 * Estilo minimalista con campos sutiles y botón dorado.
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors: typeof errors = {}
    if (!email) newErrors.email = 'El usuario es requerido'
    if (!password) newErrors.password = 'La contraseña es requerida'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    await login(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Usuario */}
      <div>
        <div className="relative">
          <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${
            isLight ? 'text-[#b8922e]' : 'text-[#c9a84c]'
          }`}>
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Usuario"
            autoComplete="username"
            required
            className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-[14px] transition-all duration-300 outline-none ${
              isLight
                ? 'bg-[#f8f7f5] border border-[#e8e4dc] text-[#1a1a1a] placeholder-[#b0b0b0] focus:border-[#d4a843] focus:bg-white focus:ring-1 focus:ring-[#d4a843]/20'
                : 'bg-[#242424] border border-[#333] text-[#f0ece4] placeholder-[#666] focus:border-[#c9a84c] focus:bg-[#282828] focus:ring-1 focus:ring-[#c9a84c]/20'
            }`}
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Contraseña */}
      <div>
        <div className="relative">
          <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${
            isLight ? 'text-[#b8922e]' : 'text-[#c9a84c]'
          }`}>
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            autoComplete="current-password"
            required
            className={`w-full pl-11 pr-12 py-3.5 rounded-xl text-[14px] transition-all duration-300 outline-none ${
              isLight
                ? 'bg-[#f8f7f5] border border-[#e8e4dc] text-[#1a1a1a] placeholder-[#b0b0b0] focus:border-[#d4a843] focus:bg-white focus:ring-1 focus:ring-[#d4a843]/20'
                : 'bg-[#242424] border border-[#333] text-[#f0ece4] placeholder-[#666] focus:border-[#c9a84c] focus:bg-[#282828] focus:ring-1 focus:ring-[#c9a84c]/20'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors ${
              isLight
                ? 'text-[#b0b0b0] hover:text-[#b8922e]'
                : 'text-[#666] hover:text-[#c9a84c]'
            }`}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
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
          <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
        )}
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3.5 rounded-xl text-[14px] font-semibold transition-all duration-300 mt-2 ${
          isLoading
            ? 'bg-[#c9a84c]/50 text-white/70 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#c9a84c] via-[#d4a843] to-[#b8922e] text-white hover:from-[#b8922e] hover:via-[#c9a84c] hover:to-[#a8862a] shadow-[0_4px_16px_rgba(184,146,46,0.3)] hover:shadow-[0_6px_24px_rgba(184,146,46,0.4)] active:scale-[0.98]'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
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
