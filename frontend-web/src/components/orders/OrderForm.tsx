import { FC, useState, FormEvent } from 'react'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { formatCOP } from '@/utils/formatters'

interface OrderItemInput {
  product_id: string
  name: string
  quantity: number
  price: number
}

interface OrderFormProps {
  products: { id: string; name: string; price: number }[]
  onSubmit: (data: {
    products: OrderItemInput[]
    client_name: string
    client_phone: string
    notes: string
  }) => void
  isLoading?: boolean
}

export const OrderForm: FC<OrderFormProps> = ({ products, onSubmit, isLoading = false }) => {
  const [items, setItems] = useState<OrderItemInput[]>([
    { product_id: '', name: '', quantity: 1, price: 0 },
  ])
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<string>('')

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId)
    setItems((prev) => {
      const next = [...prev]
      next[index] = {
        product_id: productId,
        name: product?.name ?? '',
        quantity: next[index].quantity || 1,
        price: product?.price ?? 0,
      }
      return next
    })
  }

  const addItem = () => {
    setItems((prev) => [...prev, { product_id: '', name: '', quantity: 1, price: 0 }])
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const updateQuantity = (index: number, quantity: number) => {
    setItems((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], quantity }
      return next
    })
  }

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const validItems = items.filter((i) => i.product_id && i.quantity > 0)
    if (validItems.length === 0) {
      setErrors('Agregue al menos un producto con cantidad válida')
      return
    }
    setErrors('')
    onSubmit({
      products: validItems,
      client_name: clientName,
      client_phone: clientPhone,
      notes,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <div className="font-medium text-sm text-gray-700 mb-2">Productos</div>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2 items-end">
              <select
                value={item.product_id}
                onChange={(e) => handleProductSelect(idx, e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Seleccionar producto...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {formatCOP(p.price)}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(idx, parseInt(e.target.value, 10) || 1)}
                className="w-24"
                aria-label={`Cantidad del producto ${idx + 1}`}
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="px-2 py-2 text-red-500 hover:text-red-700"
                  aria-label="Eliminar"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
        >
          + Agregar producto
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nombre del cliente"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Tienda o persona"
          required
        />
        <Input
          label="Teléfono"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          placeholder="300 123 4567"
          type="tel"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Notas del pedido (opcional)"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total del pedido</p>
          <p className="text-2xl font-bold text-gray-900">{formatCOP(total)}</p>
        </div>
      </div>

      {errors && <p className="text-sm text-red-600">{errors}</p>}

      <Button type="submit" loading={isLoading} fullWidth>
        Crear pedido
      </Button>
    </form>
  )
}