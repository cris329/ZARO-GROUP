import { describe, it, expect } from 'vitest'
import { isValidEmail, isValidPassword, validateProduct } from './validators'

describe('isValidEmail', () => {
  it('accepta emails válidos', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('juan.perez@campo.co')).toBe(true)
  })

  it('rechaza emails inválidos', () => {
    expect(isValidEmail('invalid')).toBe(false)
    expect(isValidEmail('user@')).toBe(false)
    expect(isValidEmail('@domain.com')).toBe(false)
  })
})

describe('isValidPassword', () => {
  it('acepta contraseñas fuertes', () => {
    expect(isValidPassword('Abcdef1!')).toBe(true)
  })

  it('rechaza contraseñas débiles', () => {
    expect(isValidPassword('short')).toBe(false)
    expect(isValidPassword('abcdef1!')).toBe(false)
    expect(isValidPassword('ABCDEF1!')).toBe(false)
    expect(isValidPassword('Abcdef12')).toBe(false)
  })
})

describe('validateProduct', () => {
  it('no reporta errores para producto válido', () => {
    const errors = validateProduct({ name: 'Tomate', quantity: 10, price: 1500 })
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('reporta errores para producto inválido', () => {
    const errors = validateProduct({ name: 'A', quantity: -1, price: -5 })
    expect(errors.name).toBeDefined()
    expect(errors.quantity).toBeDefined()
    expect(errors.price).toBeDefined()
  })
})