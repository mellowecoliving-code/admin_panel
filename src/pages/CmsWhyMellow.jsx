import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getSection, updateSection } from '../api/cms'
import CmsAutoSaveStatus from '../components/cms/CmsAutoSaveStatus'
import MediaUploadField from '../components/cms/MediaUploadField'
import { useAutoSave } from '../hooks/useAutoSave'
import { resolveMediaUrl } from '../utils/media'
import defaultBackground from '../assets/sections/why_mellow_bg.png'

const DEFAULT_BADGES = [
  { label: 'Organic Cotton', sub: '100% Handwoven' },
  { label: 'Organic Cotton', sub: '100% Handwoven' },
  { label: 'Organic Cotton', sub: '100% Handwoven' },
  { label: 'Naturally Dyed', sub: 'From Plants and Fruits' },
]
const DEFAULT_TAGLINE = '0% Toxins. 100% Love'

function CmsWhyMellow() {
  const [backgroundUrl, setBackgroundUrl] = useState(null)
  const [badges, setBadges] = useState(DEFAULT_BADGES)
  const [tagline, setTagline] = useState(DEFAULT_TAGLINE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSection('whyMellow')
      .then((data) => {
        if (data?.backgroundUrl) setBackgroundUrl(data.backgroundUrl)
        if (data?.badges?.length) setBadges(data.badges)
        if (data?.tagline) setTagline(data.tagline)
      })
      .finally(() => setLoading(false))
  }, [])

  const updateBadge = (i, field, value) =>
    setBadges((prev) => prev.map((b, idx) => (idx === i ? { ...b, [field]: value } : b)))
  const addBadge = () => setBadges((prev) => [...prev, { label: '', sub: '' }])
  const removeBadge = (i) => setBadges((prev) => prev.filter((_, idx) => idx !== i))

  const status = useAutoSave(
    (v) => updateSection('whyMellow', v),
    { backgroundUrl, badges, tagline },
    { skip: loading },
  )

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading...</div>

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Why Mellow</h1>

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Background</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <MediaUploadField accept="image/*" buttonLabel="Change background" onUploaded={setBackgroundUrl} />
          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-700">Preview</p>
            <img
              src={backgroundUrl ? resolveMediaUrl(backgroundUrl) : defaultBackground}
              alt="Background preview"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Badges</h2>
          <button
            type="button"
            onClick={addBadge}
            className="flex items-center gap-1 text-xs font-medium text-[#013485] hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Add badge
          </button>
        </div>
        <div className="space-y-3">
          {badges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={badge.sub}
                onChange={(e) => updateBadge(i, 'sub', e.target.value)}
                placeholder="Subtitle (e.g. 100% Handwoven)"
                className="w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#003B95] focus:outline-none"
              />
              <input
                value={badge.label}
                onChange={(e) => updateBadge(i, 'label', e.target.value)}
                placeholder="Label (e.g. Organic Cotton)"
                className="w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#003B95] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeBadge(i)}
                className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <p className="mb-1.5 text-sm font-medium text-gray-700">Tagline</p>
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#003B95] focus:outline-none"
        />
      </section>

      <CmsAutoSaveStatus status={status} />
    </div>
  )
}

export default CmsWhyMellow
