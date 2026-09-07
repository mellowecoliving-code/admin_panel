import { ChevronDown, Plus, Star, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import MediaUploadField from './cms/MediaUploadField'
import { resolveMediaUrl } from '../utils/media'

const CATEGORIES = ['Women', 'Men', 'Kids', 'Home', 'Eco-Living']
const CATEGORY_PREFIX = { Women: 'WOM', Men: 'MEN', Kids: 'KID', Home: 'HOM', 'Eco-Living': 'ECO' }
const COLORS = [
  { name: 'Black', swatch: '#000000' },
  { name: 'White', swatch: '#ffffff' },
  { name: 'Grey', swatch: '#9e9e9e' },
  { name: 'Beige', swatch: '#e8dcc4' },
  { name: 'Brown', swatch: '#795548' },
  { name: 'Red', swatch: '#e53935' },
  { name: 'Maroon', swatch: '#800000' },
  { name: 'Pink', swatch: '#ec407a' },
  { name: 'Orange', swatch: '#fb8c00' },
  { name: 'Yellow', swatch: '#fdd835' },
  { name: 'Green', swatch: '#43a047' },
  { name: 'Olive', swatch: '#808000' },
  { name: 'Teal', swatch: '#00897b' },
  { name: 'Blue', swatch: '#1e88e5' },
  { name: 'Navy', swatch: '#001f3f' },
  { name: 'Purple', swatch: '#8e24aa' },
  { name: 'Multicolor', swatch: 'linear-gradient(135deg, #e53935, #fdd835, #43a047, #1e88e5)' },
]

function ColorSwatch({ color, className = '' }) {
  const style = color ? { background: color.swatch } : undefined
  return (
    <span
      className={`inline-block h-3.5 w-3.5 shrink-0 rounded-full border border-gray-300 ${className}`}
      style={style}
    />
  )
}

function VariantColorSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = COLORS.find((c) => c.name === value) || null

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} className="relative w-28">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-1.5 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-900 focus:outline-none"
      >
        {selected && <ColorSwatch color={selected} />}
        <span className={`truncate ${selected ? 'text-gray-900' : 'text-gray-400'}`}>{value || 'Color'}</span>
        <ChevronDown className="ml-auto h-3.5 w-3.5 shrink-0 text-gray-400" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-10 mt-1 max-h-56 w-40 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => {
                onChange(c.name)
                setOpen(false)
              }}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${
                value === c.name ? 'bg-gray-50 font-medium text-gray-900' : 'text-gray-700'
              }`}
            >
              <ColorSwatch color={c} />
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Mirrors server/models/Product.js's SUBCATEGORIES_BY_CATEGORY — Home and
// Eco-Living use a completely different set from Women/Men/Kids, so this
// can't be a single flat list.
const SUBCATEGORIES_BY_CATEGORY = {
  Women: ['Clothing', 'Nightwear', 'Innerwear', 'Activewear', 'Footwear', 'Bags', 'Accessories'],
  Men: ['Clothing', 'Nightwear', 'Innerwear', 'Activewear', 'Footwear', 'Bags', 'Accessories'],
  Kids: ['Clothing', 'Nightwear', 'Innerwear', 'Activewear', 'Footwear', 'Toys', 'Stationery', 'Accessories', 'Bags'],
  Home: [
    'Home Furnishing',
    'Kitchen & Dining',
    'Home Décor',
    'Storage & Organisation',
    'Bath & Laundry',
    'Cleaning Essentials',
    'Garden & Outdoor',
  ],
  'Eco-Living': [
    'Personal care',
    'Waste Management',
    'Composting & Gardening',
    'Eco Packaging',
    'Reusable Essentials',
    'Water & Energy Saving',
    'Office & Stationery',
    'Gifts',
    'Celebrations',
  ],
}

// Mirrors server/models/Product.js's SUBTABS_BY_SUBCATEGORY — only these
// four category/subcategory pairs have a confirmed tab list (from Figma);
// everything else just shows a plain text input since there's no known set
// to pick from yet.
const SUBTABS_BY_SUBCATEGORY = {
  Women: {
    Clothing: ['All', 'Ethnics', 'Co-ord set', 'Tunics', 'Pants'],
    Footwear: ['All', 'Flats', 'Sandals', 'Loafers', 'Sneakers'],
  },
  Men: {
    Clothing: ['All', 'Shirts', 'Trousers', 'Co-ords'],
    Innerwear: ['All', 'Boxer', 'Brief', 'Vest'],
  },
}

// Mirrors server/models/Product.js's FABRIC_TYPES.
const FABRIC_TYPES = [
  'Cotton',
  '100% Cotton',
  '100% Linen',
  'Bamboo',
  '100% Organic Cotton',
  'Modal',
  'Linen Blend',
  'Cotton Stretch',
]

function ProductForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    price: initial?.price ?? '',
    compareAtPrice: initial?.compareAtPrice ?? '',
    taxInclusive: initial?.taxInclusive ?? true,
    hsnCode: initial?.hsnCode || '',
    category: initial?.category || CATEGORIES[0],
    subcategory: initial?.subcategory || '',
    subTab: initial?.subTab || '',
    fabricType: initial?.fabricType || '',
    images: initial?.images?.length ? initial.images : initial?.image ? [initial.image] : [],
    coverImageIndex: initial?.coverImageIndex || 0,
    stock: initial?.stock ?? 0,
    weight: initial?.weight ?? '',
    tags: initial?.tags?.join(', ') || '',
    isActive: initial?.isActive ?? true,
    isBestSeller: initial?.isBestSeller || false,
    isNewArrival: initial?.isNewArrival || false,
    variants: initial?.variants?.length ? initial.variants : [],
    colorImages: initial?.colorImages || [],
  })
  const [error, setError] = useState('')

  const hasVariants = form.variants.length > 0
  const totalVariantStock = form.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
  const subcategoryOptions = SUBCATEGORIES_BY_CATEGORY[form.category] || []
  const subTabOptions = SUBTABS_BY_SUBCATEGORY[form.category]?.[form.subcategory] || []
  // Every distinct color currently used across variant rows — Grey/S,
  // Grey/M, Grey/L collapse to one "Grey" entry here, since photos are
  // shared per color, not per exact size+color combo.
  const usedColors = useMemo(
    () => [...new Set(form.variants.map((v) => v.color).filter(Boolean))],
    [form.variants],
  )

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCategoryChange = (e) => {
    const category = e.target.value
    setForm((prev) => ({
      ...prev,
      category,
      subcategory: (SUBCATEGORIES_BY_CATEGORY[category] || []).includes(prev.subcategory) ? prev.subcategory : '',
      subTab: '',
    }))
  }

  const handleSubcategoryChange = (e) => {
    const subcategory = e.target.value
    setForm((prev) => ({ ...prev, subcategory, subTab: '' }))
  }

  const addImage = (url) => setForm((prev) => ({ ...prev, images: [...prev.images, url] }))
  const removeImage = (i) =>
    setForm((prev) => {
      const images = prev.images.filter((_, idx) => idx !== i)
      // Keep the cover pointer pointing at the same photo it did before the
      // removal, shifting down for anything that came after it; reset to
      // the first image if the cover itself was the one removed.
      let coverImageIndex = prev.coverImageIndex
      if (i < coverImageIndex) coverImageIndex -= 1
      else if (i === coverImageIndex) coverImageIndex = 0
      return { ...prev, images, coverImageIndex }
    })

  const genVariantSku = (category) => {
    const prefix = CATEGORY_PREFIX[category] || 'GEN'
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase()
    return `${prefix}-VAR-${suffix}`
  }

  const addVariant = () =>
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: '', color: '', stock: 0, sku: genVariantSku(prev.category) }],
    }))
  const updateVariant = (i, field, value) =>
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)),
    }))
  const removeVariant = (i) =>
    setForm((prev) => ({ ...prev, variants: prev.variants.filter((_, idx) => idx !== i) }))

  const colorImagesFor = (color) => form.colorImages.find((g) => g.color === color)?.images || []
  const addColorImage = (color, url) =>
    setForm((prev) => {
      const existing = prev.colorImages.find((g) => g.color === color)
      const colorImages = existing
        ? prev.colorImages.map((g) => (g.color === color ? { ...g, images: [...g.images, url] } : g))
        : [...prev.colorImages, { color, images: [url] }]
      return { ...prev, colorImages }
    })
  const removeColorImage = (color, i) =>
    setForm((prev) => ({
      ...prev,
      colorImages: prev.colorImages.map((g) =>
        g.color === color ? { ...g, images: g.images.filter((_, idx) => idx !== i) } : g,
      ),
    }))

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
      // Drop color-image groups for colors no longer used by any variant
      // (e.g. the last "Grey" row was deleted) so orphaned entries don't
      // pile up silently.
      colorImages: form.colorImages.filter((g) => usedColors.includes(g.color)),
      // Keep `image` (singular) populated too — the admin table thumbnail
      // and any other old reader still expects it.
      image: form.images[form.coverImageIndex] || form.images[0] || '',
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
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
              rows={5}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Images</label>
            <div className="mb-2 flex flex-wrap gap-2">
              {form.images.map((url, i) => {
                const isCover = i === form.coverImageIndex
                return (
                  <div key={i} className="relative">
                    <img
                      src={resolveMediaUrl(url)}
                      alt={`Product ${i + 1}`}
                      className={`h-20 w-20 rounded-md border object-cover ${
                        isCover ? 'border-2 border-[#013485]' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, coverImageIndex: i }))}
                      aria-label={isCover ? 'Cover image' : 'Set as cover image'}
                      title={isCover ? 'Cover image' : 'Set as cover image'}
                      className={`absolute -bottom-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full shadow ${
                        isCover ? 'bg-[#013485] text-white' : 'bg-white text-gray-400 hover:text-[#013485]'
                      }`}
                    >
                      <Star className="h-3 w-3" fill={isCover ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      aria-label="Remove image"
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-gray-500 shadow hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )
              })}
            </div>
            <MediaUploadField accept="image/*" buttonLabel="Add image" onUploaded={addImage} />
            {form.images.length === 0 ? (
              <p className="mt-1 text-xs text-gray-400">No images uploaded yet — the first one becomes the main thumbnail.</p>
            ) : (
              <p className="mt-1 text-xs text-gray-400">
                Click the star on a photo to make it the listing thumbnail.
              </p>
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
                    <VariantColorSelect value={v.color} onChange={(color) => updateVariant(i, 'color', color)} />
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
                      placeholder="Variant SKU (auto-generated, editable)"
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

          {usedColors.length > 0 && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Color Images <span className="font-normal text-gray-400">optional — shown when a shopper picks that color</span>
              </label>
              <div className="space-y-3 rounded-md border border-gray-200 p-3">
                {usedColors.map((color) => {
                  const images = colorImagesFor(color)
                  const swatch = COLORS.find((c) => c.name === color)
                  return (
                    <div key={color} className="flex items-start gap-3">
                      <div className="flex w-24 shrink-0 items-center gap-1.5 pt-1.5 text-sm text-gray-700">
                        {swatch && <ColorSwatch color={swatch} />}
                        <span className="truncate">{color}</span>
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap gap-2">
                          {images.map((url, i) => (
                            <div key={i} className="relative">
                              <img
                                src={resolveMediaUrl(url)}
                                alt={`${color} ${i + 1}`}
                                className="h-16 w-16 rounded-md border border-gray-200 object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeColorImage(color, i)}
                                aria-label={`Remove ${color} image`}
                                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-gray-500 shadow hover:text-red-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <MediaUploadField
                          accept="image/*"
                          buttonLabel={`Add ${color} image`}
                          onUploaded={(url) => addColorImage(color, url)}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Shared across every size in that color. Leave a color with no images and it just shows the product's
                normal photos instead.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-md border border-gray-200 p-4 space-y-4">
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
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                HSN Code <span className="font-normal text-gray-400">for GST filing</span>
              </label>
              <input
                type="text"
                value={form.hsnCode}
                onChange={handleChange('hsnCode')}
                placeholder="e.g. 6104"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.taxInclusive} onChange={handleChange('taxInclusive')} className="rounded" />
              Price includes GST
            </label>
          </div>

          <div className="rounded-md border border-gray-200 p-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Stock {hasVariants && <span className="font-normal text-gray-400">(sum of variants)</span>}
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
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
              <select
                value={form.category}
                onChange={handleCategoryChange}
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
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Subcategory <span className="font-normal text-gray-400">optional</span>
              </label>
              <select
                value={form.subcategory}
                onChange={handleSubcategoryChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
              >
                <option value="">None</option>
                {subcategoryOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {subTabOptions.length > 0 && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Sub-tab <span className="font-normal text-gray-400">optional — which tab this shows under</span>
                </label>
                <select
                  value={form.subTab}
                  onChange={handleChange('subTab')}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
                >
                  <option value="">None</option>
                  {subTabOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Fabric Type <span className="font-normal text-gray-400">optional</span>
              </label>
              <select
                value={form.fabricType}
                onChange={handleChange('fabricType')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
              >
                <option value="">None</option>
                {FABRIC_TYPES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 p-4 space-y-3">
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
        </div>
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
