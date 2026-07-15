import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

// MOCK temporal hasta que el backend esté en la VPS
const MOCK_USER = { email: 'admin@test.com', password: 'Admin123!' }

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const login = async (email, password) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800)) // simula delay
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      localStorage.setItem('token', 'mock-token-123')
      toast.success('Bienvenido a PC Store')
      navigate('/products')
    } else {
      toast.error('Credenciales incorrectas')
    }
    setLoading(false)
  }

  const register = async (data) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    if (data.password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres')
      setLoading(false)
      return
    }
    toast.success('Cuenta creada, inicia sesión')
    navigate('/')
    setLoading(false)
  }

  const logout = () => {
    localStorage.removeItem('token')
    toast.success('Sesión cerrada')
    navigate('/')
  }

  return { login, register, logout, loading }
}