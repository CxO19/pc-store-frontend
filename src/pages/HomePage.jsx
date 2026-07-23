import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Button, Container, Card, CardContent, CardMedia,
  Accordion, AccordionSummary, AccordionDetails, Divider, Chip, Grid, IconButton
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { motion, AnimatePresence } from 'framer-motion'
import mockProducts from '../data/mockProducts'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

// ===== PALETA TECH =====
const C = {
  accent: '#00e5a0',
  accentHover: '#00c48c',
  accent2: '#4ade80',
  text: '#ffffff',
  text2: '#c5cad3',
  text3: '#888888',
  card: '#0a0a0f',
  cardHover: '#0f0f15',
  border: 'rgba(0,229,160,0.08)',
  borderHover: 'rgba(0,229,160,0.2)',
}

const categories = [
  { title: 'Procesadores', desc: 'Intel Core i9, AMD Ryzen 9 y más', gradient: 'linear-gradient(135deg, #0a0a0f, #0a0f10)', color: '#00e5a0' },
  { title: 'Motherboards', desc: 'ASUS, MSI, Gigabyte para tu build', gradient: 'linear-gradient(135deg, #0a0a0f, #0f0f0a)', color: '#4ade80' },
  { title: 'Memoria RAM', desc: 'DDR5, DDR4 de alto rendimiento', gradient: 'linear-gradient(135deg, #0a0a0f, #0f0a0a)', color: '#34d399' },
  { title: 'Almacenamiento', desc: 'SSD NVMe, SATA de 256GB a 4TB', gradient: 'linear-gradient(135deg, #0a0a0f, #0a0f0f)', color: '#2dd4bf' },
  { title: 'Tarjetas Gráficas', desc: 'NVIDIA RTX 4090, AMD RX 7900', gradient: 'linear-gradient(135deg, #0a0a0f, #0f0a0f)', color: '#a78bfa' },
  { title: 'Fuentes de Poder', desc: '80 Plus Gold, Platinum, 650W-1200W', gradient: 'linear-gradient(135deg, #0a0a0f, #0a0a0a)', color: '#f59e0b' },
]

