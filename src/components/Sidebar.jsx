import { FileText, LayoutDashboard, LogOut, Package, ShoppingBag, Tag, User, Users } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/products', label: 'Product Management', icon: Package },
  { to: '/orders', label: 'Order Management', icon: ShoppingBag },
  { to: '/users', label: 'User Management', icon: Users },
  { to: '/coupons', label: 'Coupons', icon: Tag },
]

const CMS_SUBLINKS = [
  { to: '/cms/how-it-works', label: 'How It Works' },
  { to: '/cms/how-its-made', label: "How It's Made" },
  { to: '/cms/why-mellow', label: 'Why Mellow' },
  { to: '/cms/testimonials', label: 'Testimonials' },
  { to: '/cms/newsletter', label: 'Enjoying our content?' },
]

const navItemClass = ({ isActive }) =>
  `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm ${
    isActive ? 'bg-[#003B95] text-white' : 'text-gray-700 hover:bg-gray-100'
  }`

function Sidebar() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 flex h-screen w-56 shrink-0 flex-col overflow-y-auto border-r border-gray-200 p-4">
      <div className="mb-6 px-2 text-lg font-bold tracking-tight text-gray-900">
        mellow <span className="text-gray-400">admin</span>
      </div>
      <ul className="flex-1 space-y-1">
        {links.map(({ to, label, end, icon: Icon }) => (
          <li key={to}>
            <NavLink to={to} end={end} className={navItemClass}>
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          </li>
        ))}

        <li>
          <NavLink to="/cms" end className={navItemClass}>
            <FileText className="h-4 w-4" />
            CMS
          </NavLink>
          <ul className="ml-4 mt-1 space-y-0.5 border-l border-gray-200 pl-3">
            {CMS_SUBLINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `block rounded-md px-2.5 py-1.5 text-xs ${
                      isActive ? 'font-semibold text-[#013485]' : 'text-gray-500 hover:text-gray-800'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </li>

        <li>
          <NavLink to="/profile" className={navItemClass}>
            <User className="h-4 w-4" />
            Profile
          </NavLink>
        </li>
      </ul>

      <div className="border-t border-gray-100 pt-3">
        {admin && <p className="mb-2 truncate px-2 text-xs text-gray-400">{admin.email}</p>}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </nav>
  )
}

export default Sidebar
