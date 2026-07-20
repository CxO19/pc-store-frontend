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
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.access_token)
      toast.success('Bienvenido a PC Store')
      navigate('/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  const register = async ({ firstName, lastName, email, password }) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { firstName, lastName, email, password })
      localStorage.setItem('token', data.access_token)
      toast.success('Cuenta creada correctamente')
      navigate('/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudo crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    toast.success('Sesión cerrada')
    navigate('/')
  }

  return { login, register, logout, loading }
}