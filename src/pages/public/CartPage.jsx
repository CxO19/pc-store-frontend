import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Card, CardMedia, CardContent,
  Button, Container, IconButton, Divider, Chip, CircularProgress
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import { motion } from 'framer-motion'
import { useCart } from '../../contexts/CartContext'
import { useThemeMode } from '../../theme/ThemeModeContext'

export default function CartPage() {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQuantity, checkout, cartTotal, cartCount, loading } = useCart()
  const { palette } = useThemeMode()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12, bgcolor: palette.bg, minHeight: '100vh' }}>
        <CircularProgress sx={{ color: palette.accent }} />
      </Box>
    )
  }

  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center', background: palette.bg, minHeight: '100vh' }}>
        <Box sx={{ mb: 4 }}>
          <ShoppingBagIcon sx={{ fontSize: 80, color: palette.textMuted }} />
        </Box>
        <Typography variant="h4" fontWeight="bold" sx={{ color: palette.textPrimary }} mb={1}>Tu carrito está vacío</Typography>
        <Typography variant="body1" sx={{ color: palette.textSecondary, mb: 4 }}>Explorá nuestro catálogo y encontrá componentes increíbles para tu PC</Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/productos')}
          sx={{ borderRadius: 3, bgcolor: palette.accent, color: '#fff', fontWeight: 'bold', px: 4, py: 1.5, textTransform: 'none' }}>
          Ver catálogo
        </Button>
      </Container>
    )
  }

  const IVA = cartTotal * 0.12
  const totalConIva = cartTotal + IVA

  return (
    <Container maxWidth="md" sx={{ py: 4, background: palette.bg, minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: palette.textPrimary }}>
          <ShoppingCartIcon sx={{ color: palette.accent, mr: 1, verticalAlign: 'middle' }} />
          Carrito ({cartCount})
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/productos')}
          sx={{ color: palette.accent, textTransform: 'none', fontWeight: 600 }}>
          Seguir comprando
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>

        {/* Lista de productos */}
        <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cart.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card sx={{ borderRadius: 3, background: palette.paperBg, border: `1px solid ${palette.paperBorder}`, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', p: 2, gap: 2, alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                  <CardMedia
                    component="img"
                    image={item.product?.imageUrl || `https://placehold.co/120x120/1a1a1a/63CAAC?text=${encodeURIComponent(item.product?.name || 'Producto')}`}
                    alt={item.product?.name}
                    sx={{ width: 100, height: 100, borderRadius: 2, objectFit: 'contain', bgcolor: palette.inputBg, flexShrink: 0 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: palette.textPrimary }} noWrap>{item.product?.name}</Typography>
                    {item.product?.category?.name && (
                      <Chip label={item.product.category.name} size="small" sx={{ mb: 1, bgcolor: palette.accentBg, color: palette.accent, fontSize: '0.7rem' }} />
                    )}
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <Box display="flex" alignItems="center" border={`1px solid ${palette.paperBorder}`} borderRadius={2}>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)} sx={{ color: palette.textPrimary, p: 0.5 }}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ color: palette.textPrimary, px: 1.5, fontWeight: 'bold', fontSize: '0.9rem' }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)} sx={{ color: palette.textPrimary, p: 0.5 }}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <IconButton onClick={() => removeFromCart(item.id)} sx={{ color: palette.danger }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box textAlign="right" sx={{ flexShrink: 0 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: palette.accent }}>
                      ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: palette.textMuted }}>
                      c/u: ${Number(item.unitPrice).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          ))}
        </Box>

        {/* Resumen */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ borderRadius: 3, background: palette.paperBg, border: `1px solid ${palette.paperBorder}`, p: 3, position: 'sticky', top: 24 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: palette.textPrimary }} mb={2}>Resumen del pedido</Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" sx={{ color: palette.textSecondary }}>Subtotal ({cartCount} items)</Typography>
              <Typography variant="body2" sx={{ color: palette.textPrimary }}>${cartTotal.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" sx={{ color: palette.textSecondary }}>IVA (12%)</Typography>
              <Typography variant="body2" sx={{ color: palette.textPrimary }}>${IVA.toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ borderColor: palette.paperBorder, my: 1.5 }} />
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: palette.textPrimary }}>Total</Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: palette.accent }}>${totalConIva.toFixed(2)}</Typography>
            </Box>
            <Button variant="contained" fullWidth size="large" onClick={checkout}
              sx={{ borderRadius: 3, bgcolor: palette.accent, color: '#fff', fontWeight: 'bold', py: 1.5, textTransform: 'none', '&:hover': { bgcolor: palette.accent, opacity: 0.9 } }}>
              Confirmar compra
            </Button>
          </Card>
        </Box>
      </Box>
    </Container>
  )
}