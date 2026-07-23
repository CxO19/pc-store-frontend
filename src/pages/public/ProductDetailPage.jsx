import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Card, CardMedia, CardContent, CardActions,
  Chip, Button, CircularProgress, Container, Divider, Table, TableBody, TableCell, TableRow,
  IconButton
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import InventoryIcon from '@mui/icons-material/Inventory'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import CategoryIcon from '@mui/icons-material/Category'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import VerifiedIcon from '@mui/icons-material/Verified'
import { motion } from 'framer-motion'
import api from '../../api/axios'
import { useCart } from '../../contexts/CartContext'
import mockProducts from '../../data/mockProducts'
import toast from 'react-hot-toast'

const ACCENT = '#00e5a0'
const ACCENT_GLOW = 'rgba(0,229,160,0.4)'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`)
        if (res.data) setProduct(res.data)
      } catch {
        const mock = mockProducts.find(p => p.id === id)
        if (mock) setProduct(mock)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product, quantity)
    toast.success(`${product.name} agregado al carrito`)
    setQuantity(1)
  }

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress sx={{ color: ACCENT }} size={48} />
    </Box>
  )

  if (!product) return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh" gap={2}>
      <InventoryIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)' }} />
      <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)' }}>Producto no encontrado</Typography>
      <Button onClick={() => navigate('/productos')} startIcon={<ArrowBackIcon />} sx={{ color: ACCENT }}>Volver al catálogo</Button>
    </Box>
  )

  const specs = [
    { label: 'ID', value: product.id?.slice(0, 8) || '—' },
    { label: 'Categoría', value: product.category?.name || 'Sin categoría' },
    { label: 'Marca', value: product.brand?.name || 'Genérica' },
    { label: 'Stock', value: product.stock > 0 ? `${product.stock} unidades` : 'Agotado' },
  ]

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button onClick={() => navigate('/productos')} startIcon={<ArrowBackIcon />}
        sx={{ color: ACCENT, mb: 3, textTransform: 'none', fontWeight: 600 }}>
        Volver al catálogo
      </Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        
        {/* Imagen y precio */}
        <Card sx={{ borderRadius: 4, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ flex: 1, bgcolor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, minHeight: { xs: 220, md: 350 }, position: 'relative' }}>
              <Box sx={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT_GLOW} 0%, transparent 70%)`, filter: 'blur(40px)' }} />
              <CardMedia component="img"
                image={product.imageUrl || `https://placehold.co/400x400/1a1a1a/63CAAC?text=${encodeURIComponent(product.name || 'Producto')}`}
                alt={product.name}
                sx={{ width: '100%', maxWidth: 350, height: 'auto', objectFit: 'contain', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 8px 25px rgba(0,0,0,0.6))' }} />
            </Box>
            <CardContent sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
              <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                {product.category && (
                  <Chip icon={<CategoryIcon sx={{ color: `${ACCENT} !important` }} />} label={product.category.name} size="small"
                    sx={{ bgcolor: 'rgba(99,202,172,0.1)', color: ACCENT, border: `1px solid ${ACCENT}40`, fontWeight: 600 }} />
                )}
                <Chip icon={<InventoryIcon />}
                  label={product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                  size="small"
                  sx={{ bgcolor: product.stock > 0 ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', color: product.stock > 0 ? '#4ade80' : '#f87171', fontWeight: 600 }} />
              </Box>
              <Typography variant="h3" fontWeight="800" color="white" mb={2} sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                {product.name}
              </Typography>
              <Box display="flex" alignItems="baseline" gap={1} mb={3}>
                <LocalOfferIcon sx={{ color: ACCENT }} />
                <Typography variant="h3" fontWeight="bold" sx={{ color: ACCENT, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                  ${Number(product.price).toFixed(2)}
                </Typography>
              </Box>
              
              {/* Cantidad + Botón */}
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Box display="flex" alignItems="center" border="1px solid rgba(255,255,255,0.15)" borderRadius={3}>
                  <IconButton size="small" onClick={() => setQuantity(q => Math.max(1, q - 1))} sx={{ color: 'white' }}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ color: 'white', px: 2, fontWeight: 'bold', minWidth: 30, textAlign: 'center' }}>
                    {quantity}
                  </Typography>
                  <IconButton size="small" onClick={() => setQuantity(q => q + 1)} sx={{ color: 'white' }}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Button variant="contained" fullWidth size="large" startIcon={<ShoppingCartIcon />}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  sx={{ borderRadius: 3, bgcolor: ACCENT, color: '#20232a', fontWeight: 'bold', textTransform: 'none', py: 1.5, '&:hover': { bgcolor: ACCENT, boxShadow: `0 0 20px ${ACCENT_GLOW}` } }}>
                  Agregar al carrito
                </Button>
              </Box>
            </CardContent>
          </Box>
        </Card>

        {/* Descripción + Especificaciones */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Card sx={{ flex: 1.5, borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', p: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="white" mb={2}>Descripción técnica</Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
              {product.description || 'Sin descripción disponible para este componente.'}
            </Typography>
          </Card>
          <Card sx={{ flex: 1, borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', p: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="white" mb={2}>Especificaciones</Typography>
            <Table size="small">
              <TableBody>
                {specs.map((spec) => (
                  <TableRow key={spec.label} sx={{ '& td': { borderColor: 'rgba(255,255,255,0.06)', py: 1 } }}>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.85rem', width: '40%' }}>{spec.label}</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontSize: '0.85rem' }}>{spec.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Box>

        {/* Garantía */}
        <Card sx={{ mt: 3, borderRadius: 4, background: 'rgba(99,202,172,0.08)', border: `1px solid ${ACCENT}30`, p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <VerifiedIcon sx={{ color: ACCENT, fontSize: 32 }} />
          <Box>
            <Typography fontWeight="bold" color="white">Compra con confianza</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Garantía directa de 30 días con PC Store + garantía oficial del fabricante.</Typography>
          </Box>
        </Card>
      </motion.div>
    </Container>
  )
}
