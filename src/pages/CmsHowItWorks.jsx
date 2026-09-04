import { useEffect, useState } from 'react'
import { getSection, updateSection } from '../api/cms'
import CmsAutoSaveStatus from '../components/cms/CmsAutoSaveStatus'
import MediaUploadField from '../components/cms/MediaUploadField'
import { useAutoSave } from '../hooks/useAutoSave'
import { resolveMediaUrl } from '../utils/media'
import defaultChooseBetter from '../assets/sections/how_choose-better.png'
import defaultUseItLonger from '../assets/sections/how_use-it-longer.png'
import defaultRepairReuse from '../assets/sections/how_repair-reuse.png'

// Pre-filled with the copy actually live on the site today, so the admin
// sees real current content rather than blank fields on first visit.
const DEFAULT_STEPS = [
  {
    title: 'Choose Better',
    desc: 'Thoughtfully made products using natural, low-impact and plastic-free materials wherever possible.',
    imageUrl: null,
    defaultImg: defaultChooseBetter,
  },
  {
    title: 'Use It Longer',
    desc: 'Durable products designed to stay with you for years, not months.',
    imageUrl: null,
    defaultImg: defaultUseItLonger,
  },
  {
    title: 'Repair. Reuse. Waste Less.',
    desc: 'When something wears out, repair or restore it instead of replacing it.',
    imageUrl: null,
    defaultImg: defaultRepairReuse,
  },
]

function CmsHowItWorks() {
  const [steps, setSteps] = useState(DEFAULT_STEPS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSection('howItWorks')
      .then((data) => {
        if (data?.steps?.length) {
          // Saved docs only carry title/desc/imageUrl — reattach each
          // step's local default image so an unset field still previews
          // the real current site photo, not a generic placeholder icon.
          setSteps((prev) => data.steps.map((s, i) => ({ ...s, defaultImg: prev[i]?.defaultImg })))
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const updateStep = (i, field, value) =>
    setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)))

  // defaultImg is a local admin-only reference (a bundled asset path) — strip
  // it before persisting so it never leaks into the saved document.
  const cleanSteps = steps.map(({ title, desc, imageUrl }) => ({ title, desc, imageUrl }))
  const status = useAutoSave((v) => updateSection('howItWorks', { steps: v }), cleanSteps, { skip: loading })

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading...</div>

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">How It Works</h1>

      <div className="space-y-6">
        {steps.map((step, i) => (
          <section key={i} className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold text-gray-500">Step {i + 1}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-700">Title</p>
                  <input
                    value={step.title}
                    onChange={(e) => updateStep(i, 'title', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#003B95] focus:outline-none"
                  />
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-700">Description</p>
                  <textarea
                    value={step.desc}
                    onChange={(e) => updateStep(i, 'desc', e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#003B95] focus:outline-none"
                  />
                </div>
                <MediaUploadField
                  label="Image"
                  buttonLabel="Change image"
                  onUploaded={(url) => updateStep(i, 'imageUrl', url)}
                />
              </div>
              <div>
                <p className="mb-1.5 text-sm font-medium text-gray-700">Preview</p>
                <div className="flex flex-col items-center rounded-lg bg-[#013485] p-6 text-center text-white">
                  <img
                    src={step.imageUrl ? resolveMediaUrl(step.imageUrl) : step.defaultImg}
                    alt={step.title}
                    className="mb-4 h-28 w-28 rounded-2xl object-cover"
                  />
                  <h3 className="mb-1 text-sm font-bold">{step.title}</h3>
                  <p className="max-w-xs text-xs text-blue-100">{step.desc}</p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <CmsAutoSaveStatus status={status} />
    </div>
  )
}

export default CmsHowItWorks
