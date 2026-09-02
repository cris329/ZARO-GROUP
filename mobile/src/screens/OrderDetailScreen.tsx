import React from 'react'
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import { useOrderStore } from '@/store/orderStore'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { formatCOP, formatDate } from '@/utils'

export function OrderDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const { id } = route.params
  const { orders, deleteOrder } = useOrderStore()
  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Pedido no encontrado</Text>
        <Button title="Volver" onPress={() => navigation.goBack()} variant="secondary" />
      </View>
    )
  }

  const handleDelete = () => {
    Alert.alert('Eliminar pedido', '¿Desea eliminar este pedido?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteOrder(order.id)
          navigation.goBack()
        },
      },
    ])
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Card title={order.client_name || 'Sin cliente'} subtitle={order.id}>
        <Text style={styles.date}>Fecha: {formatDate(order.created_at)}</Text>

        {order.products.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itemName}>
              {item.name} × {item.quantity}
            </Text>
            <Text style={styles.itemPrice}>{formatCOP(item.subtotal)}</Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCOP(order.total)}</Text>
        </View>
      </Card>

      <Card title="Cliente">
        <Text style={styles.meta}>Teléfono: {order.client_phone || '—'}</Text>
        {order.notes ? <Text style={styles.meta}>Notas: {order.notes}</Text> : null}
      </Card>

      <Button title="Eliminar pedido" onPress={handleDelete} variant="danger" />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  empty: { color: '#78716c', textAlign: 'center', marginTop: 48, fontSize: 16 },
  date: { color: '#78716c', fontSize: 13, marginBottom: 12 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f4',
  },
  itemName: { color: '#1c1917', fontSize: 14 },
  itemPrice: { color: '#1c1917', fontSize: 14, fontWeight: '500' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  totalLabel: { fontSize: 16, fontWeight: '600', color: '#1c1917' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#15803d' },
  meta: { fontSize: 14, color: '#57534e', marginBottom: 4 },
})