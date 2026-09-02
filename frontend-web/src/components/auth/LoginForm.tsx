import { FC, useState, FormEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { isValidEmail, isValidPassword } from '@/utils/validators'

export const LoginForm: FC = () => {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors: typeof errors = {}
    if (!isValidEmail(email)) newErrors.email = 'Ingrese un email válido'
    if (!password) newErrors.password = 'La contraseña es requerida'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    await login(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="campesino@example.com"
        error={errors.email}
        autoComplete="email"
        required
      />
      <Input
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        error={errors.password}
        autoComplete="current-password"
        required
      />
      <Button type="submit" loading={isLoading} fullWidth>
        Iniciar sesión
      </Button>
    </form>
  )
}