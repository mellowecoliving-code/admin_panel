import { AlertCircle, Check, Loader2 } from 'lucide-react'

function CmsAutoSaveStatus({ status }) {
  if (status === 'idle') return null

  const config = {
    saving: { icon: Loader2, text: 'Saving...', className: 'text-gray-500', spin: true },
    saved: { icon: Check, text: 'Saved — live on the storefront', className: 'text-green-600' },
    error: { icon: AlertCircle, text: 'Failed to save. Retrying on next change.', className: 'text-red-600' },
  }[status]

  if (!config) return null
  const Icon = config.icon

  return (
    <div className={`mt-6 flex items-center gap-1.5 text-sm ${config.className}`}>
      <Icon className={`h-4 w-4 ${config.spin ? 'animate-spin' : ''}`} />
      {config.text}
    </div>
  )
}

export default CmsAutoSaveStatus
