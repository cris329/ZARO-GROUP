import { FC } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/common/Card'
import { formatDate, formatDateTime } from '@/utils/formatters'

export const Profile: FC = () => {
  const { user } = useAuth()

  if (!user) return null

  const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    farmer: 'Campesino',
    manager: 'Gestor',
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>

      <Card title="Información personal">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {roleLabels[user.role] ?? user.role}
            </span>
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd className="text-gray-900 font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-gray-500">ID de usuario</dt>
            <dd className="text-gray-900 font-medium">{user.id}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Miembro desde</dt>
            <dd className="text-gray-900 font-medium">{formatDate(user.created_at)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Última actualización</dt>
            <dd className="text-gray-900 font-medium">{formatDateTime(user.updated_at)}</dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}