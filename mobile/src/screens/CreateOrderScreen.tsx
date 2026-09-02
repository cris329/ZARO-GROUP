import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { useOrderStore } from '@/store/orderStore'
import { useProductStore } from '@/store/productStore'
import { sanitizeInput, formatCOP } from '@/utils'
import theme from '@/theme'

export function CreateOrderScreen({ navigation }: { navigation: any }) {
  const { createOrder, isLoading } = useOrderStore()
  const { products, loadLocal } = useProductStore()

  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [selected, setSelected] = useState<
    { id: string; name: string; quantity: number; price: number }[]
  >([])
  const [error, setError] = useState('')

  React.useEffect(() => {
    void loadLocal()
  }, [loadLocal])

  const toggleProduct = (productId: string) => {
    setSelected((prev) => {
      const exists = prev.find((p) => p.id === productId)
      if (exists) return prev.filter((p) => p.id !== productId)
      const product = products.find((p) => p.id === productId)
      if (product) {
        return [...prev, { id: product.id, name: product.name, quantity: 1, price: product.price }]
      }
      return prev
    })
  }

  const total = selected.reduce((s, p) => s + p.price * p.quantity, 0)

  const handleSubmit = async () => {
    if (selected.length === 0) {
      setError('Seleccione al menos un producto')
      return
    }
    if (sanitizeInput(clientName).trim().length < 2) {
      setError('Ingrese el nombre del cliente')
      return
    }
    setError('')
    try {
      await createOrder({
        client_name: sanitizeInput(clientName),
        client_phone: sanitizeInput(clientPhone),
        notes: sanitizeInput(notes),
        products: selected,
      })
      navigation.goBack()
    } catch (e) {
      setError('No se pudo crear el pedido')
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Input label="Nombre del cliente" value={clientName} onChangeText={setClientName} placeholder="Tienda o persona" />
      <Input
        label="Teléfono"
        value={clientPhone}
        onChangeText={setClientPhone}
        placeholder="300 123 4567"
        keyboardType="phone-pad"
      />
      <Input
        label="Notas"
        value={notes}
        onChangeText={setNotes}
        placeholder="Notas del pedido (opcional)"
        multiline
      />

      <Text style={styles.sectionTitle}>Productos</Text>
      {products.map((p) => {
        const isSelected = selected.some((s) => s.id === p.id)
        return (
          <TouchableOpacity
            key={p.id}
            onPress={() => toggleProduct(p.id)}
            style={[styles.productRow, isSelected && styles.productRowSelected]}
          >
            <Text style={styles.productName}>{p.name}</Text>
            <Text style={styles.productPrice}>{formatCOP(p.price)}</Text>
          </TouchableOpacity>
        )
      })}

      {selected.length > 0 && (
        <View style={styles.selectedBlock}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          {selected.map((s) => (
            <View key={s.id} style={styles.summaryRow}>
              <Text style={styles.summaryText}>{s.name} × {s.quantity}</Text>
              <Text style={styles.summaryValue}>{formatCOP(s.price * s.quantity)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCOP(total)}</Text>
          </View>
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Crear pedido" onPress={handleSubmit} loading={isLoading} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1c1917', marginTop: 12, marginBottom: 8 },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  productRowSelected: { backgroundColor: '#dcfce7', borderColor: '#16a34a' },
  productName: { fontSize: 14, color: '#1c1917', flex: 1 },
  productPrice: { fontSize: 14, fontWeight: '600', color: '#15803d' },
  selectedBlock: { marginTop: 8 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryText: { color: '#57534e', fontSize: 14 },
  summaryValue: { color: '#1c1917', fontSize: 14, fontWeight: '500' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e7e5e4',
  },
  totalLabel: { fontSize: 16, fontWeight: '600', color: '#1c1917' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#15803d' },
  error: { color: theme.colors.danger, fontSize: 14, marginBottom: 12, textAlign: 'center' },
})