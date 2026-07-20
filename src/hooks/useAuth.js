import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.access_token)
      // Guardar solo si existe user, si no guardar objeto vacío
      const userData = res.data.user ? res.data.user : {}
      localStorage.setItem('user', JSON.stringify(userData))
      toast.success('Bienvenido a PC Store')
      navigate('/dashboard')
    } catch {
      toast.error('Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  const register = async (data) => {
    setLoading(true)
    try {
      await api.post('/auth/register', data)
      toast.success('Cuenta creada, inicia sesión')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al registrarse'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Sesión cerrada')
    navigate('/')
  }

  return { login, register, logout, loading }
}