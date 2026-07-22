import { useState, useEffect } from 'react'
import api from '../api/axios'

export function useDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    categories: 0,
    orders: 0,
    activeProducts: 0,
  })
  const [productsByCategory, setProductsByCategory] = useState([])
  const [ordersByStatus, setOrdersByStatus] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, productsRes, categoriesRes, ordersRes] = await Promise.all([
          api.get('/users?limit=1'),
          api.get('/products?limit=1'),
          api.get('/categories?limit=1'),
          api.get('/orders?limit=5'),
        ])

        setStats({
          users: usersRes.data.total || 0,
          products: productsRes.data.total || 0,
          categories: categoriesRes.data.total || 0,
          orders: ordersRes.data.length || 0,
          activeProducts: productsRes.data.data?.filter(p => p.isActive).length || 0,
        })

        // Gráfico productos por categoría
        const allProducts = await api.get('/products?limit=100')
        const catMap = {}
        allProducts.data.data?.forEach(p => {
          const cat = p.category?.name || 'Sin categoría'
          catMap[cat] = (catMap[cat] || 0) + 1
        })
        setProductsByCategory(Object.entries(catMap).map(([name, value]) => ({ name, value })))

        // Gráfico órdenes por estado
        const allOrders = ordersRes.data
        const statusMap = { pending: 0, confirmed: 0, cancelled: 0 }
        allOrders.forEach(o => {
          if (statusMap[o.status] !== undefined) statusMap[o.status]++
        })
        setOrdersByStatus([
          { name: 'Pendiente', value: statusMap.pending, color: '#f59e0b' },
          { name: 'Confirmada', value: statusMap.confirmed, color: '#63CAAC' },
          { name: 'Cancelada', value: statusMap.cancelled, color: '#f87171' },
        ])

        setRecentOrders(allOrders.slice(0, 5))
      } catch (err) {
        console.error('Error cargando dashboard', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  return { stats, productsByCategory, ordersByStatus, recentOrders, loading }
}