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

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/(javascript:|on\w+\s*=|data:text\/html)/gi, '')
    .trim()
}

export const formatCOP = (amount: number): string => {
  return `$ ${Math.round(amount).toLocaleString('es-CO')}`
}

export const formatNumber = (value: number): string => {
  return value.toLocaleString('es-CO')
}

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${d.getFullYear()}`
}

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const withRetry = async <T>(
  fn: () => Promise<T>,
  backoff: number[] = [1000, 2000, 4000, 8000, 16000],
): Promise<T> => {
  let lastError: unknown
  for (const delay of backoff) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      await sleep(delay)
    }
  }
  throw lastError
}