import { Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import MediaUploadField from './cms/MediaUploadField'
import { resolveMediaUrl } from '../utils/media'

const CATEGORIES = ['Women', 'Men', 'Kids', 'Home', 'Eco-Living']

function ProductForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    price: initial?.price ?? '',
    compareAtPrice: initial?.compareAtPrice ?? '',
    category: initial?.category || CATEGORIES[0],
    images: initial?.images?.length ? initial.images : initial?.image ? [initial.image] : [],
    stock: initial?.stock ?? 0,
    weight: initial?.weight ?? '',
    tags: initial?.tags?.join(', ') || '',
    isActive: initial?.isActive ?? true,
    isBestSeller: initial?.isBestSeller || false,
    isNewArrival: initial?.isNewArrival || false,
    variants: initial?.variants?.length ? initial.variants : [],
  })
  const [error, setError] = useState('')

  const hasVariants = form.variants.length > 0
  const totalVariantStock = form.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const addImage = (url) => setForm((prev) => ({ ...prev, images: [...prev.images, url] }))
  const removeImage = (i) => setForm((prev) => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))

  const addVariant = () =>
    setForm((prev) => ({ ...prev, variants: [...prev.variants, { size: '', color: '', stock: 0, sku: '' }] }))
  const updateVariant = (i, field, value) =>
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)),
    }))
  const removeVariant = (i) =>
    setForm((prev) => ({ ...prev, variants: prev.variants.filter((_, idx) => idx !== i) }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || form.price === '' || Number(form.price) < 0) {
      setError('Name and a valid price are required.')
      return
    }
    if (form.compareAtPrice !== '' && Number(form.compareAtPrice) <= Number(form.price)) {
      setError('Compare-at price must be higher than the actual price, or left blank.')
      return
    }
    setError('')
    onSubmit({
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice === '' ? undefined : Number(form.compareAtPrice),
      stock: hasVariants ? totalVariantStock : Number(form.stock) || 0,
      weight: form.weight === '' ? 0 : Number(form.weight),
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      // Keep `image` (singular) populated too — the admin table thumbnail
      // and any other old reader still expects it.
      image: form.images[0] || '',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {initial?.sku && (
        <p className="text-xs text-gray-400">
          SKU <span className="font-mono text-gray-600">{initial.sku}</span>
          {initial?.slug && (
            <>
              {' · '}Slug <span className="font-mono text-gray-600">{initial.slug}</span>
            </>
          )}
          {' · auto-generated, not editable'}
        </p>
      )}

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
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Compare-at Price (₹) <span className="font-normal text-gray-400">optional</span>
          </label>
          <input
            type="number"
            min="0"
            value={form.compareAtPrice}
            onChange={handleChange('compareAtPrice')}
            placeholder="Shown as a strikethrough"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Stock {hasVariants && <span className="font-normal text-gray-400">(sum of variants below)</span>}
          </label>
          <input
            type="number"
            min="0"
            disabled={hasVariants}
            value={hasVariants ? totalVariantStock : form.stock}
            onChange={handleChange('stock')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Weight (g) <span className="font-normal text-gray-400">for shipping</span>
          </label>
          <input
            type="number"
            min="0"
            value={form.weight}
            onChange={handleChange('weight')}
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
        <label className="mb-1 block text-sm font-medium text-gray-700">Images</label>
        <div className="mb-2 flex flex-wrap gap-2">
          {form.images.map((url, i) => (
            <div key={i} className="relative">
              <img
                src={resolveMediaUrl(url)}
                alt={`Product ${i + 1}`}
                className="h-20 w-20 rounded-md border border-gray-200 object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label="Remove image"
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-gray-500 shadow hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <MediaUploadField accept="image/*" buttonLabel="Add image" onUploaded={addImage} />
        {form.images.length === 0 && (
          <p className="mt-1 text-xs text-gray-400">No images uploaded yet — the first one becomes the main thumbnail.</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Tags <span className="font-normal text-gray-400">comma-separated</span>
        </label>
        <input
          type="text"
          value={form.tags}
          onChange={handleChange('tags')}
          placeholder="organic, handwoven, bestseller"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Variants <span className="font-normal text-gray-400">optional — size/color with per-variant stock</span>
          </label>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1 text-xs font-medium text-[#013485] hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Add variant
          </button>
        </div>
        {form.variants.length > 0 && (
          <div className="space-y-2 rounded-md border border-gray-200 p-3">
            {form.variants.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={v.size}
                  onChange={(e) => updateVariant(i, 'size', e.target.value)}
                  placeholder="Size"
                  className="w-20 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-900 focus:outline-none"
                />
                <input
                  value={v.color}
                  onChange={(e) => updateVariant(i, 'color', e.target.value)}
                  placeholder="Color"
                  className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-900 focus:outline-none"
                />
                <input
                  type="number"
                  min="0"
                  value={v.stock}
                  onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                  placeholder="Stock"
                  className="w-20 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-900 focus:outline-none"
                />
                <input
                  value={v.sku}
                  onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                  placeholder="Variant SKU (optional)"
                  className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.isActive} onChange={handleChange('isActive')} />
          Active <span className="text-gray-400">(visible, not hidden)</span>
        </label>
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
