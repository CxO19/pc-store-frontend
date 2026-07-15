import {
  Box, Typography, Grid, Card, CardContent, CardMedia,
  Chip, Button, CircularProgress, AppBar, Toolbar, Avatar, Container
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import ComputerIcon from '@mui/icons-material/Computer'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useProducts } from '../hooks/useProducts'

const ACCENT = '#63CAAC'
const ACCENT_GLOW = 'rgba(99, 202, 172, 0.4)'
const BG = 'linear-gradient(135deg, #20232a, #1a1a1a, #20232a)'

export default function ProductsPage() {
  const { logout } = useAuth()
  const { products, loading } = useProducts()

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', background: BG }}>

      {/* Navbar */}
      <AppBar position="static" elevation={0} sx={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 1200, width: '100%', mx: 'auto', px: 2 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar sx={{ bgcolor: ACCENT, width: 36, height: 36 }}>
              <ComputerIcon fontSize="small" sx={{ color: '#20232a' }} />
            </Avatar>
            <Typography variant="h6" fontWeight="bold" color="white">
              PC Store
            </Typography>
          </Box>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              startIcon={<LogoutIcon />}
              onClick={logout}
              variant="outlined"
              sx={{
                borderRadius: 3,
                color: ACCENT,
                borderColor: ACCENT,
                fontWeight: 'bold',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: ACCENT,
                  boxShadow: `0 0 15px ${ACCENT_GLOW}`,
                  background: 'rgba(99,202,172,0.1)',
                }
              }}
            >
              Salir
            </Button>
          </motion.div>
        </Toolbar>
      </AppBar>

      {/* Contenido */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" fontWeight="bold" color="white" mb={0.5}>
            Catálogo de Componentes
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.4)" mb={4}>
            {products.length} productos disponibles
          </Typography>
        </motion.div>

        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={10} gap={2}>
            <CircularProgress sx={{ color: ACCENT }} size={60} />
            <Typography color="rgba(255,255,255,0.4)">Cargando productos...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {products.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07, duration: 0.4 }}
                  whileHover={{ y: -6 }}
                  style={{ height: '100%' }}
                >
                  <Card sx={{
                    height: '100%',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      border: `1px solid ${ACCENT}`,
                      boxShadow: `0 0 25px ${ACCENT_GLOW}`,
                    }
                  }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={product.imageUrl || `https://placehold.co/300x160/20232a/63CAAC?text=${encodeURIComponent(product.name)}`}
                      alt={product.name}
                      sx={{ objectFit: 'contain', bgcolor: 'rgba(0,0,0,0.2)', p: 1 }}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="h6" fontWeight="bold" color="white" noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="rgba(255,255,255,0.45)" sx={{
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: 40,
                        flexGrow: 1,
                      }}>
                        {product.description || 'Sin descripción'}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold" sx={{ color: ACCENT }}>
                          ${Number(product.price).toFixed(2)}
                        </Typography>
                        <Chip
                          label={product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
                          size="small"
                          sx={{
                            bgcolor: product.stock > 0 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                            color: product.stock > 0 ? '#4ade80' : '#f87171',
                            border: `1px solid ${product.stock > 0 ? '#4ade80' : '#f87171'}`,
                            fontWeight: 'bold',
                          }}
                        />
                      </Box>
                      {product.category && (
                        <Chip
                          label={product.category.name}
                          size="small"
                          sx={{
                            alignSelf: 'flex-start',
                            bgcolor: 'rgba(99,202,172,0.1)',
                            color: ACCENT,
                            border: `1px solid rgba(99,202,172,0.3)`,
                          }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}