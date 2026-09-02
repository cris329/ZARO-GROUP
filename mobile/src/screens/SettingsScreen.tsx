import React from 'react'
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native'
import { useAuthStore } from '@/store/authStore'
import { useSyncStore } from '@/store/syncStore'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { formatDate } from '@/utils'

export function SettingsScreen() {
  const { user, logout } = useAuthStore()
  const { pendingCount, lastSync, isOnline, syncNow, isSyncing, subscribe } = useSyncStore()
  const [offlineMode, setOfflineMode] = React.useState(false)

  React.useEffect(() => {
    subscribe()
  }, [subscribe])

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Card title="Sincronización">
        <View style={styles.row}>
          <Text style={styles.label}>Estado</Text>
          <Text style={[styles.value, { color: isOnline ? '#16a34a' : '#dc2626' }]}>
            {isOnline ? 'En línea' : 'Offline'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Pendientes</Text>
          <Text style={styles.value}>{pendingCount}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Última sincronización</Text>
          <Text style={styles.value}>{lastSync ? formatDate(lastSync) : 'nunca'}</Text>
        </View>
        <Button title="Sincronizar ahora" onPress={() => void syncNow()} loading={isSyncing} />
      </Card>

      <Card title="Modo de datos">
        <View style={styles.row}>
          <Text style={styles.label}>Priorizar uso de datos</Text>
          <Switch value={offlineMode} onValueChange={setOfflineMode} />
        </View>
        <Text style={styles.hint}>
          En modo offline las operaciones se guardan localmente y se sincronizan al recuperar
          conexión.
        </Text>
      </Card>

      <Card title="Cuenta">
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Rol</Text>
          <Text style={styles.value}>{user?.role}</Text>
        </View>
        <Button title="Cerrar sesión" onPress={() => void logout()} variant="danger" />
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: { fontSize: 14, color: '#57534e' },
  value: { fontSize: 14, fontWeight: '500', color: '#1c1917' },
  hint: { fontSize: 12, color: '#a8a29e', marginTop: 4 },
})