import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import PrivateLayout from './layouts/PrivateLayout'
import DashboardPage from './pages/private/DashboardPage'
import UsersPage from './pages/private/admin/UsersPage'
import AdminProductsPage from './pages/private/admin/ProductsPage'
import CategoriesPage from './pages/private/admin/CategoriesPage'
import AdminBrandsPage from './pages/private/admin/BrandsPage'
import OrdersAdminPage from './pages/private/admin/OrdersAdminPage'
import ClientOrdersPage from './pages/private/client/ClientOrdersPage'
import ProfilePage from './pages/private/ProfilePage'

function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />

  if (requiredRole) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (user.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />
      }
    } catch {
      return <Navigate to="/login" replace />
    }
  }

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* --- RUTAS PÚBLICAS (Accesibles sin iniciar sesión) --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/productos/:id" element={<ProductDetailPage />} />

        {/* --- PANEL PRIVADO GENERAL / CLIENTE --- */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <PrivateLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="productos" element={<ProductsPage />} />
          <Route path="ordenes" element={<ClientOrdersPage />} />
          <Route path="perfil" element={<ProfilePage />} />
        </Route>

        {/* --- PANEL DE ADMINISTRACIÓN --- */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="admin">
              <PrivateLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="usuarios" element={<UsersPage />} />
          <Route path="productos" element={<AdminProductsPage />} />
          <Route path="categorias" element={<CategoriesPage />} />
          <Route path="marcas" element={<AdminBrandsPage />} />
          <Route path="ordenes" element={<OrdersAdminPage />} />
          <Route path="perfil" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}