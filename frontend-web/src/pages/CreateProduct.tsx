import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { ProductForm } from '@/components/products/ProductForm'
import { Card } from '@/components/common/Card'
import { ROUTES } from '@/utils/constants'

export const CreateProduct: FC = () => {
  const navigate = useNavigate()
  const { createProduct, isLoading } = useProducts()

  const handleSubmit = async (data: {
    name: string
    description: string
    quantity: number
    price: number
  }) => {
    try {
      await createProduct({
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        price: data.price,
      })
      navigate(ROUTES.products)
    } catch {
      // El toast global mostrará el error
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <button
          onClick={() => navigate(ROUTES.products)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          ← Volver a productos
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo producto</h1>
        <p className="text-gray-500 text-sm mt-1">Registre un nuevo producto agrícola</p>
      </div>

      <Card>
        <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
      </Card>
    </div>
  )
}