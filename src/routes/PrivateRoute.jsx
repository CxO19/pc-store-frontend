import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ children, requiredRole }) {
  const { isAuthenticated, isAdmin } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requiredRole === 'admin' && !isAdmin) return <Navigate to="/dashboard" replace />

  return children
}