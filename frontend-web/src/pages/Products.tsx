import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { useEffect, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { Button } from '@/components/common/Button'
import { Pagination } from '@/components/common/Pagination'
import { ProductList } from '@/components/products/ProductList'
import { ROUTES } from '@/utils/constants'

export const Products: FC = () => {
  const navigate = useNavigate()
  const { products, total, totalPages, page, isLoading, setFilter, fetchProducts } = useProducts()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    void fetchProducts({ search: debouncedSearch, page: 1 })
  }, [fetchProducts, debouncedSearch])

  const handlePageChange = (p: number) => {
    void fetchProducts({ page: p })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-500 text-sm mt-1">{total} producto(s) registrados</p>
        </div>
        <Button onClick={() => navigate(ROUTES.createProduct)}>Nuevo producto</Button>
      </div>

      <div className="w-full sm:max-w-xs">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Buscar productos"
        />
      </div>

      <ProductList
        products={products}
        isLoading={isLoading}
        onView={(id) => navigate(ROUTES.productDetail(id))}
      />

      <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
    </div>
  )
}