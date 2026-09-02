import { FC } from 'react'
import { ForgotPassword } from '@/components/auth/ForgotPassword'

export const ForgotPasswordPage: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-600 flex items-center justify-center text-white text-3xl font-bold">
            O
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Recuperar contraseña</h1>
          <p className="text-gray-500 text-sm mt-1">Le enviaremos instrucciones a su email</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <ForgotPassword />
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          <a href="/login" className="text-green-600 hover:text-green-700 font-medium">
            ← Volver al inicio de sesión
          </a>
        </p>
      </div>
    </div>
  )
}