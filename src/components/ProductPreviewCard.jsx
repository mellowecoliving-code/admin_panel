import { Heart, Plus } from 'lucide-react'
import { resolveMediaUrl } from '../utils/media'

// A read-only approximation of the real storefront ProductCard, so an admin
// can see roughly what a shopper will see as they edit — not a pixel-exact
// copy of client/src/components/ProductCard.jsx (separate app, no shared
// package), just the same layout/fields.
function ProductPreviewCard({ form }) {
  const price = Number(form.price) || 0
  const compareAtPrice = Number(form.compareAtPrice) || 0
  const coverImage = form.images[form.coverImageIndex] || form.images[0]

  return (
    <div className="w-full max-w-[220px]">
      <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500">Storefront preview</p>
      <div className="relative">
        <div className="aspect-[397/466] w-full overflow-hidden rounded-2xl bg-gray-100">
          {coverImage ? (
            <img src={resolveMediaUrl(coverImage)} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No image yet</div>
          )}
        </div>
        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow">
          <Heart className="h-3.5 w-3.5 text-gray-700" />
        </span>
      </div>
      <div className="mt-3">
        <p className="truncate text-sm text-gray-800">{form.name || 'Product name'}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-gray-900">₹{price.toLocaleString('en-IN')}</span>
            {compareAtPrice > price && (
              <span className="text-xs text-gray-400 line-through">₹{compareAtPrice.toLocaleString('en-IN')}</span>
            )}
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#013485] text-white">
            <Plus className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductPreviewCard
