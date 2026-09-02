import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { useProductStore } from '@/store/productStore'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/common/Card'
import { formatCOP, formatNumber } from '@/utils'

export function DashboardScreen({ navigation }: { navigation: any }) {
  const { products, loadLocal } = useProductStore()
  const { user } = useAuthStore()

  React.useEffect(() => {
    void loadLocal()
  }, [loadLocal])

  const totalInventory = products.reduce((s, p) => s + p.price * p.quantity, 0)
  const lowStock = products.filter((p) => p.quantity <= 10).slice(0, 5)
  const firstName = user?.name?.split(' ')[0] ?? 'campesino'

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hola, {firstName} 🌱</Text>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Inventario</Text>
          <Text style={styles.statValue}>{formatCOP(totalInventory)}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Productos</Text>
          <Text style={styles.statValue}>{formatNumber(products.length)}</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Bajo stock</Text>
      <FlatList
        data={lowStock}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Productos', { screen: 'ProductDetail', params: { id: item.id } })}
          >
            <Card style={styles.listItem}>
              <View style={styles.row}>
                <View style={styles.rowText}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>{formatNumber(item.quantity)} unidades</Text>
                </View>
                <Text style={styles.itemPrice}>{formatCOP(item.price)}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.empty}>Sin productos con bajo stock</Text>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  greeting: { fontSize: 24, fontWeight: '700', color: '#1c1917', marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  statCard: { flex: 1, marginBottom: 0 },
  statLabel: { fontSize: 12, color: '#78716c', textTransform: 'uppercase' },
  statValue: { fontSize: 20, fontWeight: '700', color: '#15803d', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1c1917', marginTop: 16, marginBottom: 8 },
  listItem: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowText: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#1c1917' },
  itemMeta: { fontSize: 13, color: '#78716c', marginTop: 2 },
  itemPrice: { fontSize: 15, fontWeight: '600', color: '#15803d' },
  empty: { color: '#78716c', textAlign: 'center', marginTop: 16 },
})