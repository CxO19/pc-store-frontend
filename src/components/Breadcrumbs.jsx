import { Breadcrumbs as MuiBreadcrumbs, Typography, Link as MuiLink } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { useThemeMode } from '../theme/ThemeModeContext'

const LABELS = {
  admin: 'Administración',
  dashboard: 'Dashboard',
  usuarios: 'Usuarios',
  productos: 'Productos',
  categorias: 'Categorías',
  marcas: 'Marcas',
  ordenes: 'Órdenes',
  perfil: 'Perfil',
}

export default function Breadcrumbs() {
  const { pathname } = useLocation()
  const { palette } = useThemeMode()
  const parts = pathname.split('/').filter(Boolean)

  if (parts.length === 0) return null

  return (
    <MuiBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" sx={{ color: palette.textSecondary }} />}
      sx={{ mb: 2 }}
    >
      <MuiLink component={Link} to="/" underline="hover" sx={{ color: palette.textSecondary }}>
        Inicio
      </MuiLink>
      {parts.map((part, idx) => {
        const path = '/' + parts.slice(0, idx + 1).join('/')
        const isLast = idx === parts.length - 1
        const label = LABELS[part] || part

        return isLast ? (
          <Typography key={path} sx={{ color: palette.textPrimary, fontWeight: 600 }}>
            {label}
          </Typography>
        ) : (
          <MuiLink key={path} component={Link} to={path} underline="hover" sx={{ color: palette.textSecondary }}>
            {label}
          </MuiLink>
        )
      })}
    </MuiBreadcrumbs>
  )
}