import { useState } from 'react'

function UserForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    role: initial?.role || 'customer',
  })
  const [error, setError] = useState('')

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('A valid name and email are required.')
      return
    }
    setError('')
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={handleChange('name')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={handleChange('email')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="text"
          value={form.phone}
          onChange={handleChange('phone')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
        <select
          value={form.role}
          onChange={handleChange('role')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
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
          {submitting ? 'Saving...' : initial ? 'Save Changes' : 'Add User'}
        </button>
      </div>
    </form>
  )
}

export default UserForm
