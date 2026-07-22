import { useState } from 'react'
import {
  Box, Typography, Grid, Card, CardContent, CardMedia,
  Chip, Button, CircularProgress, TextField, InputAdornment, Container
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import FilterListIcon from '@mui/icons-material/FilterList'
import { motion } from 'framer-motion'
import { useProducts } from '../hooks/useProducts'
import { useThemeMode } from '../theme/ThemeModeContext'

const ACCENT = '#63CAAC'
const ACCENT_GLOW = 'rgba(99, 202, 172, 0.4)'

export default function ProductsPage() {
  const { products, loading } = useProducts()
  const { palette } = useThemeMode()
  const isLight = palette.mode === 'light'

  const textColor = isLight ? '#1a1a1a' : '#ffffff'
  const textMuted = isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = selectedCategory === 'ALL' || product.category?.name === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['ALL', ...new Set(products.map(p => p.category?.name).filter(Boolean))]

  return (
    <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Encabezado Centrado */}
      <Box sx={{ mb: 5, textAlign: 'center', width: '100%', maxWidth: 700 }}>
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" gap={1.5} mb={1}>
            <StorefrontOutlinedIcon sx={{ color: ACCENT, fontSize: 36 }} />
            <Typography variant="h3" fontWeight="bold" sx={{ color: textColor, letterSpacing: '-0.5px' }}>
              Catálogo de Componentes
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: textMuted }}>
            Explorá el stock en tiempo real, encontrá los mejores componentes para tu setup y armá tu equipo de alto rendimiento.
          </Typography>
        </motion.div>
      </Box>

      {/* Bloque de Búsqueda y Filtros Centrado */}
      <Box sx={{ width: '100%', maxWidth: 900, mb: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* Barra de Búsqueda Principal Centrada */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card sx={{
            borderRadius: 4,
            backgroundColor: palette.paperBg,
            backdropFilter: 'blur(16px)',
            border: `1px solid ${palette.paperBorder}`,
            p: 3,
            boxShadow: isLight 
              ? '0 10px 30px rgba(0, 0, 0, 0.08)' 
              : '0 10px 30px -10px rgba(99, 202, 172, 0.15)',
            backgroundImage: 'none',
            backgroundImage: 'none',
          }}>
            <TextField
              placeholder="Buscar componente por nombre o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="medium"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: textColor,
                  bgcolor: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
                  borderRadius: 3,
                  border: `1px solid ${palette.paperBorder}`,
                  transition: 'all 0.3s',
                  '& fieldset': { border: 'none' },
                  '&:hover': { border: `1px solid ${ACCENT}50` },
                  '&.Mui-focused': { border: `1px solid ${ACCENT}`, boxShadow: `0 0 15px ${ACCENT_GLOW}` },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: textMuted }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Categorías en forma de Píldoras Centradas */}
            {categories.length > 1 && (
              <Box display="flex" justifyContent="center" gap={1.5} flexWrap="wrap" mt={3}>
                {categories.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat === 'ALL' ? 'Todos los componentes' : cat}
                    onClick={() => setSelectedCategory(cat)}
                    sx={{
                      bgcolor: selectedCategory === cat ? ACCENT : (isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.03)'),
                      color: selectedCategory === cat ? '#1a1a1a' : textColor,
                      fontWeight: 'bold',
                      px: 1.5,
                      py: 2,
                      border: `1px solid ${selectedCategory === cat ? ACCENT : palette.paperBorder}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: selectedCategory === cat ? ACCENT : `${ACCENT}20`,
                      }
                    }}
                  />
                ))}
              </Box>
            )}
          </Card>
        </motion.div>

      </Box>

      {/* Grid de Productos Centrado */}
      {loading ? (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={6} gap={2}>
          <CircularProgress sx={{ color: ACCENT }} size={50} />
          <Typography sx={{ color: textMuted }}>Cargando catálogo...</Typography>
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 4,
            width: '100%',
            maxWidth: 600,
            backgroundColor: palette.paperBg,
            border: `1px solid ${palette.paperBorder}`,
            borderRadius: 4,
            boxShadow: isLight 
              ? '0 10px 30px rgba(0, 0, 0, 0.08)' 
              : '0 10px 30px -10px rgba(99, 202, 172, 0.15)',
            backgroundImage: 'none',
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ color: textColor, mb: 1 }}>
            No se encontraron productos
          </Typography>
          <Typography variant="body2" sx={{ color: textMuted }}>
            Intenta buscando con otro término o categoría.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center" sx={{ width: '100%' }}>
          {filteredProducts.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ y: -6 }}
                style={{ height: '100%' }}
              >
                <Card sx={{
                  height: '100%',
                  borderRadius: 4,
                  backgroundColor: palette.paperBg,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${palette.paperBorder}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundImage: 'none',
                  boxShadow: isLight ? '0 10px 30px rgba(0,0,0,0.05)' : 'none',
                  '&:hover': {
                    border: `1px solid ${ACCENT}`,
                    boxShadow: isLight ? '0 15px 35px rgba(99,202,172,0.15)' : `0 10px 30px -10px ${ACCENT_GLOW}`,
                  }
                }}>
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={product.imageUrl || `https://placehold.co/300x180/121212/63CAAC?text=${encodeURIComponent(product.name)}`}
                      alt={product.name}
                      sx={{ objectFit: 'contain', bgcolor: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.2)', p: 2, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}
                    />
                    {product.category && (
                      <Chip
                        label={product.category.name}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          bgcolor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(20,20,20,0.85)',
                          backdropFilter: 'blur(8px)',
                          color: ACCENT,
                          fontWeight: 'bold',
                          border: `1px solid ${ACCENT}50`,
                        }}
                      />
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5, p: 2.5 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: textColor }} noWrap title={product.name}>
                      {product.name}
                    </Typography>
                    
                    <Typography variant="body2" sx={{
                      color: textMuted,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: 40,
                      flexGrow: 1,
                      lineHeight: 1.4,
                    }}>
                      {product.description || 'Sin descripción disponible para este componente.'}
                    </Typography>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                      <Typography variant="h5" fontWeight="bold" sx={{ color: ACCENT }}>
                        ${Number(product.price).toFixed(2)}
                      </Typography>
                      <Chip
                        label={product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                        size="small"
                        sx={{
                          bgcolor: product.stock > 0 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                          color: product.stock > 0 ? '#4ade80' : '#f87171',
                          border: `1px solid ${product.stock > 0 ? '#4ade80' : '#f87171'}`,
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}