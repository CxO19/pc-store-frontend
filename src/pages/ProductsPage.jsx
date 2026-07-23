import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Grid, Card, CardMedia, Chip,
  Button, CircularProgress, Container
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../contexts/CartContext'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } })
}

const C = {
  accent: '#00e5a0',
  accentHover: '#00c48c',
  text: '#ffffff',
  text2: '#c5cad3',
  text3: '#888888',
  card: '#0a0a0f',
  border: 'rgba(0,229,160,0.08)',
}

export default function ProductsPage() {
  const { products, loading } = useProducts()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  const cats = ['ALL', ...new Set(products.map(p => p.category?.name).filter(Boolean))]
  const filtered = products.filter(p =>
    selectedCategory === 'ALL' || p.category?.name === selectedCategory
  )

  return (
    <Box sx={{ bgcolor: '#000', minHeight: '100vh', pb: 12, position: 'relative', overflow: 'hidden' }}>
      
      {/* ===== FONDO ANIMADO ===== */}
      <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* Grid de puntos */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          opacity: 0.5,
        }} />
        {/* Gradientes flotantes */}
        <Box sx={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: '50%', height: '60%',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.02) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float1 15s ease-in-out infinite',
          '@keyframes float1': {
            '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
            '33%': { transform: 'translate(30px, -30px) rotate(5deg)' },
            '66%': { transform: 'translate(-20px, 20px) rotate(-3deg)' },
          }
        }} />
        <Box sx={{
          position: 'absolute', bottom: '-10%', left: '-10%',
          width: '40%', height: '50%',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.015) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float2 18s ease-in-out infinite',
          '@keyframes float2': {
            '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
            '50%': { transform: 'translate(-40px, -20px) rotate(-5deg)' },
          }
        }} />
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1 }}>
      
      {/* Header */}
      <Box sx={{ textAlign: 'center', pt: { xs: 8, md: 14 }, pb: 10, px: 3 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Typography sx={{ color: '#888', fontWeight: 500, letterSpacing: 3, fontSize: '0.7rem', mb: 2 }}>
            CATÁLOGO
          </Typography>
          <Typography variant="h1" fontWeight={600} sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, color: '#fff', letterSpacing: -1.5, mb: 2, lineHeight: 1.05 }}>
            Componentes.
          </Typography>
          <Typography sx={{ color: '#888', fontSize: '1.1rem', fontWeight: 300 }}>
            Todo lo que necesitas para armar tu PC.
          </Typography>
        </motion.div>
      </Box>

      {/* Filtros */}
      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 3, md: 8 } }}>
        <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center" mb={10}>
          {cats.map(cat => (
            <Chip key={cat} label={cat === 'ALL' ? 'Todo' : cat}
              onClick={() => setSelectedCategory(cat)}
              sx={{
                bgcolor: selectedCategory === cat ? C.accent : 'transparent',
                color: selectedCategory === cat ? '#fff' : '#888',
                fontWeight: 600, fontSize: '0.8rem', borderRadius: 1.5, px: 1,
                border: `1px solid ${selectedCategory === cat ? C.accent : '#222'}`,
                cursor: 'pointer', transition: 'all 0.2s',
                '&:hover': { border: `1px solid ${C.accent}`, color: C.accent }
              }}
            />
          ))}
        </Box>
      </Container>

      {/* Loading */}
      {loading ? (
        <Box textAlign="center" py={16}><CircularProgress sx={{ color: C.accent }} size={36} /></Box>
      ) : filtered.length === 0 ? (
        <Box textAlign="center" py={16}>
          <Typography variant="h4" fontWeight={600} color="#fff" mb={1}>Sin productos</Typography>
          <Typography color="#888">Selecciona otra categoría.</Typography>
        </Box>
      ) : (
        /* Grid */
        <Container maxWidth="lg" disableGutters sx={{ px: { xs: 3, md: 8 } }}>
          <Grid container spacing={2.5}>
            {filtered.map((product, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <motion.div
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  style={{ height: '100%' }}
                >
                    <Card onClick={() => navigate(`/productos/${product.id}`)} sx={{
                      height: '100%', bgcolor: C.card, borderRadius: 3, border: `1px solid ${C.border}`,
                    cursor: 'pointer', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                    transition: 'all 0.3s ease', '&:hover': { border: '1px solid #333' }
                  }}>
                    {/* Imagen */}
                    <Box sx={{ height: 200, bgcolor: '#0d0d0d', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <motion.div whileHover={{ scale: 1.06 }} transition={{ duration: 0.4 }}
                        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CardMedia component="img"
                          image={product.imageUrl || `https://placehold.co/300x200/0a0a0a/fff?text=Producto`}
                          alt={product.name}
                          sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </motion.div>
                    </Box>

                    {/* Info */}
                    <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {product.category && (
                        <Typography sx={{ color: '#555', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, mb: 1 }}>
                          {product.category.name}
                        </Typography>
                      )}
                      <Typography fontWeight={600} sx={{ color: '#fff', fontSize: '0.95rem', mb: 1, letterSpacing: -0.2, lineHeight: 1.3 }} noWrap>
                        {product.name}
                      </Typography>
                      
                      <Box sx={{ mt: 'auto', pt: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography fontWeight={700} sx={{ color: C.accent, fontSize: '1.05rem' }}>
                            ${Number(product.price).toFixed(2)}
                          </Typography>
                          <Button size="small" disabled={product.stock === 0}
                            onClick={(e) => { e.stopPropagation(); addToCart(product, 1); toast.success('Agregado') }}
                            sx={{
                              bgcolor: product.stock > 0 ? C.accent : 'transparent',
                              color: product.stock > 0 ? '#fff' : '#555',
                              textTransform: 'none', fontWeight: 600, fontSize: '0.7rem', borderRadius: 1, px: 2, minWidth: 'auto',
                              '&:hover': { bgcolor: product.stock > 0 ? C.accentHover : 'transparent' }
                            }}>
                            {product.stock > 0 ? 'Agregar' : 'Agotado'}
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
      </Box>
    </Box>
  )
}
