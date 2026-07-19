import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    api.get('/products', { params: { page: 1, limit: 50 } })
      .then(({ data }) => {
        if (!cancelled) setProducts(data.data)
      })
      .catch((err) => {
        if (!cancelled) toast.error(err.response?.data?.message || 'No se pudieron cargar los productos')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return { products, loading }
}