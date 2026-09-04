import { Ban, CheckCircle2, Plus, Search, Trash2, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createUser, deleteUser, getUsers, updateUser } from '../api/users'
import ConfirmDialog from '../components/ConfirmDialog'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import UserForm from '../components/UserForm'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [selected, setSelected] = useState(new Set())
  const [showBulkConfirm, setShowBulkConfirm] = useState(false)

  const loadUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      setError('Failed to load users. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
    setSelected(new Set())
  }, [search])

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  )
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const pageIds = paginatedData.map((u) => u._id)
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id))
  const somePageSelected = pageIds.some((id) => selected.has(id))

  const toggleSelectAll = () => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allPageSelected) {
        pageIds.forEach((id) => next.delete(id))
      } else {
        pageIds.forEach((id) => next.add(id))
      }
      return next
    })
  }

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleAdd = async (data) => {
    setSubmitting(true)
    try {
      const created = await createUser(data)
      setUsers((prev) => [created, ...prev])
      setShowForm(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user.')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleStatus = async (user) => {
    const updated = await updateUser(user._id, {
      status: user.status === 'active' ? 'blocked' : 'active',
    })
    setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)))
  }

  const handleDelete = async () => {
    try {
      await deleteUser(deleteTarget._id)
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err) {
      setError('Failed to delete user.')
    }
  }

  const handleBulkDelete = async () => {
    try {
      await Promise.all([...selected].map((id) => deleteUser(id)))
      setUsers((prev) => prev.filter((u) => !selected.has(u._id)))
      setSelected(new Set())
      setShowBulkConfirm(false)
    } catch (err) {
      setError('Failed to delete some users.')
      setShowBulkConfirm(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <button
              type="button"
              onClick={() => setShowBulkConfirm(true)}
              className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
              <span className="ml-1 rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold">
                {selected.size}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-md bg-[#003B95] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B3B95]"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 sm:w-80">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full text-sm focus:outline-none"
        />
      </div>

      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-500">Loading users...</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-gray-300 py-16 text-gray-400">
          <Users className="h-8 w-8" />
          <p className="text-sm">No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    ref={(el) => { if (el) el.indeterminate = somePageSelected && !allPageSelected }}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-[#003B95] cursor-pointer accent-[#003B95]"
                    aria-label="Select all on this page"
                  />
                </th>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((user, index) => (
                <tr
                  key={user._id}
                  className={`hover:bg-gray-50 ${selected.has(user._id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(user._id)}
                      onChange={() => toggleSelect(user._id)}
                      className="h-4 w-4 rounded border-gray-300 cursor-pointer accent-[#003B95]"
                      aria-label={`Select ${user.name}`}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">{user.phone || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{user.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => toggleStatus(user)}
                        aria-label={user.status === 'active' ? 'Block user' : 'Unblock user'}
                        title={user.status === 'active' ? 'Block user' : 'Unblock user'}
                      >
                        {user.status === 'active' ? (
                          <Ban className="h-4 w-4 text-gray-500 hover:text-red-600" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-gray-500 hover:text-green-600" />
                        )}
                      </button>
                      <button type="button" onClick={() => setDeleteTarget(user)} aria-label="Delete">
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
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {showForm && (
        <Modal title="Add User" onClose={() => setShowForm(false)}>
          <UserForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} submitting={submitting} />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete User"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {showBulkConfirm && (
        <ConfirmDialog
          title="Delete Selected Users"
          message={`Are you sure you want to delete ${selected.size} selected user${selected.size > 1 ? 's' : ''}? This cannot be undone.`}
          confirmLabel={`Delete ${selected.size}`}
          onConfirm={handleBulkDelete}
          onCancel={() => setShowBulkConfirm(false)}
        />
      )}
    </div>
  )
}

export default UserManagement
