import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getSection, updateSection } from '../api/cms'
import CmsAutoSaveStatus from '../components/cms/CmsAutoSaveStatus'
import { useAutoSave } from '../hooks/useAutoSave'

const DEFAULTS = {
  contactPhone: '+91 6302111807',
  contactEmail: 'info@mellowecoliving.com',
  whatsappNumber: '916302111807',
  copyrightText: 'All rights reserved | © 2026 Mellow Eco Living Private Limited.',
  socials: { instagram: '', facebook: '', youtube: '', twitter: '', pinterest: '' },
  legalLinks: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-conditions' },
    { label: 'Cookies Policy', href: '/cookies-policy' },
  ],
}

const SOCIAL_FIELDS = [
  { key: 'instagram', label: 'Instagram URL' },
  { key: 'facebook', label: 'Facebook URL' },
  { key: 'youtube', label: 'YouTube URL' },
  { key: 'twitter', label: 'X (Twitter) URL' },
  { key: 'pinterest', label: 'Pinterest URL' },
]

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#003B95] focus:outline-none'

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium text-gray-700">{label}</p>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />
    </div>
  )
}

function LinkListEditor({ title, items, onChange, labelPlaceholder = 'Label', hrefPlaceholder = 'Link (optional)' }) {
  const update = (i, field, value) => onChange(items.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)))
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const add = () => onChange([...items, { label: '', href: '' }])

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <button type="button" onClick={add} className="flex items-center gap-1 text-xs font-medium text-[#013485] hover:underline">
          <Plus className="h-3.5 w-3.5" />
          Add link
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={item.label}
              onChange={(e) => update(i, 'label', e.target.value)}
              placeholder={labelPlaceholder}
              className="w-48 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-[#003B95] focus:outline-none"
            />
            <input
              value={item.href}
              onChange={(e) => update(i, 'href', e.target.value)}
              placeholder={hrefPlaceholder}
              className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-[#003B95] focus:outline-none"
            />
            <button type="button" onClick={() => remove(i)} className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-gray-400">No links yet.</p>}
      </div>
    </section>
  )
}

function CmsFooter() {
  const [data, setData] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSection('footer')
      .then((saved) => {
        if (saved) setData({ ...DEFAULTS, ...saved, socials: { ...DEFAULTS.socials, ...saved.socials } })
      })
      .finally(() => setLoading(false))
  }, [])

  const status = useAutoSave((v) => updateSection('footer', v), data, { skip: loading })

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading...</div>

  const set = (field) => (value) => setData((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Footer</h1>

      <div className="space-y-6">
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Contact</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Phone" value={data.contactPhone} onChange={set('contactPhone')} placeholder="+91 6302111807" />
            <Field label="Email" value={data.contactEmail} onChange={set('contactEmail')} placeholder="info@mellowecoliving.com" />
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-1 text-base font-semibold text-gray-900">WhatsApp Chat Button</h2>
          <p className="mb-4 text-xs text-gray-400">
            The floating WhatsApp icon on the storefront opens a chat with this number. Include the
            country code, no spaces or symbols (e.g. 916302111807). Leave blank to hide the button.
          </p>
          <Field
            label="WhatsApp number"
            value={data.whatsappNumber}
            onChange={set('whatsappNumber')}
            placeholder="916302111807"
          />
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Copyright</h2>
          <Field label="Text shown at the bottom of the footer" value={data.copyrightText} onChange={set('copyrightText')} />
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-1 text-base font-semibold text-gray-900">Social Links</h2>
          <p className="mb-4 text-xs text-gray-400">Leave blank to keep the icon showing a "coming soon" message instead of a real link.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SOCIAL_FIELDS.map(({ key, label }) => (
              <Field
                key={key}
                label={label}
                value={data.socials[key]}
                onChange={(v) => setData((prev) => ({ ...prev, socials: { ...prev.socials, [key]: v } }))}
                placeholder="https://..."
              />
            ))}
          </div>
        </section>

        <LinkListEditor
          title="Legal Links"
          items={data.legalLinks}
          onChange={set('legalLinks')}
          hrefPlaceholder="Link (optional — leave blank for 'coming soon')"
        />
      </div>

      <CmsAutoSaveStatus status={status} />
    </div>
  )
}

export default CmsFooter
