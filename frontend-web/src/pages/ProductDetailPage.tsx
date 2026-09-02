import { FC, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { ProductDetails } from '@/components/products/ProductDetails'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { ROUTES } from '@/utils/constants'
import { formatCOP } from '@/utils/formatters'

export const ProductDetail: FC = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { fetchProduct, deleteProduct } = useProducts()
  const [product, setProduct] = useState<Awaited<ReturnType<typeof fetchProduct>> | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchProduct(id)
      .then(setProduct)
      .catch(() => navigate(ROUTES.products))
      .finally(() => setLoading(false))
  }, [id, fetchProduct, navigate])

  const handleDelete = async () => {
    await deleteProduct(id)
    navigate(ROUTES.products)
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-40 bg-gray-100 rounded-xl" />
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(ROUTES.products)}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            ← Volver a productos
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{formatCOP(product.price * product.quantity)}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(ROUTES.editProduct(product.id))}
          >
            Editar
          </Button>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            Eliminar
          </Button>
        </div>
      </div>

      <ProductDetails product={product} />

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Eliminar producto"
      >
        <p className="text-gray-600 text-sm">
          ¿Está seguro de que desea eliminar <strong>{product.name}</strong>? Esta acción no se
          puede deshacer.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  )
}