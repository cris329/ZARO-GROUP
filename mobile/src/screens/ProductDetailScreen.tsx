import React from 'react'
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import { useProductStore } from '@/store/productStore'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { formatCOP, formatNumber, formatDate } from '@/utils'

export function ProductDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const { id } = route.params
  const { products, deleteProduct } = useProductStore()
  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Producto no encontrado</Text>
        <Button title="Volver" onPress={() => navigation.goBack()} variant="secondary" />
      </View>
    )
  }

  const handleDelete = () => {
    Alert.alert('Eliminar producto', `¿Eliminar ${product.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteProduct(product.id)
          navigation.goBack()
        },
      },
    ])
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Card title={product.name}>
        <Text style={styles.description}>{product.description || 'Sin descripción'}</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Cantidad</Text>
            <Text style={styles.statValue}>{formatNumber(product.quantity)}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Precio</Text>
            <Text style={styles.statValue}>{formatCOP(product.price)}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Valor total</Text>
            <Text style={styles.statValue}>
              {formatCOP(product.price * product.quantity)}
            </Text>
          </View>
        </View>
        <Text style={styles.meta}>
          Creado: {formatDate(product.created_at)} · v{product.version}
        </Text>
      </Card>

      <View style={styles.actions}>
        <Button title="Eliminar" onPress={handleDelete} variant="danger" />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  empty: { color: '#78716c', textAlign: 'center', marginTop: 48, fontSize: 16 },
  description: { fontSize: 14, color: '#57534e', marginBottom: 16 },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  stat: { flex: 1 },
  statLabel: { fontSize: 12, color: '#78716c', textTransform: 'uppercase' },
  statValue: { fontSize: 17, fontWeight: '700', color: '#1c1917', marginTop: 2 },
  meta: { fontSize: 12, color: '#a8a29e' },
  actions: { marginTop: 8 },
})