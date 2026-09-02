import { FC, useState, FormEvent, useEffect } from 'react'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Product } from '@/types'
import { validateProduct } from '@/utils/validators'
import { sanitizeProduct } from '@/utils/sanitizers'

interface ProductFormProps {
  initial?: Product | null
  onSubmit: (data: { name: string; description: string; quantity: number; price: number }) => void
  isLoading?: boolean
}

export const ProductForm: FC<ProductFormProps> = ({ initial, onSubmit, isLoading = false }) => {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [quantity, setQuantity] = useState(initial?.quantity?.toString() ?? '0')
  const [price, setPrice] = useState(initial?.price?.toString() ?? '0')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initial) {
      setName(initial.name)
      setDescription(initial.description)
      setQuantity(initial.quantity.toString())
      setPrice(initial.price.toString())
    }
  }, [initial])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const cleaned = sanitizeProduct({ name, description })
    const qty = parseInt(quantity, 10) || 0
    const priceVal = parseFloat(price) || 0

    const newErrors = validateProduct({
      name: cleaned.name,
      quantity: qty,
      price: priceVal,
    })

    if (description.length > 1000) {
      newErrors.description = 'La descripción no puede exceder 1000 caracteres'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    onSubmit({
      name: cleaned.name,
      description: cleaned.description,
      quantity: qty,
      price: priceVal,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre del producto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ej: Tomate Chonto"
        error={errors.name}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Descripción del producto"
        />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Cantidad"
          type="number"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          error={errors.quantity}
          required
        />
        <Input
          label="Precio (COP)"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          error={errors.price}
          required
        />
      </div>

      <Button type="submit" loading={isLoading} fullWidth>
        {initial ? 'Guardar cambios' : 'Crear producto'}
      </Button>
    </form>
  )
}