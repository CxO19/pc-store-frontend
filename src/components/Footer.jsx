import { Box, Typography, Container } from '@mui/material'
import { useThemeMode } from '../theme/ThemeModeContext'

export default function Footer() {
  const { palette } = useThemeMode()

  return (
    <Box
      component="footer"
      sx={{
        borderTop: `1px solid ${palette.paperBorder}`,
        py: 2,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center" sx={{ color: palette.textSecondary }}>
          © {new Date().getFullYear()} PC Store — Todos los derechos reservados
        </Typography>
      </Container>
    </Box>
  )
}