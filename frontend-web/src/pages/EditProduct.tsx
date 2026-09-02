import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { ProductForm } from '@/components/products/ProductForm'
import { Card } from '@/components/common/Card'
import { ROUTES } from '@/utils/constants'
import { Product } from '@/types'

export const EditProduct: FC = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { fetchProduct, updateProduct, isLoading } = useProducts()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct(id)
      .then(setProduct)
      .catch(() => navigate(ROUTES.products))
      .finally(() => setLoading(false))
  }, [id, fetchProduct, navigate])

  const handleSubmit = async (data: {
    name: string
    description: string
    quantity: number
    price: number
  }) => {
    try {
      await updateProduct(id, data)
      navigate(ROUTES.productDetail(id))
    } catch {
      // Toast global
    }
  }

  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-100 rounded-xl" />
  }

  if (!product) return null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <button
          onClick={() => navigate(ROUTES.products)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          ← Volver a productos
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Editar producto</h1>
        <p className="text-gray-500 text-sm mt-1">{product.name}</p>
      </div>

      <Card>
        <ProductForm initial={product} onSubmit={handleSubmit} isLoading={isLoading} />
      </Card>
    </div>
  )
}