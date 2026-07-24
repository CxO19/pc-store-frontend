import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      return
    }
    setLoading(true)
    try {
      const { data } = await api.get('/cart')
      setItems(data.items || [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = useCallback(async (product, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Iniciá sesión para agregar al carrito')
      navigate('/login')
      return
    }
    try {
      await api.post('/cart/items', { productId: product.id, quantity })
      toast.success('Agregado al carrito')
      fetchCart()
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo agregar al carrito'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    }
  }, [isAuthenticated, navigate, fetchCart])

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (quantity < 1) return
    try {
      await api.patch(`/cart/items/${itemId}`, { quantity })
      fetchCart()
    } catch {
      toast.error('No se pudo actualizar la cantidad')
    }
  }, [fetchCart])

  const removeFromCart = useCallback(async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`)
      toast.success('Producto eliminado')
      fetchCart()
    } catch {
      toast.error('No se pudo eliminar el producto')
    }
  }, [fetchCart])

  const checkout = useCallback(async () => {
    try {
      await api.post('/orders')
      toast.success('¡Compra confirmada!')
      setItems([])
      navigate('/dashboard/ordenes')
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo confirmar la compra'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
      return false
    }
  }, [navigate])

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const cartTotal = items.reduce((sum, i) => sum + Number(i.unitPrice) * i.quantity, 0)

  const value = {
    cart: items,
    loading,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    checkout,
    refreshCart: fetchCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}