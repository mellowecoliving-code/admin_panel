import { ClipboardList, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { deleteOrder, getOrders, updateOrderStatus } from '../api/orders'
import ConfirmDialog from '../components/ConfirmDialog'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import StatusBadge from '../components/StatusBadge'

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [viewOrder, setViewOrder] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const loadOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getOrders(statusFilter ? { status: statusFilter } : undefined)
      setOrders(data)
    } catch (err) {
      setError('Failed to load orders. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const paginatedData = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleStatusChange = async (order, status) => {
    const updated = await updateOrderStatus(order._id, status)
    setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)))
    if (viewOrder?._id === updated._id) setViewOrder(updated)
  }

  const handleDelete = async () => {
    try {
      await deleteOrder(deleteTarget._id)
      setOrders((prev) => prev.filter((o) => o._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err) {
      setError('Failed to delete order.')
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Order Management</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-gray-300 py-16 text-gray-400">
          <ClipboardList className="h-8 w-8" />
          <p className="text-sm">No orders found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Placed</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((order, index) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    <button
                      type="button"
                      onClick={() => setViewOrder(order)}
                      className="hover:text-gray-900 hover:underline"
                    >
                      #{order._id.slice(-6).toUpperCase()}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{order.customerName}</td>
                  <td className="px-4 py-3 text-gray-600">{order.items.length} item(s)</td>
                  <td className="px-4 py-3 text-gray-600">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order, e.target.value)}
                      className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs focus:outline-none"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setDeleteTarget(order)} aria-label="Delete">
                        <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalItems={orders.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {viewOrder && (
        <Modal title={`Order #${viewOrder._id.slice(-6).toUpperCase()}`} onClose={() => setViewOrder(null)} wide>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-medium text-gray-900">{viewOrder.customerName}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <StatusBadge status={viewOrder.status} />
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="text-gray-900">{viewOrder.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="text-gray-900">{viewOrder.phone || '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Shipping Address</p>
                <p className="text-gray-900">{viewOrder.shippingAddress || '—'}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-gray-500">Items</p>
              <div className="divide-y divide-gray-100 rounded-md border border-gray-200">
                {viewOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2">
                    <span className="text-gray-900">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-gray-600">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-3 font-semibold text-gray-900">
              <span>Total</span>
              <span>₹{viewOrder.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Order"
          message={`Are you sure you want to delete order #${deleteTarget._id.slice(-6).toUpperCase()}? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

export default OrderManagement
