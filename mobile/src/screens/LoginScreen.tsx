import React, { useState } from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { useAuthStore } from '@/store/authStore'
import { isValidEmail } from '@/utils'

export function LoginScreen({ navigation }: { navigation: any }) {
  const { login, isLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      setError('Ingrese un email válido')
      return
    }
    if (!password) {
      setError('Ingrese la contraseña')
      return
    }
    setError('')
    try {
      await login(email.trim(), password)
    } catch (e) {
      setError('Credenciales inválidas')
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>O</Text>
        </View>
        <Text style={styles.title}>ZARO GROUP</Text>
        <Text style={styles.subtitle}>Innovación, gestión y crecimiento</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="usuario@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Input
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <Button title="Iniciar sesión" onPress={handleLogin} loading={isLoading} />
        <Button
          title="Crear cuenta"
          onPress={() => navigation.navigate('Register')}
          variant="secondary"
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1c1917',
  },
  subtitle: {
    marginTop: 4,
    color: '#78716c',
    textAlign: 'center',
  },
  form: {
    gap: 4,
  },
  error: {
    color: '#dc2626',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
})