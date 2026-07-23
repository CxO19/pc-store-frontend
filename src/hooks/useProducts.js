import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import mockProducts from '../data/mockProducts'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products')
      .then(res => {
        const data = res.data.data || []
        if (data.length > 0) {
          setProducts(data)
        } else {
          setProducts(mockProducts)
        }
      })
      .catch(() => {
        setProducts(mockProducts)
        toast('Usando modo demo con datos de ejemplo', { icon: '🔌', duration: 3000 })
      })
      .finally(() => setLoading(false))
  }, [])

  return { products, loading }
}
