import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import { useProductStore } from '@/store/productStore'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { formatCOP, formatNumber } from '@/utils'

export function ProductsScreen({ navigation }: { navigation: any }) {
  const { products, isLoading, loadLocal, fetchFromServer } = useProductStore()

  React.useEffect(() => {
    void loadLocal()
    void fetchFromServer()
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => void fetchFromServer()} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProductDetail', { id: item.id })
            }
          >
            <Card style={styles.card}>
              <View style={styles.row}>
                <View style={styles.rowText}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text numberOfLines={1} style={styles.description}>
                    {item.description || 'Sin descripción'}
                  </Text>
                  <Text style={styles.meta}>
                    {formatNumber(item.quantity)} uni. · v{item.version}
                  </Text>
                </View>
                <View style={styles.priceBlock}>
                  <Text style={styles.price}>{formatCOP(item.price)}</Text>
                  {!item.synced && <Text style={styles.pending}>Pendiente</Text>}
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.empty}>No hay productos registrados</Text>
        )}
      />

      <View style={styles.fab}>
        <Button title="+ Nuevo producto" onPress={() => navigation.navigate('CreateProduct')} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  card: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowText: { flex: 1, paddingRight: 12 },
  name: { fontSize: 16, fontWeight: '600', color: '#1c1917' },
  description: { fontSize: 13, color: '#78716c', marginTop: 2 },
  meta: { fontSize: 12, color: '#a8a29e', marginTop: 4 },
  priceBlock: { alignItems: 'flex-end' },
  price: { fontSize: 16, fontWeight: '700', color: '#15803d' },
  pending: { fontSize: 11, color: '#d97706', marginTop: 2 },
  empty: { color: '#78716c', textAlign: 'center', marginTop: 48 },
  fab: { position: 'absolute', bottom: 24, left: 16, right: 16 },
})