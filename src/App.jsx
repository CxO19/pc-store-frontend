import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProductsPage from './pages/ProductsPage'
import PrivateLayout from './layouts/PrivateLayout'
import DashboardPage from './pages/private/DashboardPage'

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

        {/* Rutas Privadas / Dashboard */}
        <Route
          element={
            <PrivateRoute>
              <PrivateLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Grupo Admin */}
          <Route path="/admin">
            <Route index element={<DashboardPage />} />
            <Route path="usuarios" element={<DashboardPage />} />
            <Route path="productos" element={<DashboardPage />} />
            <Route path="categorias" element={<DashboardPage />} />
            <Route path="marcas" element={<DashboardPage />} />
            <Route path="ordenes" element={<DashboardPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}