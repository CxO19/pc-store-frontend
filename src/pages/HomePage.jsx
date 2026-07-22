import { useState } from 'react'
import {
  Box, Typography, Button, AppBar, Toolbar, Avatar, Container, Card, CardContent,
  Accordion, AccordionSummary, AccordionDetails, Divider, Chip
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ComputerIcon from '@mui/icons-material/Computer'
import SpeedIcon from '@mui/icons-material/Speed'
import SecurityIcon from '@mui/icons-material/Security'
import StorefrontIcon from '@mui/icons-material/Storefront'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MemoryIcon from '@mui/icons-material/Memory'
import StorageIcon from '@mui/icons-material/Storage'
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import MonitorIcon from '@mui/icons-material/Monitor'
import PowerIcon from '@mui/icons-material/Power'
import VerifiedIcon from '@mui/icons-material/Verified'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StarIcon from '@mui/icons-material/Star'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import heroImage from '../assets/hero.png'

const ACCENT = '#63CAAC'
const ACCENT_GLOW = 'rgba(99, 202, 172, 0.4)'
const BG = 'linear-gradient(135deg, #20232a, #1a1a1a, #20232a)'

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-50px' }, transition: { duration: 0.5 } }

export default function HomePage() {
  const navigate = useNavigate()
  const [expandedFaq, setExpandedFaq] = useState(false)

  const faqs = [
    { q: '¿Cómo funciona la validación de compatibilidad?', a: 'Nuestro sistema cruza especificaciones técnicas como socket de CPU, tipo de RAM, factor de forma y consumo energético para garantizar que los componentes seleccionados sean 100% compatibles entre sí.' },
    { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard), transferencias bancarias y pagos en efectivo en puntos autorizados.' },
    { q: '¿Cuánto tardan los envíos?', a: 'Los envíos dentro de la ciudad tardan de 24 a 48 horas hábiles. Envíos nacionales de 3 a 5 días hábiles. Todos los envíos son rastreados.' },
    { q: '¿Ofrecen garantía en los componentes?', a: 'Sí, todos nuestros productos cuentan con garantía oficial del fabricante. Además ofrecemos 30 días de garantía directa con PC Store para cambios por defectos.' },
    { q: '¿Puedo devolver un producto?', a: 'Tienes hasta 15 días naturales para realizar devoluciones. El producto debe estar en su empaque original y sin signos de uso.' },
  ]

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', background: BG, color: '#FFFFFF', overflowX: 'hidden' }}>

      {/* ============ NAVBAR ============ */}
      <AppBar position="sticky" elevation={0} sx={{ background: 'rgba(18,18,18,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 1200, width: '100%', mx: 'auto', px: 3 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar sx={{ bgcolor: ACCENT, width: 38, height: 38, boxShadow: `0 0 12px ${ACCENT_GLOW}` }}>
              <ComputerIcon fontSize="small" sx={{ color: '#20232a' }} />
            </Avatar>
            <Typography variant="h6" fontWeight="bold" color="#FFFFFF">PC Store</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => navigate('/login')} variant="outlined"
                sx={{ borderRadius: 3, color: ACCENT, borderColor: ACCENT, fontWeight: 'bold', textTransform: 'none', '&:hover': { borderColor: ACCENT, boxShadow: `0 0 15px ${ACCENT_GLOW}`, background: 'rgba(99,202,172,0.1)' } }}>
                Iniciar sesión
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => navigate('/register')} variant="contained"
                sx={{ borderRadius: 3, bgcolor: ACCENT, color: '#20232a', fontWeight: 'bold', textTransform: 'none', '&:hover': { bgcolor: ACCENT, boxShadow: `0 0 20px ${ACCENT_GLOW}`, opacity: 0.9 } }}>
                Registrarse
              </Button>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ============ HERO ============ */}
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: { xs: 6, md: 8 }, mb: { xs: 8, md: 10 } }}>
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Chip label="NUEVA PLATAFORMA" size="small" sx={{ mb: 2, bgcolor: 'rgba(99,202,172,0.15)', color: ACCENT, fontWeight: 'bold', border: `1px solid ${ACCENT}40` }} />
              <Typography variant="h1" fontWeight="800" color="white" sx={{ fontSize: { xs: '2.2rem', md: '3.2rem' }, lineHeight: 1.2 }}>
                Componentes de PC
              </Typography>
              <Typography variant="h1" fontWeight="800" sx={{ fontSize: { xs: '2.2rem', md: '3.2rem' }, lineHeight: 1.2, background: 'linear-gradient(90deg, #63CAAC, #4ADE80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 3 }}>
                Alto Rendimiento
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 500, mb: 5, fontSize: '1.05rem', lineHeight: 1.7 }}>
                Plataforma especializada que valida automáticamente la compatibilidad entre componentes, garantizando un inventario preciso y una experiencia de compra sin errores.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={() => navigate('/register')} variant="contained" size="large" endIcon={<ArrowForwardIcon />}
                    sx={{ borderRadius: 3, bgcolor: ACCENT, color: '#20232a', fontWeight: 'bold', px: 4, py: 1.5, textTransform: 'none', boxShadow: `0 0 15px ${ACCENT_GLOW}`, '&:hover': { bgcolor: ACCENT, boxShadow: `0 0 25px ${ACCENT_GLOW}` } }}>
                    Comenzar ahora
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={() => navigate('/login')} variant="outlined" size="large"
                    sx={{ borderRadius: 3, color: 'white', borderColor: 'rgba(255,255,255,0.2)', px: 4, py: 1.5, textTransform: 'none', '&:hover': { borderColor: ACCENT, color: ACCENT, boxShadow: `0 0 15px ${ACCENT_GLOW}` } }}>
                    Ya tengo cuenta
                  </Button>
                </motion.div>
              </Box>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <Box sx={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT_GLOW} 0%, transparent 70%)`, filter: 'blur(40px)', zIndex: 0 }} />
              <Box component="img" src={heroImage} alt="PC Gaming Setup"
                sx={{ width: '100%', maxWidth: 450, height: 'auto', objectFit: 'contain', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 10px 40px rgba(99,202,172,0.3))' }} />
            </Box>
          </Box>
        </motion.div>

        {/* STATS */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3, mb: 10 }}>
          {[{ value: '250+', label: 'Componentes en catálogo' }, { value: '99.9%', label: 'Precisión de compatibilidad' }, { value: '24/7', label: 'Disponibilidad del sistema' }].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i, duration: 0.4 }}>
              <Box sx={{ textAlign: 'center', p: 3, borderRadius: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Typography variant="h3" fontWeight="bold" sx={{ color: ACCENT, mb: 0.5 }}>{stat.value}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>{stat.label}</Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>

      {/* ============ ¿POR QUÉ ELEGIRNOS? ============ */}
      <Box sx={{ py: 10, background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" color="white" textAlign="center" mb={1}>¿Por qué elegirnos?</Typography>
          <Typography variant="body1" textAlign="center" sx={{ color: 'rgba(255,255,255,0.8)', mb: 6 }}>Tecnología de punta para garantizar tu mejor experiencia</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {[
              { icon: <VerifiedIcon sx={{ fontSize: 36, color: ACCENT }} />, title: 'Validación Inteligente', desc: 'Nuestro sistema verifica automáticamente la compatibilidad entre cada componente que seleccionas.' },
              { icon: <SecurityIcon sx={{ fontSize: 36, color: ACCENT }} />, title: 'Transacciones Seguras', desc: 'Control de concurrencia ACID para evitar errores de inventario y garantizar la integridad de tus compras.' },
              { icon: <SpeedIcon sx={{ fontSize: 36, color: ACCENT }} />, title: 'API de Alto Rendimiento', desc: 'Backend con NestJS, PostgreSQL y MongoDB para respuestas en tiempo real y máxima escalabilidad.' },
            ].map((f, i) => (
              <motion.div key={i} {...fadeUp}>
                <Card sx={{ height: '100%', borderRadius: 4, background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s', '&:hover': { border: `1px solid ${ACCENT}`, boxShadow: `0 8px 30px ${ACCENT_GLOW}`, background: 'rgba(255,255,255,0.05)' } }}>
                  <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(99,202,172,0.1)', mb: 2.5 }}>{f.icon}</Box>
                    <Typography variant="h6" fontWeight="bold" color="white" gutterBottom>{f.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>{f.desc}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ============ CÓMO FUNCIONA ============ */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h3" fontWeight="bold" color="white" textAlign="center" mb={1}>Cómo funciona</Typography>
        <Typography variant="body1" textAlign="center" sx={{ color: 'rgba(255,255,255,0.8)', mb: 6 }}>Arma tu PC ideal en 4 simples pasos</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {[
            { step: '01', title: 'Regístrate', desc: 'Crea tu cuenta gratuita en segundos y accede al catálogo completo.' },
            { step: '02', title: 'Explora', desc: 'Navega por cientos de componentes con especificaciones detalladas por categoría.' },
            { step: '03', title: 'Selecciona', desc: 'Elige tus componentes. El sistema valida la compatibilidad automáticamente.' },
            { step: '04', title: 'Compra', desc: 'Realiza tu pedido de forma segura y recíbelo en la puerta de tu casa.' },
          ].map((step, i) => (
            <motion.div key={i} {...fadeUp} style={{ position: 'relative' }}>
              <Card sx={{ height: '100%', borderRadius: 4, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', p: 3 }}>
                <Typography variant="h2" fontWeight="900" sx={{ color: ACCENT, opacity: 0.3, mb: 1, fontSize: '3rem' }}>{step.step}</Typography>
                <Typography variant="h6" fontWeight="bold" color="white" gutterBottom>{step.title}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{step.desc}</Typography>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>

      {/* ============ CATEGORÍAS POPULARES ============ */}
      <Box sx={{ py: 10, background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" color="white" textAlign="center" mb={1}>Categorías populares</Typography>
          <Typography variant="body1" textAlign="center" sx={{ color: 'rgba(255,255,255,0.8)', mb: 6 }}>Todo lo que necesitas para armar tu PC</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }, gap: 2 }}>
            {[
              { icon: <MemoryIcon sx={{ fontSize: 32, color: ACCENT }} />, label: 'Procesadores' },
              { icon: <DeveloperBoardIcon sx={{ fontSize: 32, color: ACCENT }} />, label: 'Motherboards' },
              { icon: <StorageIcon sx={{ fontSize: 32, color: ACCENT }} />, label: 'RAM / SSD' },
              { icon: <PowerIcon sx={{ fontSize: 32, color: ACCENT }} />, label: 'Fuentes' },
              { icon: <PrecisionManufacturingIcon sx={{ fontSize: 32, color: ACCENT }} />, label: 'GPUs' },
              { icon: <MonitorIcon sx={{ fontSize: 32, color: ACCENT }} />, label: 'Monitores' },
            ].map((cat, i) => (
              <motion.div key={i} whileHover={{ y: -4 }} {...fadeUp}>
                <Card sx={{ borderRadius: 4, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', py: 3, cursor: 'pointer', transition: 'all 0.3s', '&:hover': { border: `1px solid ${ACCENT}`, boxShadow: `0 6px 20px ${ACCENT_GLOW}`, background: 'rgba(99,202,172,0.06)' } }}>
                  <Box sx={{ mb: 1 }}>{cat.icon}</Box>
                  <Typography variant="body2" fontWeight="bold" color="white">{cat.label}</Typography>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ============ VENTAJAS ============ */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h3" fontWeight="bold" color="white" textAlign="center" mb={6}>Lo que nos diferencia</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {[
            { icon: <LocalShippingIcon sx={{ fontSize: 40, color: ACCENT }} />, title: 'Envíos a todo el país', desc: 'Entregamos en todo el territorio nacional con seguimiento en tiempo real de tu pedido.' },
            { icon: <SupportAgentIcon sx={{ fontSize: 40, color: ACCENT }} />, title: 'Soporte técnico 24/7', desc: 'Nuestro equipo de expertos está disponible para ayudarte con cualquier duda o problema técnico.' },
            { icon: <VerifiedIcon sx={{ fontSize: 40, color: ACCENT }} />, title: 'Garantía extendida', desc: 'Todos los componentes incluyen garantía del fabricante más nuestra garantía directa de 30 días.' },
          ].map((v, i) => (
            <motion.div key={i} {...fadeUp}>
              <Box sx={{ textAlign: 'center', p: 4, borderRadius: 4, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Box sx={{ mb: 2 }}>{v.icon}</Box>
                <Typography variant="h6" fontWeight="bold" color="white" gutterBottom>{v.title}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{v.desc}</Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>

      {/* ============ TESTIMONIOS ============ */}
      <Box sx={{ py: 10, background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" color="white" textAlign="center" mb={1}>Lo que dicen nuestros clientes</Typography>
          <Typography variant="body1" textAlign="center" sx={{ color: 'rgba(255,255,255,0.8)', mb: 6 }}>Miles de setups armados con éxito</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {[
              { name: 'Carlos Méndez', role: 'Gamer Profesional', text: 'Excelente plataforma. La validación de compatibilidad me ahorró horas de investigación. Compré todos mis componentes en un solo lugar.', rating: 5 },
              { name: 'Ana Torres', role: 'Diseñadora Gráfica', text: 'Necesitaba una workstation para renderizado 3D y el sistema me recomendó exactamente lo que necesitaba. Entrega rapidísima.', rating: 5 },
              { name: 'Roberto Díaz', role: 'Ingeniero de Software', text: 'El control de inventario en tiempo real es impecable. Pude armar mi servidor de desarrollo sin preocuparme por la compatibilidad.', rating: 5 },
            ].map((t, i) => (
              <motion.div key={i} {...fadeUp}>
                <Card sx={{ height: '100%', borderRadius: 4, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', p: 4 }}>
                  <Box display="flex" gap={0.5} mb={2}>
                    {[...Array(t.rating)].map((_, j) => <StarIcon key={j} sx={{ color: '#f59e0b', fontSize: 18 }} />)}
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, mb: 3, fontStyle: 'italic' }}>"{t.text}"</Typography>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2 }} />
                  <Typography variant="subtitle2" fontWeight="bold" color="white">{t.name}</Typography>
                  <Typography variant="caption" sx={{ color: ACCENT }}>{t.role}</Typography>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ============ FAQ ============ */}
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Typography variant="h3" fontWeight="bold" color="white" textAlign="center" mb={1}>Preguntas frecuentes</Typography>
        <Typography variant="body1" textAlign="center" sx={{ color: 'rgba(255,255,255,0.8)', mb: 6 }}>Todo lo que necesitas saber</Typography>
        {faqs.map((faq, i) => (
          <motion.div key={i} {...fadeUp}>
            <Accordion
              expanded={expandedFaq === i}
              onChange={() => setExpandedFaq(expandedFaq === i ? false : i)}
              elevation={0}
              sx={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px !important',
                mb: 1.5,
                '&:before': { display: 'none' },
                '&.Mui-expanded': { border: `1px solid ${ACCENT}40`, background: 'rgba(99,202,172,0.05)' },
              }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: ACCENT }} />}
                sx={{ '& .MuiAccordionSummary-content': { my: 1.5 } }}>
                <Typography fontWeight="bold" color="white">{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>{faq.a}</Typography>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))}
      </Container>

      {/* ============ CONTACTO ============ */}
      <Box sx={{ py: 10, background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {[
              { icon: <EmailIcon sx={{ color: ACCENT, fontSize: 32 }} />, title: 'Email', info: 'contacto@pcstore.com', desc: 'Respondemos en menos de 2 horas' },
              { icon: <PhoneIcon sx={{ color: ACCENT, fontSize: 32 }} />, title: 'Teléfono', info: '+593 99 123 4567', desc: 'Lun - Vie 9:00 - 18:00' },
              { icon: <LocationOnIcon sx={{ color: ACCENT, fontSize: 32 }} />, title: 'Oficina', info: 'Escuela de Tecnologías UTE', desc: 'Quito, Ecuador' },
            ].map((c, i) => (
              <motion.div key={i} {...fadeUp}>
                <Card sx={{ borderRadius: 4, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', p: 4, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{c.icon}</Box>
                  <Typography variant="h6" fontWeight="bold" color="white">{c.title}</Typography>
                  <Typography variant="body1" sx={{ color: ACCENT, fontWeight: 600, my: 1 }}>{c.info}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{c.desc}</Typography>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ============ ULTIMA CTA ============ */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', py: 8, px: 3, borderRadius: 5, background: `linear-gradient(135deg, rgba(99,202,172,0.08), rgba(99,202,172,0.02))`, border: '1px solid rgba(99,202,172,0.15)' }}>
          <Typography variant="h3" fontWeight="bold" color="white" mb={2}>¿Listo para armar tu PC ideal?</Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, maxWidth: 500, mx: 'auto' }}>
            Regístrate ahora y explora nuestro catálogo completo de componentes verificados.
          </Typography>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
            <Button onClick={() => navigate('/register')} variant="contained" size="large" endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 3, bgcolor: ACCENT, color: '#20232a', fontWeight: 'bold', px: 5, py: 1.5, textTransform: 'none', boxShadow: `0 0 20px ${ACCENT_GLOW}`, '&:hover': { bgcolor: ACCENT, boxShadow: `0 0 30px ${ACCENT_GLOW}` } }}>
              Crear cuenta gratis
            </Button>
          </motion.div>
        </Box>
      </Container>

      {/* ============ FOOTER ============ */}
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, mb: 4 }}>
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <ComputerIcon sx={{ color: ACCENT }} /><Typography fontWeight="bold" color="white">PC Store</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Plataforma especializada en venta de componentes de PC con validación inteligente de compatibilidad.
              </Typography>
            </Box>
            <Box>
              <Typography fontWeight="bold" color="white" mb={2}>Enlaces rápidos</Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {['Inicio', 'Catálogo', 'Iniciar sesión', 'Registrarse'].map(link => (
                  <Typography key={link} variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer', '&:hover': { color: ACCENT } }}>{link}</Typography>
                ))}
              </Box>
            </Box>
            <Box>
              <Typography fontWeight="bold" color="white" mb={2}>Categorías</Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {['Procesadores', 'Motherboards', 'Memoria RAM', 'Almacenamiento', 'Tarjetas gráficas'].map(cat => (
                  <Typography key={cat} variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer', '&:hover': { color: ACCENT } }}>{cat}</Typography>
                ))}
              </Box>
            </Box>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 3 }} />
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <ComputerIcon sx={{ color: ACCENT, fontSize: 16, opacity: 0.6 }} />
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>
              © 2026 PC Store — Escuela de Tecnologías UTE · Todos los derechos reservados
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
