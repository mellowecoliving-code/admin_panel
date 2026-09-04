import { Package, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteProduct, getProducts } from '../api/products'
import ConfirmDialog from '../components/ConfirmDialog'
import Pagination from '../components/Pagination'
import { resolveMediaUrl } from '../utils/media'

function ProductManagement() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [showBulkConfirm, setShowBulkConfirm] = useState(false)

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try {
      // limit is generous because this page still paginates client-side over
      // the full set (see `paginatedData` below) — the backend itself now
      // supports real page/limit params for whenever that's worth wiring up.
      const data = await getProducts({ limit: 500 })
      setProducts(data.products)
    } catch (err) {
      setError('Failed to load products. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
    setSelected(new Set())
  }, [search])

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const pageIds = paginatedData.map((p) => p._id)
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id))
  const somePageSelected = pageIds.some((id) => selected.has(id))

  const toggleSelectAll = () => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allPageSelected) {
        pageIds.forEach((id) => next.delete(id))
      } else {
        pageIds.forEach((id) => next.add(id))
      }
      return next
    })
  }

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const openAddForm = () => navigate('/products/new')
  const openEditForm = (product) => navigate(`/products/${product._id}/edit`)

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteTarget._id)
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err) {
      setError('Failed to delete product.')
    }
  }

  const handleBulkDelete = async () => {
    try {
      await Promise.all([...selected].map((id) => deleteProduct(id)))
      setProducts((prev) => prev.filter((p) => !selected.has(p._id)))
      setSelected(new Set())
      setShowBulkConfirm(false)
    } catch (err) {
      setError('Failed to delete some products.')
      setShowBulkConfirm(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Product Management</h1>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <button
              type="button"
              onClick={() => setShowBulkConfirm(true)}
              className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
              <span className="ml-1 rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold">
                {selected.size}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={openAddForm}
            className="flex items-center gap-2 rounded-md bg-[#003B95] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B3B95]"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 sm:w-80">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full text-sm focus:outline-none"
        />
      </div>

      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-500">Loading products...</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-gray-300 py-16 text-gray-400">
          <Package className="h-8 w-8" />
          <p className="text-sm">No products found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    ref={(el) => { if (el) el.indeterminate = somePageSelected && !allPageSelected }}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 cursor-pointer accent-[#003B95]"
                    aria-label="Select all on this page"
                  />
                </th>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Tags</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((product, index) => {
                const rawImg = product.images?.[0] || product.image || null
                const imgSrc = rawImg ? resolveMediaUrl(rawImg) : null
                return (
                  <tr
                    key={product._id}
                    className={`hover:bg-gray-50 ${selected.has(product._id) ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(product._id)}
                        onChange={() => toggleSelect(product._id)}
                        className="h-4 w-4 rounded border-gray-300 cursor-pointer accent-[#003B95]"
                        aria-label={`Select ${product.name}`}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-4 py-3">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <Package className="h-4 w-4 text-gray-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-gray-600">{product.category}</td>
                    <td className="px-4 py-3 text-gray-600">₹{product.price.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {product.stock <= 0 ? (
                        <span className="text-red-600">Out of stock</span>
                      ) : (
                        product.stock
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {product.isBestSeller && (
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                            Best Seller
                          </span>
                        )}
                        {product.isNewArrival && (
                          <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">
                            New
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => openEditForm(product)} aria-label="Edit">
                          <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-900" />
                        </button>
                        <button type="button" onClick={() => setDeleteTarget(product)} aria-label="Delete">
                          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {showBulkConfirm && (
        <ConfirmDialog
          title="Delete Selected Products"
          message={`Are you sure you want to delete ${selected.size} selected product${selected.size > 1 ? 's' : ''}? This cannot be undone.`}
          confirmLabel={`Delete ${selected.size}`}
          onConfirm={handleBulkDelete}
          onCancel={() => setShowBulkConfirm(false)}
        />
      )}
    </div>
  )
}

export default ProductManagement
