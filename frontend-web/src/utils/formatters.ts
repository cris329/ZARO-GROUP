export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${d.getFullYear()}`
}

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${d.getFullYear()} a las ${hours}:${minutes}`
}

export const formatCOP = (amount: number): string => {
  return `$ ${formatNumber(Math.round(amount))}`
}

export const formatNumber = (value: number): string => {
  return value.toLocaleString('es-CO')
}

export const formatQuantity = (value: number): string => {
  return formatNumber(value)
}