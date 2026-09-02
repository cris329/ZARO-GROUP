import { FC } from 'react'
import { RegisterForm } from '@/components/auth/RegisterForm'
import logo from '@/assets/LOGO.png'

export const Register: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="ZARO GROUP" className="w-20 h-20 mx-auto mb-4 rounded-2xl object-contain" />
          <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
          <p className="text-gray-500 text-sm mt-1">Empiece a gestionar su producción hoy</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <RegisterForm />
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tiene cuenta?{' '}
          <a href="/login" className="text-green-600 hover:text-green-700 font-medium">
            Inicie sesión
          </a>
        </p>
      </div>
    </div>
  )
}