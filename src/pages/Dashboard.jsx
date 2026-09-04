import { AlertCircle, IndianRupee, Package, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getDashboardStats } from '../api/dashboard'
import StatusBadge from '../components/StatusBadge'

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-5 w-5 text-gray-700" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setError('Failed to load dashboard stats. Is the server running?'))
  }, [])

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Dashboard</h1>

      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {!stats && !error && <p className="text-sm text-gray-500">Loading...</p>}

      {stats && (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Package} label="Total Products" value={stats.totalProducts} />
            <StatCard icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} />
            <StatCard icon={AlertCircle} label="Pending Orders" value={stats.pendingOrders} />
            <StatCard
              icon={IndianRupee}
              label="Total Revenue"
              value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
            />
          </div>

          <h2 className="mb-3 text-sm font-semibold text-gray-700">Recent Orders</h2>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">S.No</th>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentOrders.map((order, index) => (
                    <tr key={order._id}>
                      <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-gray-900">{order.customerName}</td>
                      <td className="px-4 py-3 text-gray-600">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard
