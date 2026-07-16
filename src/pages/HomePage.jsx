import { Box, Typography, Button, AppBar, Toolbar, Avatar, Container, Grid, Card, CardContent } from '@mui/material'
import ComputerIcon from '@mui/icons-material/Computer'
import SpeedIcon from '@mui/icons-material/Speed'
import SecurityIcon from '@mui/icons-material/Security'
import StorefrontIcon from '@mui/icons-material/Storefront'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const ACCENT = '#63CAAC'
const ACCENT_GLOW = 'rgba(99, 202, 172, 0.4)'
const BG = 'linear-gradient(135deg, #20232a, #1a1a1a, #20232a)'

export default function HomePage() {
  const navigate = useNavigate()

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
          <Box display="flex" gap={2}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/login')}
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
                Iniciar sesión
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/register')}
                variant="contained"
                sx={{
                  borderRadius: 3,
                  bgcolor: ACCENT,
                  color: '#20232a',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: ACCENT,
                    boxShadow: `0 0 20px ${ACCENT_GLOW}`,
                    opacity: 0.9,
                  }
                }}
              >
                Registrarse
              </Button>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Box textAlign="center" mb={8}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            >
              <Avatar sx={{ bgcolor: ACCENT, width: 80, height: 80, mx: 'auto', mb: 3 }}>
                <ComputerIcon sx={{ fontSize: 45, color: '#20232a' }} />
              </Avatar>
            </motion.div>

            <Typography variant="h2" fontWeight="bold" color="white" gutterBottom>
              PC Store
            </Typography>
            <Typography variant="h5" color="rgba(255,255,255,0.5)" mb={2}>
              Sistema de Gestión y Venta de
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ color: ACCENT }} mb={4}>
              Componentes de PC de Alto Rendimiento
            </Typography>
            <Typography variant="body1" color="rgba(255,255,255,0.4)" maxWidth={600} mx="auto" mb={6}>
              Plataforma especializada que valida automáticamente la compatibilidad entre componentes,
              garantizando un inventario preciso y una experiencia de compra sin errores.
            </Typography>

            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/register')}
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: 3,
                    bgcolor: ACCENT,
                    color: '#20232a',
                    fontWeight: 'bold',
                    px: 4, py: 1.5,
                    fontSize: '1rem',
                    '&:hover': { bgcolor: ACCENT, opacity: 0.9, boxShadow: `0 0 25px ${ACCENT_GLOW}` }
                  }}
                >
                  Comenzar ahora
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/login')}
                  variant="outlined"
                  size="large"
                  sx={{
                    borderRadius: 3,
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.2)',
                    px: 4, py: 1.5,
                    fontSize: '1rem',
                    '&:hover': { borderColor: ACCENT, color: ACCENT, boxShadow: `0 0 15px ${ACCENT_GLOW}` }
                  }}
                >
                  Ya tengo cuenta
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>

        {/* Features */}
        <Grid container spacing={3} justifyContent="center">
          {[
            { icon: <StorefrontIcon sx={{ fontSize: 35, color: ACCENT }} />, title: 'Catálogo Inteligente', desc: 'Gestión flexible de componentes con especificaciones técnicas detalladas por categoría.' },
            { icon: <SecurityIcon sx={{ fontSize: 35, color: ACCENT }} />, title: 'Validación ACID', desc: 'Transacciones seguras con control de concurrencia para evitar errores de inventario.' },
            { icon: <SpeedIcon sx={{ fontSize: 35, color: ACCENT }} />, title: 'Alto Rendimiento', desc: 'API REST optimizada con NestJS, PostgreSQL y MongoDB para respuestas en tiempo real.' },
          ].map((feature, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
                whileHover={{ y: -6 }}
              >
                <Card sx={{
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    border: `1px solid ${ACCENT}`,
                    boxShadow: `0 0 25px ${ACCENT_GLOW}`,
                  }
                }}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box mb={2}>{feature.icon}</Box>
                    <Typography variant="h6" fontWeight="bold" color="white" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.45)">
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Footer */}
        <Box textAlign="center" mt={10}>
          <Typography variant="body2" color="rgba(255,255,255,0.2)">
            © 2026 PC Store — Escuela de Tecnologías UTE · Luis Chuquilla · Edison Bahamontes · Julio Mosquera · Mateo Ortega
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}