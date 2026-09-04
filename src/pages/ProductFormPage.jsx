import { ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createProduct, getProduct, updateProduct } from '../api/products'
import ProductForm from '../components/ProductForm'

function ProductFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEditing) return
    getProduct(id)
      .then(setProduct)
      .catch(() => setError('Failed to load product.'))
      .finally(() => setLoading(false))
  }, [id, isEditing])

  const handleSubmit = async (data) => {
    setSubmitting(true)
    setError('')
    try {
      if (isEditing) {
        await updateProduct(id, data)
      } else {
        await createProduct(data)
      }
      navigate('/products')
    } catch (err) {
      setError('Failed to save product.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <button
        type="button"
        onClick={() => navigate('/products')}
        className="mb-4 flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Product Management
      </button>

      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        {isEditing ? 'Edit Product' : 'Add Product'}
      </h1>

      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-500">Loading product...</p>
      ) : (
        <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6">
          <ProductForm
            initial={product}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/products')}
            submitting={submitting}
          />
        </div>
      )}
    </div>
  )
}

export default ProductFormPage
