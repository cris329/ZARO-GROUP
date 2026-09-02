import { FC, useState, FormEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { isValidEmail, isValidPassword } from '@/utils/validators'

export const RegisterForm: FC = () => {
  const { register, isLoading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (name.trim().length < 2) newErrors.name = 'Ingrese su nombre completo'
    if (!isValidEmail(email)) newErrors.email = 'Ingrese un email válido'
    if (!isValidPassword(password)) {
      newErrors.password = 'Mínimo 8 caracteres con mayúscula, minúscula, número y símbolo'
    }
    if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    await register(name.trim(), email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Juan Pérez"
        error={errors.name}
        autoComplete="name"
        required
      />
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
        placeholder="Mínimo 8 caracteres"
        error={errors.password}
        autoComplete="new-password"
        required
      />
      <Input
        label="Confirmar contraseña"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Repita la contraseña"
        error={errors.confirmPassword}
        autoComplete="new-password"
        required
      />
      <Button type="submit" loading={isLoading} fullWidth>
        Crear cuenta
      </Button>
    </form>
  )
}