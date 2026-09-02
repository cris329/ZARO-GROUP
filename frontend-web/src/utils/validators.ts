export const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
  return regex.test(email) && email.length <= 254
}

export const isValidPassword = (password: string): boolean => {
  if (password.length < 8 || password.length > 72) return false
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasDigit = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  return hasUpper && hasLower && hasDigit && hasSpecial
}

export const validateProduct = (data: {
  name: string
  quantity: number
  price: number
}): Record<string, string> => {
  const errors: Record<string, string> = {}
  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = 'El nombre es requerido (mínimo 2 caracteres)'
  }
  if (data.quantity < 0) {
    errors.quantity = 'La cantidad debe ser mayor o igual a 0'
  }
  if (data.price < 0) {
    errors.price = 'El precio debe ser mayor o igual a 0'
  }
  return errors
}