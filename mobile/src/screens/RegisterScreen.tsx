import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { useAuthStore } from '@/store/authStore'
import { isValidEmail, isValidPassword, sanitizeInput } from '@/utils'

export function RegisterScreen({ navigation }: { navigation: any }) {
  const { register, isLoading } = useAuthStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async () => {
    if (sanitizeInput(name).trim().length < 2) {
      setError('Ingrese su nombre completo')
      return
    }
    if (!isValidEmail(email)) {
      setError('Ingrese un email válido')
      return
    }
    if (!isValidPassword(password)) {
      setError('Mínimo 8 caracteres: mayúscula, minúscula, número y símbolo')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setError('')
    try {
      await register(sanitizeInput(name), email.trim(), password)
    } catch (e) {
      setError('No se pudo crear la cuenta')
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>Empiece a gestionar su producción</Text>

      <View style={styles.form}>
        <Input label="Nombre completo" value={name} onChangeText={setName} placeholder="Juan Pérez" />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="campesino@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="Mínimo 8 caracteres"
          secureTextEntry
        />
        <Input
          label="Confirmar contraseña"
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Repita la contraseña"
          secureTextEntry
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <Button title="Crear cuenta" onPress={handleRegister} loading={isLoading} />
        <Button
          title="← Ya tengo cuenta"
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f0fdf4' },
  container: {
    padding: 24,
    paddingTop: 60,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1c1917',
    textAlign: 'center',
  },
  subtitle: {
    color: '#78716c',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 32,
  },
  form: { width: '100%' },
  error: { color: '#dc2626', fontSize: 14, marginBottom: 12, textAlign: 'center' },
})