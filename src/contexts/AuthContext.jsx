import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(readStoredUser)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const isAuthenticated = !!token
  const isAdmin = user?.role === 'admin'

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      const newToken = res.data.access_token
      const payload = decodeJwt(newToken)
      const newUser = {
        id: payload?.sub,
        email: payload?.email,
        role: payload?.role,
        }

      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      setToken(newToken)
      setUser(newUser)

      toast.success('Bienvenido a PC Store')
      navigate('/dashboard')
      return true
    } catch {
      toast.error('Credenciales incorrectas')
      return false
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const register = useCallback(async (data) => {
    setLoading(true)
    try {
      await api.post('/auth/register', data)
      toast.success('Cuenta creada, inicia sesión')
      navigate('/login')
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al registrarse'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
      return false
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const loginWithGoogle = useCallback(async (googleToken) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/google', { token: googleToken })
      const newToken = res.data.access_token
      const payload = decodeJwt(newToken)
      const newUser = {
        id: payload?.sub,
        email: payload?.email,
        role: payload?.role,
      }

      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      setToken(newToken)
      setUser(newUser)

      toast.success('Bienvenido a PC Store')
      navigate('/dashboard')
      return true
    } catch {
      toast.error('Error al autenticar con Google')
      return false
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    toast.success('Sesión cerrada')
    navigate('/')
  }, [navigate])

  const syncFromStorage = useCallback(() => {
    setToken(localStorage.getItem('token'))
    setUser(readStoredUser())
  }, [])

  useEffect(() => {
    window.addEventListener('auth:logout', syncFromStorage)
    return () => window.removeEventListener('auth:logout', syncFromStorage)
  }, [syncFromStorage])

  const value = useMemo(() => ({
    token, user, isAuthenticated, isAdmin, loading,
    login, register, loginWithGoogle, logout, syncFromStorage,
  }), [token, user, isAuthenticated, isAdmin, loading, login, register, loginWithGoogle, logout, syncFromStorage])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}