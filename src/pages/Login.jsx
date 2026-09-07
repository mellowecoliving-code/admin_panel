import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCmsContent } from '../hooks/useCmsContent'
import { resolveMediaUrl } from '../utils/media'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const cms = useCmsContent()
  const logoUrl = cms.logo?.url
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EEF2FA] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#013485] p-6 text-center text-white shadow-xl">
        {logoUrl ? (
          <img src={resolveMediaUrl(logoUrl)} alt="Mellow" className="mx-auto mb-2 h-8 w-auto" />
        ) : (
          <svg viewBox="0 0 32 32" className="mx-auto mb-2 h-8 w-8 text-white" fill="currentColor">
            <path d="M16 3c-1.6 0-3 1-3.5 2.5C11.2 5 9.8 5.3 9 6.4 8.2 7.5 8.3 9 9.2 10 8 10.5 7 11.7 7 13.2c0 1.9 1.6 3.5 3.5 3.5.3 0 .6 0 .9-.1-.3.7-.4 1.4-.4 2.2 0 2.9 2.3 5.2 5.2 5.2s5.2-2.3 5.2-5.2c0-.8-.1-1.5-.4-2.2.3.1.6.1.9.1 1.9 0 3.5-1.6 3.5-3.5 0-1.5-1-2.7-2.2-3.2.9-1 1-2.5.2-3.6-.8-1.1-2.2-1.4-3.5-.9C18.6 4.8 17 3.5 16 3z" />
            <rect x="14.5" y="20" width="3" height="9" rx="1.2" />
          </svg>
        )}
        <p className="mb-1 text-lg font-bold tracking-tight">
          mellow <span className="font-normal text-blue-100">admin</span>
        </p>
        <p className="mb-6 text-xs font-medium uppercase tracking-wide text-blue-100">
          Sign in to manage your store
        </p>

        <div className="rounded-xl bg-white p-5 text-left">
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-[#013485] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-[#013485] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-[#013485] py-2.5 text-xs font-bold tracking-wide text-white hover:bg-[#012a6b] disabled:opacity-50"
            >
              {submitting ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
