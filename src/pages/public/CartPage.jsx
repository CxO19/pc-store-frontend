import { useNavigate, Link } from 'react-router-dom'
import {
  Box, Typography, Card, CardMedia, CardContent,
  Button, Container, IconButton, Divider, Chip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import { motion } from 'framer-motion'
import { useCart } from '../../contexts/CartContext'

const ACCENT = '#00e5a0'

export default function CartPage() {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart()

  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center', bgcolor: '#080b10', minHeight: '100vh' }}>
        <Box sx={{ mb: 4 }}>
          <ShoppingBagIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.15)' }} />
        </Box>
        <Typography variant="h4" fontWeight="bold" color="white" mb={1}>Tu carrito está vacío</Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>Explora nuestro catálogo y encuentra componentes increíbles para tu PC</Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/productos')}
          sx={{ borderRadius: 3, bgcolor: ACCENT, color: '#20232a', fontWeight: 'bold', px: 4, py: 1.5, textTransform: 'none' }}>
          Ver catálogo
        </Button>
      </Container>
    )
  }

  const IVA = cartTotal * 0.12
  const totalConIva = cartTotal + IVA

  return (
    <Container maxWidth="md" sx={{ py: 4, bgcolor: '#080b10', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="white">
          <ShoppingCartIcon sx={{ color: ACCENT, mr: 1, verticalAlign: 'middle' }} />
          Carrito ({cartCount})
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/productos')}
          sx={{ color: ACCENT, textTransform: 'none', fontWeight: 600 }}>
          Seguir comprando
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        
        {/* Lista de productos */}
        <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cart.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card sx={{ borderRadius: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', p: 2, gap: 2, alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                  <CardMedia
                    component="img"
                    image={item.imageUrl || `https://placehold.co/120x120/1a1a1a/63CAAC?text=${encodeURIComponent(item.name)}`}
                    alt={item.name}
                    sx={{ width: 100, height: 100, borderRadius: 2, objectFit: 'contain', bgcolor: 'rgba(0,0,0,0.2)', flexShrink: 0 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="white" noWrap>{item.name}</Typography>
                    {item.category && <Chip label={item.category} size="small" sx={{ mb: 1, bgcolor: 'rgba(99,202,172,0.08)', color: ACCENT, fontSize: '0.7rem' }} />}
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <Box display="flex" alignItems="center" border="1px solid rgba(255,255,255,0.1)" borderRadius={2}>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)} sx={{ color: 'white', p: 0.5 }}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ color: 'white', px: 1.5, fontWeight: 'bold', fontSize: '0.9rem' }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)} sx={{ color: 'white', p: 0.5 }}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <IconButton onClick={() => removeFromCart(item.id)} sx={{ color: '#f87171' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box textAlign="right" sx={{ flexShrink: 0 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: ACCENT }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                      c/u: ${item.price.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          ))}
        </Box>

        {/* Resumen */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ borderRadius: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', p: 3, position: 'sticky', top: 24 }}>
            <Typography variant="h6" fontWeight="bold" color="white" mb={2}>Resumen del pedido</Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Subtotal ({cartCount} items)</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>${cartTotal.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>IVA (12%)</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>${IVA.toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 1.5 }} />
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="subtitle1" fontWeight="bold" color="white">Total</Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: ACCENT }}>${totalConIva.toFixed(2)}</Typography>
            </Box>
            <Button variant="contained" fullWidth size="large" onClick={() => navigate('/login')}
              sx={{ borderRadius: 3, bgcolor: ACCENT, color: '#20232a', fontWeight: 'bold', py: 1.5, textTransform: 'none', '&:hover': { bgcolor: ACCENT, opacity: 0.9 } }}>
              Continuar compra
            </Button>
          </Card>
        </Box>
      </Box>
    </Container>
  )
}
