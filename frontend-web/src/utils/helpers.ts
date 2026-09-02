export class ApiError extends Error {
  status: number
  code: string

  constructor(message: string, status: number, code = 'unknown') {
    super(message)
    this.status = status
    this.code = code
  }
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'Ocurrió un error inesperado'
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

export const isOfflineError = (error: unknown): boolean => {
  if (error instanceof ApiError) return error.status === 0
  if (error instanceof Error && error.message.includes('Network')) return true
  return false
}