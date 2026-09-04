import { useEffect, useState } from 'react'
import { getSection, updateSection } from '../api/cms'
import CmsAutoSaveStatus from '../components/cms/CmsAutoSaveStatus'
import { useAutoSave } from '../hooks/useAutoSave'

const DEFAULT_HEADING = 'Enjoying our content?'
const DEFAULT_SUBTEXT = 'Subscribe to our newsletter get notified with the latest news and offers.'

function CmsNewsletter() {
  const [heading, setHeading] = useState(DEFAULT_HEADING)
  const [subtext, setSubtext] = useState(DEFAULT_SUBTEXT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSection('newsletter')
      .then((data) => {
        if (data?.heading) setHeading(data.heading)
        if (data?.subtext) setSubtext(data.subtext)
      })
      .finally(() => setLoading(false))
  }, [])

  const status = useAutoSave((v) => updateSection('newsletter', v), { heading, subtext }, { skip: loading })

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading...</div>

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Enjoying our content?</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4">
            <p className="mb-1 text-sm font-medium text-gray-700">Heading</p>
            <input
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#003B95] focus:outline-none"
            />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">Subtext</p>
            <textarea
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#003B95] focus:outline-none"
            />
          </div>
        </section>

        <section>
          <p className="mb-1.5 text-sm font-medium text-gray-700">Preview</p>
          <div className="rounded-lg bg-[#013485] px-6 py-10 text-center text-white">
            <h2 className="mb-2 text-xl font-bold">{heading}</h2>
            <p className="mb-4 text-sm text-blue-100">{subtext}</p>
            <div className="mx-auto w-fit rounded-full bg-blue-100 px-6 py-2 text-xs font-bold text-[#013485]">
              SUBSCRIBE
            </div>
          </div>
        </section>
      </div>

      <CmsAutoSaveStatus status={status} />
    </div>
  )
}

export default CmsNewsletter
