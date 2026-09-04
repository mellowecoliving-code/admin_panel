import { useEffect, useState } from 'react'
import { getSection, updateSection } from '../api/cms'
import CmsAutoSaveStatus from '../components/cms/CmsAutoSaveStatus'
import MediaUploadField from '../components/cms/MediaUploadField'
import { useAutoSave } from '../hooks/useAutoSave'
import { resolveMediaUrl } from '../utils/media'
import defaultIllustration from '../assets/sections/howmade_illustration.png'

const DEFAULT_STEPS = [
  {
    title: 'THE IDEA',
    desc: 'Every creation begins with an idea a need, a feeling, a story, or a better way of making everyday life more meaningful.',
  },
  {
    title: 'THE DESIGN',
    desc: 'We shape each idea with purpose, balancing beauty, function, detail, and simplicity to create things that feel thoughtful and truly useful.',
  },
  {
    title: 'THE MATERIALS',
    desc: 'We choose every material with care, considering its origin, quality, impact, feel, and ability to remain useful for longer.',
  },
  {
    title: 'THE MAKING',
    desc: 'Skilled hands bring every idea to life through thoughtful processes, honest workmanship, careful attention, and respect for the craft.',
  },
  {
    title: 'THE JOURNEY',
    desc: 'Every creation is made to live longer to be used, loved, cared for, repaired, and given another meaningful life.',
  },
]

function CmsHowItsMade() {
  const [illustrationUrl, setIllustrationUrl] = useState(null)
  const [steps, setSteps] = useState(DEFAULT_STEPS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSection('howItsMade')
      .then((data) => {
        if (data?.illustrationUrl) setIllustrationUrl(data.illustrationUrl)
        if (data?.steps?.length) setSteps(data.steps)
      })
      .finally(() => setLoading(false))
  }, [])

  const updateStep = (i, field, value) =>
    setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)))

  const status = useAutoSave(
    (v) => updateSection('howItsMade', v),
    { illustrationUrl, steps },
    { skip: loading },
  )

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading...</div>

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">How It's Made</h1>

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Illustration</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <MediaUploadField accept="image/*" buttonLabel="Change illustration" onUploaded={setIllustrationUrl} />
          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-700">Preview</p>
            <img
              src={illustrationUrl ? resolveMediaUrl(illustrationUrl) : defaultIllustration}
              alt="Illustration preview"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Steps</h2>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="rounded-md border border-gray-100 p-4">
              <input
                value={step.title}
                onChange={(e) => updateStep(i, 'title', e.target.value)}
                className="mb-2 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm font-bold uppercase text-[#013485] focus:border-[#003B95] focus:outline-none"
              />
              <textarea
                value={step.desc}
                onChange={(e) => updateStep(i, 'desc', e.target.value)}
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#003B95] focus:outline-none"
              />
            </div>
          ))}
        </div>
      </section>

      <CmsAutoSaveStatus status={status} />
    </div>
  )
}

export default CmsHowItsMade
