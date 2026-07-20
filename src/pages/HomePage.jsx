import { Box, Typography, Button, AppBar, Toolbar, Avatar, Container, Card, CardContent } from '@mui/material'
import ComputerIcon from '@mui/icons-material/Computer'
import SpeedIcon from '@mui/icons-material/Speed'
import SecurityIcon from '@mui/icons-material/Security'
import StorefrontIcon from '@mui/icons-material/Storefront'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const ACCENT = '#63CAAC'
const ACCENT_GLOW = 'rgba(99, 202, 172, 0.4)'
// 1. Color de fondo original restaurado
const BG = 'linear-gradient(135deg, #20232a, #1a1a1a, #20232a)'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', background: BG, color: '#FFFFFF', overflowX: 'hidden' }}>

      {/* --- NAVBAR --- */}
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 1200, width: '100%', mx: 'auto', px: 3 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar sx={{ bgcolor: ACCENT, width: 38, height: 38 }}>
              <ComputerIcon fontSize="small" sx={{ color: '#20232a' }} />
            </Avatar>
            <Typography variant="h6" fontWeight="bold" color="#FFFFFF">
              PC Store
            </Typography>
          </Box>
          
          {/* 2. Botones del Navbar forzados uno al lado del otro */}
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
              <Button
                onClick={() => navigate('/login')}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  color: ACCENT,
                  borderColor: ACCENT,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: ACCENT,
                    boxShadow: `0 0 15px ${ACCENT_GLOW}`,
                    background: 'rgba(99, 202, 172, 0.1)',
                  }
                }}
              >
                Iniciar sesión
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
              <Button
                onClick={() => navigate('/register')}
                variant="contained"
                sx={{
                  borderRadius: 3,
                  bgcolor: ACCENT,
                  color: '#20232a',
                  fontWeight: 'bold',
                  textTransform: 'none',
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

      {/* --- HERO SECTION --- */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 3. Contenedor principal del texto forzado al centro */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 10 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: ACCENT, 
                  width: 80, 
                  height: 80, 
                  mb: 3, 
                  boxShadow: `0 0 25px ${ACCENT_GLOW}` 
                }}
              >
                <ComputerIcon sx={{ fontSize: 45, color: '#20232a' }} />
              </Avatar>
            </motion.div>

            <Typography variant="h2" fontWeight="bold" color="white" gutterBottom>
              PC Store
            </Typography>
            
            <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
              Sistema de Gestión y Venta de
            </Typography>
            
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              sx={{ color: ACCENT, mb: 3 }}
            >
              Componentes de PC de Alto Rendimiento
            </Typography>

            {/* 3. Párrafo perfectamente alineado al centro */}
            <Typography 
              variant="body1" 
              align="center"
              sx={{ color: 'rgba(255, 255, 255, 0.6)', maxWidth: 650, mb: 6 }}
            >
              Plataforma especializada que valida automáticamente la compatibilidad entre componentes,
              garantizando un inventario preciso y una experiencia de compra sin errores.
            </Typography>

            {/* 2. Botones del Hero forzados uno al lado del otro */}
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
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
                    textTransform: 'none',
                    '&:hover': { bgcolor: ACCENT, opacity: 0.9, boxShadow: `0 0 25px ${ACCENT_GLOW}` }
                  }}
                >
                  Comenzar ahora
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
                <Button
                  onClick={() => navigate('/login')}
                  variant="outlined"
                  size="large"
                  sx={{
                    borderRadius: 3,
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.2)',
                    px: 4, py: 1.5,
                    textTransform: 'none',
                    '&:hover': { borderColor: ACCENT, color: ACCENT, boxShadow: `0 0 15px ${ACCENT_GLOW}` }
                  }}
                >
                  Ya tengo cuenta
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>

        {/* --- FEATURES --- */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
            gap: 3, 
            justifyContent: 'center' 
          }}
        >
          {[
            { 
              icon: <StorefrontIcon sx={{ fontSize: 40, color: ACCENT }} />, 
              title: 'Catálogo Inteligente', 
              desc: 'Gestión flexible de componentes con especificaciones técnicas detalladas por categoría.' 
            },
            { 
              icon: <SecurityIcon sx={{ fontSize: 40, color: ACCENT }} />, 
              title: 'Validación ACID', 
              desc: 'Transacciones seguras con control de concurrencia para evitar errores de inventario.' 
            },
            { 
              icon: <SpeedIcon sx={{ fontSize: 40, color: ACCENT }} />, 
              title: 'Alto Rendimiento', 
              desc: 'API REST optimizada con NestJS, PostgreSQL y MongoDB para respuestas en tiempo real.' 
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.12, duration: 0.5 }}
              whileHover={{ y: -6 }}
            >
              <Card sx={{
                height: '100%',
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  border: `1px solid ${ACCENT}`,
                  boxShadow: `0 6px 25px ${ACCENT_GLOW}`,
                  background: 'rgba(255, 255, 255, 0.05)',
                }
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 3, 
                      bgcolor: 'rgba(99, 202, 172, 0.1)', 
                      mb: 2.5,
                      display: 'inline-flex'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="#FFFFFF" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.6 }}>
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>

        {/* --- FOOTER --- */}
        <Box textAlign="center" mt={12} pt={4} borderTop="1px solid rgba(255,255,255,0.08)">
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.85rem' }}>
            © 2026 PC Store — Escuela de Tecnologías UTE · Edison Bahamontes · Julio Mosquera · Mateo Ortega
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}