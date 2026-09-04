const STATUS_STYLES = {
  Pending: 'bg-amber-100 text-amber-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        STATUS_STYLES[status] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status}
    </span>
  )
}

export default StatusBadge
