import { Pencil, Plus, Tag, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createCoupon, deleteCoupon, getCoupons, updateCoupon } from '../api/coupons'
import ConfirmDialog from '../components/ConfirmDialog'
import CouponForm from '../components/CouponForm'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'

function formatDiscount(coupon) {
  return coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`
}

function isExpired(date) {
  return new Date(date) < new Date()
}

function Coupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const loadCoupons = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getCoupons()
      setCoupons(data)
    } catch (err) {
      setError('Failed to load coupons. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCoupons()
    setCurrentPage(1)
  }, [])

  const paginatedData = coupons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const openAddForm = () => {
    setEditingCoupon(null)
    setShowForm(true)
  }

  const openEditForm = (coupon) => {
    setEditingCoupon(coupon)
    setShowForm(true)
  }

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      if (editingCoupon) {
        const updated = await updateCoupon(editingCoupon._id, data)
        setCoupons((prev) => prev.map((c) => (c._id === updated._id ? updated : c)))
      } else {
        const created = await createCoupon(data)
        setCoupons((prev) => [created, ...prev])
      }
      setShowForm(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save coupon.')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleActive = async (coupon) => {
    const updated = await updateCoupon(coupon._id, { isActive: !coupon.isActive })
    setCoupons((prev) => prev.map((c) => (c._id === updated._id ? updated : c)))
  }

  const handleDelete = async () => {
    try {
      await deleteCoupon(deleteTarget._id)
      setCoupons((prev) => prev.filter((c) => c._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err) {
      setError('Failed to delete coupon.')
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Coupons</h1>
        <button
          type="button"
          onClick={openAddForm}
          className="flex items-center gap-2 rounded-md bg-[#003B95] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B3B95]"
        >
          <Plus className="h-4 w-4" />
          Add Coupon
        </button>
      </div>

      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-500">Loading coupons...</p>
      ) : coupons.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-gray-300 py-16 text-gray-400">
          <Tag className="h-8 w-8" />
          <p className="text-sm">No coupons yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Min Order</th>
                <th className="px-4 py-3">Usage</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((coupon, index) => {
                const expired = isExpired(coupon.expiryDate)
                return (
                  <tr key={coupon._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-4 py-3 font-mono font-medium text-gray-900">{coupon.code}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDiscount(coupon)}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {coupon.minOrderValue > 0 ? `₹${coupon.minOrderValue.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {coupon.usedCount}
                      {coupon.usageLimit > 0 ? ` / ${coupon.usageLimit}` : ''}
                    </td>
                    <td className={`px-4 py-3 ${expired ? 'text-red-600' : 'text-gray-600'}`}>
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                      {expired && ' (expired)'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleActive(coupon)}
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => openEditForm(coupon)} aria-label="Edit">
                          <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-900" />
                        </button>
                        <button type="button" onClick={() => setDeleteTarget(coupon)} aria-label="Delete">
                          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalItems={coupons.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {showForm && (
        <Modal title={editingCoupon ? 'Edit Coupon' : 'Add Coupon'} onClose={() => setShowForm(false)}>
          <CouponForm
            initial={editingCoupon}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            submitting={submitting}
          />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Coupon"
          message={`Are you sure you want to delete "${deleteTarget.code}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

export default Coupons
