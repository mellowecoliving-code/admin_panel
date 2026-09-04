import { useState } from 'react'

function toDateInput(value) {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 10)
}

function CouponForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    code: initial?.code || '',
    discountType: initial?.discountType || 'percentage',
    discountValue: initial?.discountValue ?? '',
    minOrderValue: initial?.minOrderValue ?? 0,
    expiryDate: toDateInput(initial?.expiryDate) || '',
    usageLimit: initial?.usageLimit ?? 0,
    isActive: initial?.isActive ?? true,
  })
  const [error, setError] = useState('')

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.code.trim() || form.discountValue === '' || !form.expiryDate) {
      setError('Code, discount value, and expiry date are required.')
      return
    }
    setError('')
    onSubmit({
      ...form,
      code: form.code.toUpperCase(),
      discountValue: Number(form.discountValue),
      minOrderValue: Number(form.minOrderValue) || 0,
      usageLimit: Number(form.usageLimit) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Coupon Code</label>
        <input
          type="text"
          value={form.code}
          onChange={handleChange('code')}
          placeholder="WELCOME10"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase focus:border-gray-900 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Discount Type</label>
          <select
            value={form.discountType}
            onChange={handleChange('discountType')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed (₹)</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Discount Value</label>
          <input
            type="number"
            min="0"
            value={form.discountValue}
            onChange={handleChange('discountValue')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Min Order Value (₹)</label>
          <input
            type="number"
            min="0"
            value={form.minOrderValue}
            onChange={handleChange('minOrderValue')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Usage Limit (0 = unlimited)</label>
          <input
            type="number"
            min="0"
            value={form.usageLimit}
            onChange={handleChange('usageLimit')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Expiry Date</label>
        <input
          type="date"
          value={form.expiryDate}
          onChange={handleChange('expiryDate')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={form.isActive} onChange={handleChange('isActive')} />
        Active
      </label>

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
          {submitting ? 'Saving...' : initial ? 'Save Changes' : 'Add Coupon'}
        </button>
      </div>
    </form>
  )
}

export default CouponForm
