import { useState, useEffect } from 'react'

// MOCK temporal
const MOCK_PRODUCTS = [
  { id: '1', name: 'Ryzen 7 5800X', description: 'Procesador AMD 8 núcleos 16 hilos 3.8GHz', price: 299.99, stock: 10, category: { name: 'CPU' }, imageUrl: '' },
  { id: '2', name: 'RTX 4070', description: 'Tarjeta gráfica NVIDIA 12GB GDDR6X', price: 599.99, stock: 5, category: { name: 'GPU' }, imageUrl: '' },
  { id: '3', name: 'Corsair 32GB DDR5', description: 'Memoria RAM DDR5 5600MHz CL36', price: 129.99, stock: 20, category: { name: 'RAM' }, imageUrl: '' },
  { id: '4', name: 'Samsung 990 Pro 1TB', description: 'SSD NVMe PCIe 4.0 7450MB/s lectura', price: 109.99, stock: 15, category: { name: 'Storage' }, imageUrl: '' },
  { id: '5', name: 'MSI B550 Tomahawk', description: 'Placa base AMD AM4 ATX PCIe 4.0', price: 159.99, stock: 8, category: { name: 'Motherboard' }, imageUrl: '' },
  { id: '6', name: 'Corsair RM850x', description: 'Fuente de poder 850W 80+ Gold Modular', price: 139.99, stock: 12, category: { name: 'PSU' }, imageUrl: '' },
  { id: '7', name: 'NZXT H510', description: 'Gabinete ATX Mid Tower con panel de vidrio', price: 89.99, stock: 7, category: { name: 'Case' }, imageUrl: '' },
  { id: '8', name: 'Noctua NH-D15', description: 'Cooler CPU de doble torre 140mm', price: 99.99, stock: 0, category: { name: 'Cooling' }, imageUrl: '' },
]

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setProducts(MOCK_PRODUCTS)
      setLoading(false)
    }, 800)
  }, [])

  return { products, loading }
}