const slides = [
  { img: '/images/hero-1.png', tag: 'PC STORE', title: 'Componentes de alto rendimiento', desc: 'Validación inteligente de compatibilidad en tiempo real.' },
  { img: '/images/hero-2.png', tag: 'ARDUINO', title: 'Microcontroladores para crear', desc: 'Placas, sensores y módulos para electrónica y robótica.' },
  { img: '/images/hero-3.png', tag: 'RASPBERRY PI', title: 'Computadoras de placa única', desc: 'IoT, automatización y desarrollo en un solo lugar.' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [slide, setSlide] = useState(0)
  const [faqOpen, setFaqOpen] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [])

  const featured = mockProducts.slice(0, 8)

  return (
    <Box sx={{ bgcolor: '#000', color: C.text, minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>

      {/* ===== FONDO ANIMADO ===== */}
      <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, ${C.accent}08 1px, transparent 1px)`, backgroundSize: '50px 50px', opacity: 0.4 }} />
        <Box sx={{ position: 'absolute', top: '-15%', right: '-10%', width: '50%', height: '60%', background: `radial-gradient(ellipse, ${C.accent}06 0%, transparent 70%)`, filter: 'blur(80px)' }} />
        <Box sx={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '40%', height: '50%', background: `radial-gradient(ellipse, ${C.accent2}04 0%, transparent 70%)`, filter: 'blur(80px)' }} />
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1 }}>

      {/* ===== NAV ===== */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, bgcolor: 'rgba(0,0,0,0.85)', backdropFilter: 'saturate(180%) blur(20px)', px: { xs: 2.5, md: 8 }, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
        <Typography onClick={() => navigate('/')} sx={{ fontWeight: 700, fontSize: '1rem', letterSpacing: 2.5, cursor: 'pointer', color: C.text, background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PC STORE</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Button onClick={() => navigate('/login')} sx={{ color: C.text3, textTransform: 'none', fontWeight: 500, fontSize: '0.85rem', '&:hover': { color: C.accent } }}>Ingresar</Button>
          <Button onClick={() => navigate('/register')} sx={{ bgcolor: C.accent, color: '#fff', textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', borderRadius: 1.5, px: 2.5, py: 0.8, '&:hover': { bgcolor: C.accentHover } }}>Registrarse</Button>
        </Box>
      </Box>

      {/* ===== HERO ===== */}
      <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div key={slide} initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2, ease: 'easeInOut' }} style={{ position: 'absolute', inset: 0 }}>
            <Box component="img" src={slides[slide].img} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.25)' }} />
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, #000 0%, transparent 50%)' }} />
          </motion.div>
        </AnimatePresence>

        <IconButton onClick={() => setSlide(s => (s - 1 + slides.length) % slides.length)} sx={{ position: 'absolute', left: { xs: 8, md: 24 }, top: '50%', color: '#fff', opacity: 0.5, '&:hover': { opacity: 1 } }}><ArrowBackIosNewIcon /></IconButton>
        <IconButton onClick={() => setSlide(s => (s + 1) % slides.length)} sx={{ position: 'absolute', right: { xs: 8, md: 24 }, top: '50%', color: '#fff', opacity: 0.5, '&:hover': { opacity: 1 } }}><ArrowForwardIosIcon /></IconButton>

        <Container maxWidth="lg" sx={{ height: '100%', display: 'flex', alignItems: 'flex-end', pb: 16, position: 'relative', zIndex: 10 }}>
          <motion.div key={`t-${slide}`} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <Typography sx={{ color: C.accent, fontWeight: 500, letterSpacing: 3, fontSize: '0.7rem', mb: 2 }}>{slides[slide].tag}</Typography>
            <Typography variant="h1" fontWeight={600} sx={{ fontSize: { xs: '2.2rem', md: '4rem' }, letterSpacing: -1.5, color: C.text, mb: 2, lineHeight: 1.05 }}>{slides[slide].title}</Typography>
            <Typography sx={{ color: C.text2, fontSize: { xs: '1rem', md: '1.3rem' }, mb: 6, maxWidth: 500, fontWeight: 300 }}>{slides[slide].desc}</Typography>
            <Box display="flex" gap={2}>
              <Button onClick={() => navigate('/productos')} size="large" sx={{ bgcolor: C.accent, color: '#fff', fontWeight: 600, px: 5, py: 1.8, fontSize: '1rem', textTransform: 'none', borderRadius: 1.5, '&:hover': { bgcolor: C.accentHover } }}>Explorar catálogo</Button>
              <Button onClick={() => navigate('/register')} size="large" sx={{ color: C.text, border: '1px solid rgba(255,255,255,0.2)', fontWeight: 500, px: 4, py: 1.8, fontSize: '1rem', textTransform: 'none', borderRadius: 1.5, '&:hover': { border: `1px solid ${C.accent}`, color: C.accent } }}>Crear cuenta</Button>
            </Box>
          </motion.div>
        </Container>

        <Box sx={{ position: 'absolute', bottom: 40, right: { xs: 20, md: 60 }, display: 'flex', gap: 2, zIndex: 10 }}>
          {slides.map((_, i) => (
            <Box key={i} onClick={() => setSlide(i)} sx={{ width: slide === i ? 28 : 7, height: 7, borderRadius: 4, cursor: 'pointer', bgcolor: slide === i ? C.accent : 'rgba(255,255,255,0.3)', transition: 'all 0.6s' }} />
          ))}
        </Box>
      </Box>

      {/* ===== CATEGORÍAS ===== */}
      <Box sx={{ py: { xs: 10, md: 20 }, px: { xs: 2.5, md: 8 }, overflow: 'hidden' }}>
        <Container maxWidth="lg" disableGutters>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}>
            <Typography sx={{ color: C.accent, fontWeight: 500, letterSpacing: 2.5, fontSize: '0.7rem', mb: 1.5 }}>CATEGORÍAS</Typography>
            <Typography variant="h2" fontWeight={600} sx={{ fontSize: { xs: '2rem', md: '3.5rem' }, color: C.text, letterSpacing: -1.5, mb: 2 }}>Todo para tu PC.</Typography>
            <Typography sx={{ color: C.text3, fontSize: '1.2rem', mb: 10, fontWeight: 300 }}>Explora nuestras categorías de componentes.</Typography>
          </motion.div>

          <Grid container spacing={3}>
            {categories.map((cat, i) => (
              <Grid item xs={12} sm={6} md={6} key={i}>
                <motion.div initial={{ opacity: 0, y: 60, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.08, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} whileHover={{ scale: 1.01 }} onClick={() => navigate('/productos')} style={{ cursor: 'pointer', height: '100%' }}>
                  <Card sx={{ height: '100%', borderRadius: 4, background: cat.gradient, border: `1px solid ${C.border}`, overflow: 'hidden', transition: 'all 0.4s', '&:hover': { border: `1px solid ${C.borderHover}`, boxShadow: '0 30px 60px rgba(0,0,0,0.6)' } }}>
                    <CardContent sx={{ p: { xs: 3, md: 5 }, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Box sx={{ width: 4, height: 60, borderRadius: 2, bgcolor: cat.color, flexShrink: 0 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" fontWeight={600} sx={{ color: C.text, letterSpacing: -0.5, mb: 1, fontSize: '1.3rem' }}>{cat.title}</Typography>
                        <Typography variant="body2" sx={{ color: C.text3, lineHeight: 1.6, fontWeight: 300, mb: 2 }}>{cat.desc}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.6, transition: 'all 0.3s', '.MuiCard-root:hover &': { opacity: 1 } }}>
                          <Typography sx={{ color: cat.color, fontWeight: 500, fontSize: '0.85rem' }}>Explorar</Typography>
                          <ArrowForwardIcon sx={{ fontSize: 14, color: cat.color }} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== PRODUCTOS DESTACADOS ===== */}
      <Box sx={{ bgcolor: '#030305', py: { xs: 10, md: 16 }, px: { xs: 2.5, md: 8 } }}>
        <Container maxWidth="lg" disableGutters>
          <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={8}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <Typography sx={{ color: C.accent, fontWeight: 500, letterSpacing: 2.5, fontSize: '0.7rem', mb: 1.5 }}>DESTACADOS</Typography>
              <Typography variant="h2" fontWeight={600} sx={{ fontSize: { xs: '2rem', md: '3rem' }, color: C.text, letterSpacing: -1 }}>Lo más vendido.</Typography>
            </motion.div>
            <Button onClick={() => navigate('/productos')} sx={{ color: C.text3, textTransform: 'none', fontWeight: 500, '&:hover': { color: C.accent } }}>Ver catálogo <ArrowForwardIcon sx={{ ml: 0.5, fontSize: 16 }} /></Button>
          </Box>
          <Grid container spacing={2}>
            {featured.map((p, i) => (
              <Grid item xs={12} sm={6} md={3} key={p.id}>
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.04, duration: 0.5 }} whileHover={{ y: -6 }} style={{ height: '100%' }}>
                  <Card onClick={() => navigate(`/productos/${p.id}`)} sx={{ height: '100%', bgcolor: C.card, border: `1px solid ${C.border}`, borderRadius: 3, cursor: 'pointer', overflow: 'hidden', transition: 'all 0.3s', '&:hover': { border: `1px solid ${C.borderHover}`, bgcolor: C.cardHover } }}>
                    <Box sx={{ height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#06060b', p: 2 }}>
                      <CardMedia component="img" image={p.imageUrl} alt={p.name} sx={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Typography sx={{ color: C.text3, fontSize: '0.7rem', mb: 1 }}>{p.category?.name}</Typography>
                      <Typography fontWeight={600} sx={{ color: C.text, fontSize: '0.9rem', mb: 0.5 }} noWrap>{p.name}</Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                        <Typography fontWeight={700} sx={{ color: C.accent, fontSize: '1.05rem' }}>${p.price.toFixed(2)}</Typography>
                        <Button size="small" onClick={(e) => { e.stopPropagation(); addToCart(p, 1); toast.success('Agregado') }} sx={{ color: C.accent, textTransform: 'none', fontWeight: 500, fontSize: '0.8rem', minWidth: 'auto', '&:hover': { color: C.accentHover } }}>+ Agregar</Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== FAQ ===== */}
      <Box sx={{ py: { xs: 10, md: 16 }, px: { xs: 2.5, md: 8 } }}>
        <Container maxWidth="md" disableGutters>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <Typography sx={{ color: C.accent, fontWeight: 500, letterSpacing: 2.5, fontSize: '0.7rem', mb: 1.5, textAlign: 'center' }}>FAQ</Typography>
            <Typography variant="h2" fontWeight={600} sx={{ fontSize: { xs: '2rem', md: '3rem' }, color: C.text, letterSpacing: -1, textAlign: 'center', mb: 8 }}>Preguntas frecuentes.</Typography>
          </motion.div>
          {[
            { q: '¿Cómo funciona la validación de compatibilidad?', a: 'El sistema cruza especificaciones como socket, tipo de RAM y consumo para garantizar 100% de compatibilidad entre componentes.' },
            { q: '¿Cuánto tardan los envíos?', a: '24-48h en ciudad, 3-5 días hábiles nacional. Seguimiento en tiempo real.' },
            { q: '¿Ofrecen garantía?', a: 'Garantía del fabricante + 30 días de garantía directa PC Store.' },
          ].map((faq, i) => (
            <Accordion key={i} expanded={faqOpen === i} onChange={() => setFaqOpen(faqOpen === i ? false : i)} elevation={0}
              sx={{ bgcolor: C.card, border: `1px solid ${C.border}`, borderRadius: '10px !important', mb: 1.5, overflow: 'hidden', '&:before': { display: 'none' }, '&.Mui-expanded': { border: `1px solid ${C.borderHover}` } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: C.accent }} />} sx={{ px: 3, '& .MuiAccordionSummary-content': { my: 1.5 } }}>
                <Typography fontWeight={500} sx={{ color: C.text, fontSize: '0.95rem' }}>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3 }}>
                <Typography sx={{ color: C.text3, lineHeight: 1.8, fontSize: '0.9rem' }}>{faq.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* ===== CTA ===== */}
      <Box sx={{ bgcolor: '#030305', borderTop: `1px solid ${C.border}`, py: 20, textAlign: 'center', px: 2.5 }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <Typography variant="h2" fontWeight={600} sx={{ fontSize: { xs: '2rem', md: '3.5rem' }, color: C.text, letterSpacing: -1, mb: 3 }}>¿Listo para armar tu PC?</Typography>
          <Typography sx={{ color: C.text3, fontSize: '1.1rem', mb: 6, maxWidth: 400, mx: 'auto', fontWeight: 300 }}>Explora cientos de componentes verificados.</Typography>
          <Button onClick={() => navigate('/register')} size="large" sx={{ bgcolor: C.accent, color: '#fff', fontWeight: 600, px: 8, py: 2.5, fontSize: '1.1rem', textTransform: 'none', borderRadius: 1.5, '&:hover': { bgcolor: C.accentHover } }}>Crear cuenta gratis</Button>
        </motion.div>
      </Box>

      {/* ===== FOOTER ===== */}
      <Box sx={{ bgcolor: '#000', borderTop: `1px solid ${C.border}`, py: 10, px: { xs: 2.5, md: 8 } }}>
        <Container maxWidth="lg" disableGutters>
          <Grid container spacing={6}>
            <Grid item xs={12} md={5}>
              <Typography fontWeight={700} sx={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 2, mb: 2, fontSize: '1rem' }}>PC STORE</Typography>
              <Typography variant="body2" sx={{ color: C.text3, lineHeight: 1.8, maxWidth: 280 }}>Plataforma de componentes de PC con validación inteligente de compatibilidad.</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography fontWeight={600} sx={{ color: C.text, mb: 2, fontSize: '0.85rem' }}>Enlaces</Typography>
              {['Catálogo', 'Ingresar', 'Registrarse'].map(l => (
                <Typography key={l} variant="body2" sx={{ color: C.text3, mb: 1.5, cursor: 'pointer', fontSize: '0.85rem', '&:hover': { color: C.accent } }}>{l}</Typography>
              ))}
            </Grid>
            <Grid item xs={6} md={4}>
              <Typography fontWeight={600} sx={{ color: C.text, mb: 2, fontSize: '0.85rem' }}>Contacto</Typography>
              <Typography variant="body2" sx={{ color: C.text3, mb: 1, fontSize: '0.85rem' }}>contacto@pcstore.com</Typography>
              <Typography variant="body2" sx={{ color: C.text3, mb: 1, fontSize: '0.85rem' }}>+593 99 123 4567</Typography>
              <Typography variant="body2" sx={{ color: C.text3, fontSize: '0.85rem' }}>UTE, Quito — Ecuador</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ borderColor: C.border, my: 6 }} />
          <Typography textAlign="center" variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>© 2026 PC Store — Escuela de Tecnologías UTE</Typography>
        </Container>
      </Box>

      </Box>
    </Box>
  )
}
