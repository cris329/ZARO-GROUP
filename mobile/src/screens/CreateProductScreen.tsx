import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { useProductStore } from '@/store/productStore'
import { sanitizeInput } from '@/utils'
import theme from '@/theme'

export function CreateProductScreen({ navigation }: { navigation: any }) {
  const { createProduct, isLoading } = useProductStore()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState('0')
  const [price, setPrice] = useState('0')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    const cleanName = sanitizeInput(name)
    if (cleanName.trim().length < 2) {
      setError('El nombre es requerido')
      return
    }
    const qty = parseInt(quantity, 10) || 0
    const priceVal = parseFloat(price) || 0
    if (qty < 0 || priceVal < 0) {
      setError('Cantidad y precio deben ser positivos')
      return
    }
    setError('')
    try {
      await createProduct({
        name: cleanName,
        description: sanitizeInput(description),
        quantity: qty,
        price: priceVal,
      })
      navigation.goBack()
    } catch (e) {
      setError('No se pudo crear el producto')
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Input label="Nombre del producto" value={name} onChangeText={setName} placeholder="Ej: Tomate Chonto" />
      <Input
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        placeholder="Descripción del producto"
        multiline
      />
      <View style={styles.row}>
        <View style={styles.half}>
          <Input
            label="Cantidad"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>
        <View style={styles.half}>
          <Input
            label="Precio (COP)"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholder="0"
          />
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Crear producto" onPress={handleSubmit} loading={isLoading} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  error: { color: theme.colors.danger, fontSize: 14, marginBottom: 12, textAlign: 'center' },
})