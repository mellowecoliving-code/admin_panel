import { useState } from 'react'

const CATEGORIES = ['Women', 'Men', 'Kids', 'Home', 'Eco-Living']

function ProductForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    price: initial?.price ?? '',
    category: initial?.category || CATEGORIES[0],
    image: initial?.image || '',
    stock: initial?.stock ?? 0,
    isBestSeller: initial?.isBestSeller || false,
    isNewArrival: initial?.isNewArrival || false,
  })
  const [error, setError] = useState('')

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || form.price === '' || Number(form.price) < 0) {
      setError('Name and a valid price are required.')
      return
    }
    setError('')
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          value={form.name}
          onChange={handleChange('name')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={form.description}
          onChange={handleChange('description')}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Price (₹)</label>
          <input
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange('price')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange('stock')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
        <select
          value={form.category}
          onChange={handleChange('category')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="text"
          value={form.image}
          onChange={handleChange('image')}
          placeholder="https://..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.isBestSeller} onChange={handleChange('isBestSeller')} />
          Best Seller
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.isNewArrival} onChange={handleChange('isNewArrival')} />
          New Arrival
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-[#003B95] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B3B95] disabled:opacity-50"
        >
          {submitting ? 'Saving...' : initial ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
