import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import { AuthProvider } from './context/AuthContext'
import Cms from './pages/Cms'
import CmsHowItsMade from './pages/CmsHowItsMade'
import CmsHowItWorks from './pages/CmsHowItWorks'
import CmsNewsletter from './pages/CmsNewsletter'
import CmsTestimonials from './pages/CmsTestimonials'
import CmsWhyMellow from './pages/CmsWhyMellow'
import Coupons from './pages/Coupons'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import OrderManagement from './pages/OrderManagement'
import ProductManagement from './pages/ProductManagement'
import Profile from './pages/Profile'
import UserManagement from './pages/UserManagement'

function AdminLayout() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#F5F5F5]">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/cms" element={<Cms />} />
            <Route path="/cms/how-it-works" element={<CmsHowItWorks />} />
            <Route path="/cms/how-its-made" element={<CmsHowItsMade />} />
            <Route path="/cms/why-mellow" element={<CmsWhyMellow />} />
            <Route path="/cms/testimonials" element={<CmsTestimonials />} />
            <Route path="/cms/newsletter" element={<CmsNewsletter />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<AdminLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
