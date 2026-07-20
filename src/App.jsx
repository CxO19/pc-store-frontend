import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProductsPage from './pages/ProductsPage'
import PrivateLayout from './layouts/PrivateLayout'
import DashboardPage from './pages/private/DashboardPage'
import UsersPage from './pages/private/admin/UsersPage'
import AdminProductsPage from './pages/private/admin/ProductsPage'
import AdminBrandsPage from './pages/private/admin/BrandsPage'

// Componente para proteger rutas privadas
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/productos" element={<ProductsPage />} />

        {/* Ruta Privada Base (Dashboard) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <PrivateLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
        </Route>

        {/* Rutas Privadas de Administración */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <PrivateLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="usuarios" element={<UsersPage />} />
          <Route path="productos" element={<AdminProductsPage />} />
          <Route path="categorias" element={<DashboardPage />} />
          <Route path="marcas" element={<AdminBrandsPage />} />
          <Route path="ordenes" element={<DashboardPage />} />
        </Route>

        {/* Fallback para rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}