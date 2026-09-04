import { X } from 'lucide-react'

function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-lg bg-white p-6 shadow-xl ${
          wide ? 'max-w-2xl' : 'max-w-md'
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5 text-gray-500 hover:text-gray-800" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
