import { Box, CssBaseline } from '@mui/material'
import ThemeToggleButton from './ThemeToggleButton'
import CircuitBackground from './CircuitBackground'
import PcNeonHero from './PcNeonHero'
import FloatingBlobs from './FloatingBlobs'
import BrandPanel from './BrandPanel'

export default function AuthLayout({ palette, children }) {
  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      background: palette.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <CssBaseline />
      <ThemeToggleButton />

      {/* Marca de agua con lineas de circuito, llena toda la pagina */}
      <CircuitBackground palette={palette} />

      {/* Rieles laterales con ventilador giratorio, RAM y chip */}
      <PcNeonHero palette={palette} />

      {/* Blobs decorativos animados */}
      <FloatingBlobs palette={palette} />

      {/* Contenido centrado, con ancho maximo para no separarse en pantallas anchas */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 1000,
        mx: 'auto',
        px: { xs: 2, md: 4 },
        gap: { md: 6 },
        position: 'relative',
        zIndex: 1,
      }}>
        <BrandPanel palette={palette} />
        {children}
      </Box>
    </Box>
  )
}
