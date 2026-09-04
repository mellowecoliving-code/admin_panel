import { User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { changePassword, getProfile, updateProfile } from '../api/admin'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data)
        setForm({ name: data.name, email: data.email, phone: data.phone || '' })
      })
      .catch(() => setError('Failed to load profile. Is the server running?'))
  }, [])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileMessage('')
    try {
      const updated = await updateProfile(form)
      setProfile(updated)
      setProfileMessage('Profile updated successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordMessage('')
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }
    setSavingPassword(true)
    try {
      await changePassword(passwordForm)
      setPasswordMessage('Password updated successfully.')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password.')
    } finally {
      setSavingPassword(false)
    }
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Admin Profile</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <User className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{profile.name}</p>
              <p className="text-xs text-gray-500">{profile.role}</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {profileMessage && (
              <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{profileMessage}</p>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="rounded-md bg-[#003B95] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B3B95] disabled:opacity-50"
            >
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-5 font-semibold text-gray-900">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordMessage && (
              <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{passwordMessage}</p>
            )}
            {passwordError && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{passwordError}</p>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={savingPassword}
              className="rounded-md bg-[#003B95] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B3B95] disabled:opacity-50"
            >
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
