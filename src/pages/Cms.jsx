import { GripVertical } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getSection, updateSection } from '../api/cms'
import MediaUploadField from '../components/cms/MediaUploadField'
import CmsAutoSaveStatus from '../components/cms/CmsAutoSaveStatus'
import { useAutoSave } from '../hooks/useAutoSave'
import { resolveMediaUrl } from '../utils/media'
import defaultEcoLiving from '../assets/categories/cat_eco-living.png'
import defaultHome from '../assets/categories/cat_home.png'
import defaultKids from '../assets/categories/cat_kids.png'
import defaultMen from '../assets/categories/cat_men.png'
import defaultWomen from '../assets/categories/cat_women.png'
import defaultHero from '../assets/sections/hero.png'

const DEFAULT_IMAGES = {
  men: defaultMen,
  women: defaultWomen,
  kids: defaultKids,
  home: defaultHome,
  'eco-living': defaultEcoLiving,
}

const DEFAULT_CATEGORIES = [
  { id: 'men', label: 'MEN', imageUrl: null },
  { id: 'women', label: 'WOMEN', imageUrl: null },
  { id: 'kids', label: 'KIDS', imageUrl: null },
  { id: 'home', label: 'HOME', imageUrl: null },
  { id: 'eco-living', label: 'ECO-LIVING', imageUrl: null },
]

function PreviewImage({ url, defaultSrc, label }) {
  return (
    <img
      src={url ? resolveMediaUrl(url) : defaultSrc}
      alt={label || 'Preview'}
      draggable={false}
      className="aspect-[262/378] w-full rounded-lg object-cover"
    />
  )
}

function Cms() {
  const [loading, setLoading] = useState(true)

  const [logoUrl, setLogoUrl] = useState(null)
  const [heroType, setHeroType] = useState('image')
  const [heroUrl, setHeroUrl] = useState(null)
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)

  const dragIndex = useRef(null)
  const overIndex = useRef(null)

  useEffect(() => {
    Promise.all([getSection('logo'), getSection('hero'), getSection('shopByCategory')])
      .then(([logo, hero, shop]) => {
        if (logo?.url) setLogoUrl(logo.url)
        if (hero?.url) {
          setHeroUrl(hero.url)
          setHeroType(hero.type || 'image')
        }
        if (shop?.items?.length) setCategories(shop.items)
      })
      .finally(() => setLoading(false))
  }, [])

  // Each section auto-saves independently — editing the hero shouldn't wait
  // on (or accidentally re-save) the logo or category tiles.
  const logoStatus = useAutoSave((v) => updateSection('logo', v), { url: logoUrl }, { skip: loading })
  const heroStatus = useAutoSave(
    (v) => updateSection('hero', v),
    { type: heroType, url: heroUrl },
    { skip: loading },
  )
  const categoryStatus = useAutoSave(
    (v) => updateSection('shopByCategory', v),
    { items: categories },
    { skip: loading },
  )

  const handleDragStart = (index) => (e) => {
    dragIndex.current = index
    // Firefox refuses to start a drag at all unless dataTransfer carries
    // data — Chrome is lenient about this but Firefox is not, so this is
    // required for the feature to work cross-browser, not just cosmetic.
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }
  const handleDragEnter = (index) => () => {
    overIndex.current = index
  }
  const handleDragEnd = () => {
    if (dragIndex.current === null || overIndex.current === null) return
    setCategories((prev) => {
      const next = [...prev]
      const [moved] = next.splice(dragIndex.current, 1)
      next.splice(overIndex.current, 0, moved)
      return next
    })
    dragIndex.current = null
    overIndex.current = null
  }

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading...</div>

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">CMS</h1>

      {/* LOGO */}
      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Logo</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <MediaUploadField label="Upload" accept="image/*" onUploaded={setLogoUrl} />
            {!logoUrl && (
              <p className="mt-2 text-xs text-gray-400">No custom logo uploaded — currently showing the default "mellow" wordmark below.</p>
            )}
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-700">Preview</p>
            {logoUrl ? (
              <img src={resolveMediaUrl(logoUrl)} alt="Logo preview" className="h-14 w-auto" />
            ) : (
              <div className="flex h-14 items-center gap-2 text-xl font-bold text-[#0F1E3D]">mellow</div>
            )}
          </div>
        </div>
        <CmsAutoSaveStatus status={logoStatus} />
      </section>

      {/* HERO */}
      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Hero Section</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <div className="flex gap-2">
              {['image', 'video'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setHeroType(t)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize ${
                    heroType === t ? 'bg-[#003B95] text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <MediaUploadField
              accept={heroType === 'video' ? 'video/*' : 'image/*'}
              onUploaded={setHeroUrl}
              buttonLabel={`Upload ${heroType}`}
            />
            {!heroUrl && <p className="text-xs text-gray-400">No custom hero uploaded — currently showing the default banner below.</p>}
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-700">Preview</p>
            {heroUrl && heroType === 'video' ? (
              <video src={resolveMediaUrl(heroUrl)} className="w-full rounded-lg" controls muted />
            ) : (
              <img
                src={heroUrl ? resolveMediaUrl(heroUrl) : defaultHero}
                alt="Hero preview"
                className="w-full rounded-lg object-cover"
              />
            )}
          </div>
        </div>
        <CmsAutoSaveStatus status={heroStatus} />
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-1 text-base font-semibold text-gray-900">Shop by Category</h2>
        <p className="mb-4 text-xs text-gray-400">Drag tiles to reorder. This order is used on the homepage.</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              draggable
              onDragStart={handleDragStart(index)}
              onDragEnter={handleDragEnter(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => e.preventDefault()}
              onDragEnd={handleDragEnd}
              className="cursor-grab rounded-lg border border-gray-200 p-2 active:cursor-grabbing"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">{cat.label}</span>
                <GripVertical className="h-3.5 w-3.5 text-gray-300" />
              </div>
              <PreviewImage url={cat.imageUrl} defaultSrc={DEFAULT_IMAGES[cat.id]} label={cat.label} />
              <div className="mt-2">
                <MediaUploadField
                  accept="image/*"
                  buttonLabel="Change image"
                  onUploaded={(url) =>
                    setCategories((prev) => prev.map((c) => (c.id === cat.id ? { ...c, imageUrl: url } : c)))
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <CmsAutoSaveStatus status={categoryStatus} />
      </section>
    </div>
  )
}

export default Cms
