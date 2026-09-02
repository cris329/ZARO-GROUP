import { FC, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from '@/components/auth/LoginForm'
import logo from '@/assets/LOGO.png'

export const Login: FC = () => {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/'
    }
  }, [isAuthenticated])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="ZARO GROUP" className="w-20 h-20 mx-auto mb-4 rounded-2xl object-contain" />
          <h1 className="text-2xl font-bold text-gray-900">ZARO GROUP</h1>
          <p className="text-gray-500 text-sm mt-1">Innovación, gestión y crecimiento</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Iniciar sesión</h2>
          <LoginForm />
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿No tiene cuenta?{' '}
          <a href="/register" className="text-green-600 hover:text-green-700 font-medium">
            Regístrese aquí
          </a>
        </p>
      </div>
    </div>
  )
}