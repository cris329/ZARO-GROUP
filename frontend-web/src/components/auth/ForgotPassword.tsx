import { FC, useState, FormEvent } from 'react'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { isValidEmail } from '@/utils/validators'

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setError('Ingrese un email válido')
      return
    }
    setError('')
    // En producción, enviar email de recuperación vía servicios SMS/Email
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center space-y-3">
        <div className="text-4xl">📧</div>
        <h3 className="text-lg font-semibold text-gray-900">Solicitud enviada</h3>
        <p className="text-sm text-gray-600">
          Si el email <strong>{email}</strong> está registrado, recibirá instrucciones para
          restablecer su contraseña.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email registrado"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="usuario@ejemplo.com"
        error={error}
        autoComplete="email"
        required
      />
      <Button type="submit" fullWidth>
        Enviar instrucciones
      </Button>
    </form>
  )
}