import { Upload } from 'lucide-react'
import { useState } from 'react'
import { uploadFile } from '../../api/cms'

function MediaUploadField({ label, accept = 'image/*', onUploaded, buttonLabel }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const { url } = await uploadFile(file)
      onUploaded(url)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {label && <p className="mb-1.5 text-sm font-medium text-gray-700">{label}</p>}
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
        <Upload className="h-4 w-4" />
        {uploading ? 'Uploading...' : buttonLabel || 'Upload'}
        <input type="file" accept={accept} className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export default MediaUploadField
