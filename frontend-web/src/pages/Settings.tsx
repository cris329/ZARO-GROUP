import { FC, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSync } from '@/hooks/useSync'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { SyncStatus } from '@/components/sync/SyncStatus'
import { formatDateTime } from '@/utils/formatters'

export const Settings: FC = () => {
  const { user, logout } = useAuth()
  const { pendingCount, lastSync, conflicts, manualSync, isSyncing, isOnline } = useSync()
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [cachedDataMB, setCachedDataMB] = useState(0)

  useEffect(() => {
    if (navigator.storage?.estimate) {
      void navigator.storage.estimate().then(({ usage = 0 }) => {
        setCachedDataMB(Number((usage / (1024 * 1024)).toFixed(2)))
      })
    }
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>

      <Card title="Sincronización">
        <SyncStatus />
        <div className="mt-4 flex items-center gap-4">
          <Button
            onClick={manualSync}
            disabled={!isOnline || isSyncing}
            loading={isSyncing}
            size="sm"
          >
            Sincronizar ahora
          </Button>
          <p className="text-xs text-gray-500">
            Pendientes: {pendingCount} · Última sincronización:{' '}
            {lastSync ? formatDateTime(lastSync) : 'nunca'}
          </p>
        </div>
        {conflicts > 0 && (
          <p className="mt-3 text-sm text-red-600">
            {conflicts} conflicto(s) pendientes de resolución
          </p>
        )}
      </Card>

      <Card title="Datos locales">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Datos almacenados en este dispositivo</p>
            <p className="text-xs text-gray-400 mt-1">
              Los datos sin conexión se sincronizan automáticamente.
            </p>
          </div>
          <span className="font-medium text-gray-900">{cachedDataMB} MB</span>
        </div>
      </Card>

      <Card title="Cuenta">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.email}</p>
              <p className="text-xs text-gray-500">Rol: {user?.role}</p>
            </div>
          </div>
          <Button variant="danger" onClick={() => setConfirmLogout(true)}>
            Cerrar sesión
          </Button>
        </div>
      </Card>

      <Modal open={confirmLogout} onClose={() => setConfirmLogout(false)} title="Cerrar sesión">
        <p className="text-gray-600 text-sm">
          ¿Desea cerrar la sesión? Los datos pendientes seguirán guardados localmente y se
          sincronizarán la próxima vez que inicie sesión.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmLogout(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
      </Modal>
    </div>
  )
}