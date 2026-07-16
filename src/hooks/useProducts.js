import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data.data || []))
      .catch(() => toast.error('Error al cargar productos'))
      .finally(() => setLoading(false))
  }, [])

  return { products, loading }
}