import { Plus, Star, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getSection, updateSection } from '../api/cms'
import CmsAutoSaveStatus from '../components/cms/CmsAutoSaveStatus'
import { useAutoSave } from '../hooks/useAutoSave'

const DEFAULT_REVIEWS = [
  {
    quote:
      'I really appreciate the thought behind every piece. The quality is excellent, and knowing the clothes can be renewed makes them even more special.',
    name: 'Rahul K',
    location: 'Bengaluru',
  },
  {
    quote:
      'Mellow has completely changed how I think about shopping for clothes. Beautiful designs, natural fabrics, and a much more thoughtful approach to fashion.',
    name: 'Sana',
    location: 'Mumbai',
  },
  {
    quote:
      'The shirt I ordered feels incredibly comfortable and well made. It has become one of those pieces I reach for almost every day.',
    name: 'Arjun R',
    location: 'Hyderabad',
  },
]

function CmsTestimonials() {
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSection('testimonials')
      .then((data) => {
        if (data?.reviews?.length) setReviews(data.reviews)
      })
      .finally(() => setLoading(false))
  }, [])

  const updateReview = (i, field, value) =>
    setReviews((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)))
  const addReview = () => setReviews((prev) => [...prev, { quote: '', name: '', location: '' }])
  const removeReview = (i) => setReviews((prev) => prev.filter((_, idx) => idx !== i))

  const status = useAutoSave((v) => updateSection('testimonials', v), { reviews }, { skip: loading })

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading...</div>

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Testimonials</h1>
        <button
          type="button"
          onClick={addReview}
          className="flex items-center gap-1.5 rounded-md bg-[#003B95] px-3 py-2 text-xs font-medium text-white hover:bg-[#0B3B95]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {reviews.map((review, i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex gap-1 text-[#013485]">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5" fill="currentColor" />
                ))}
              </div>
              <button
                type="button"
                onClick={() => removeReview(i)}
                className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <textarea
              value={review.quote}
              onChange={(e) => updateReview(i, 'quote', e.target.value)}
              rows={3}
              placeholder="Quote"
              className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#003B95] focus:outline-none"
            />
            <div className="flex gap-2">
              <input
                value={review.name}
                onChange={(e) => updateReview(i, 'name', e.target.value)}
                placeholder="Name"
                className="w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#003B95] focus:outline-none"
              />
              <input
                value={review.location}
                onChange={(e) => updateReview(i, 'location', e.target.value)}
                placeholder="Location"
                className="w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#003B95] focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      <CmsAutoSaveStatus status={status} />
    </div>
  )
}

export default CmsTestimonials
