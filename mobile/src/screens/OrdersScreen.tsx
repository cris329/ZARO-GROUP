import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import { useOrderStore } from '@/store/orderStore'
import { Card } from '@/components/common/Card'
import { formatCOP, formatDate } from '@/utils'

const statusColors: Record<string, string> = {
  pending: '#d97706',
  confirmed: '#2563eb',
  shipped: '#9333ea',
  delivered: '#16a34a',
  cancelled: '#dc2626',
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

export function OrdersScreen({ navigation }: { navigation: any }) {
  const { orders, isLoading, loadLocal, fetchFromServer } = useOrderStore()

  React.useEffect(() => {
    void loadLocal()
    void fetchFromServer()
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => void fetchFromServer()} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('OrderDetail', { id: item.id })}>
            <Card style={styles.card}>
              <View style={styles.row}>
                <View style={styles.rowText}>
                  <Text style={styles.name}>{item.client_name || 'Sin cliente'}</Text>
                  <Text style={styles.meta}>{formatDate(item.created_at)} · {item.id.slice(-6)}</Text>
                </View>
                <View style={styles.priceBlock}>
                  <Text style={styles.price}>{formatCOP(item.total)}</Text>
                  <Text style={[styles.status, { color: statusColors[item.status] ?? '#78716c' }]}>
                    {statusLabels[item.status] ?? item.status}
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.empty}>No hay pedidos registrados</Text>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  card: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowText: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#1c1917' },
  meta: { fontSize: 12, color: '#a8a29e', marginTop: 2 },
  priceBlock: { alignItems: 'flex-end' },
  price: { fontSize: 16, fontWeight: '700', color: '#15803d' },
  status: { fontSize: 12, marginTop: 2 },
  empty: { color: '#78716c', textAlign: 'center', marginTop: 48 },
})