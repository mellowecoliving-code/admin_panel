import Modal from './Modal'

function ConfirmDialog({ title, message, onConfirm, onCancel, confirmLabel = 'Delete' }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="mb-6 text-sm text-gray-600">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
