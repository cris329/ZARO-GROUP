import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { useOrderStore } from '@/store/orderStore'
import { Card } from '@/components/common/Card'
import { formatCOP, formatDate } from '@/utils'

export function ReportsScreen() {
  const { orders, loadLocal } = useOrderStore()

  React.useEffect(() => {
    void loadLocal()
  }, [loadLocal])

  const totalSales = orders.reduce((s, o) => s + o.total, 0)
  const delivered = orders.filter((o) => o.status === 'delivered').reduce((s, o) => s + o.total, 0)
  const pending = orders.filter((o) => o.status === 'pending')

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Ventas totales</Text>
          <Text style={styles.statValue}>{formatCOP(totalSales)}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Entregado</Text>
          <Text style={styles.statValue}>{formatCOP(delivered)}</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Pedidos pendientes</Text>
      <FlatList
        data={pending}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.listItem}>
            <View style={styles.row}>
              <Text style={styles.name}>{item.client_name || 'Sin cliente'}</Text>
              <View style={styles.right}>
                <Text style={styles.price}>{formatCOP(item.total)}</Text>
                <Text style={styles.meta}>{formatDate(item.created_at)}</Text>
              </View>
            </View>
          </Card>
        )}
        ListEmptyComponent={() => <Text style={styles.empty}>Sin pedidos pendientes</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, marginBottom: 0 },
  statLabel: { fontSize: 12, color: '#78716c', textTransform: 'uppercase' },
  statValue: { fontSize: 20, fontWeight: '700', color: '#15803d', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1c1917', marginTop: 16, marginBottom: 8 },
  listItem: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 15, fontWeight: '500', color: '#1c1917', flex: 1 },
  right: { alignItems: 'flex-end' },
  price: { fontSize: 15, fontWeight: '600', color: '#15803d' },
  meta: { fontSize: 12, color: '#a8a29e', marginTop: 2 },
  empty: { color: '#78716c', textAlign: 'center', marginTop: 32 },
})