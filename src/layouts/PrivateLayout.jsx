import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Drawer, AppBar, Toolbar,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  IconButton, Divider
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import InventoryIcon from '@mui/icons-material/Inventory'
import CategoryIcon from '@mui/icons-material/Category'
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useThemeMode } from '../theme/ThemeModeContext'
import Footer from '../components/Footer'
import Breadcrumbs from '../components/Breadcrumbs'

const ACCENT = '#63CAAC'
const DRAWER_WIDTH = 240
const BG_DARK = 'linear-gradient(135deg, #20232a, #1a1a1a, #20232a)'

const adminMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Usuarios', icon: <PeopleIcon />, path: '/admin/usuarios' },
  { text: 'Productos', icon: <InventoryIcon />, path: '/admin/productos' },
  { text: 'Categorías', icon: <CategoryIcon />, path: '/admin/categorias' },
  { text: 'Marcas', icon: <BrandingWatermarkIcon />, path: '/admin/marcas' },
  { text: 'Órdenes', icon: <ShoppingCartIcon />, path: '/admin/ordenes' },
]

const clientMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Productos', icon: <InventoryIcon />, path: '/dashboard/productos' },
  { text: 'Mis Órdenes', icon: <ShoppingCartIcon />, path: '/dashboard/ordenes' },
]

export default function PrivateLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { mode, toggleMode, palette } = useThemeMode()
  const { user, isAdmin, logout } = useAuth()
  const menuItems = isAdmin ? adminMenuItems : clientMenuItems
  const isLight = mode === 'light'
  const textColor = isLight ? '#1a1a1a' : '#ffffff'
  const textMutedColor = isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)'
  const dividerColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.07)'
  const hoverBg = isLight ? 'rgba(99,202,172,0.15)' : 'rgba(99,202,172,0.1)'

  const drawer = (
    <Box sx={{
      height: '100%',
      background: isLight ? '#ffffff' : BG_DARK,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Logo maximizado y muy visible */}
      <Box sx={{ px: 1.5, py: 3.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          component="img"
          src={isLight ? '/Logo-negro.png' : '/Logo-blanco.png'}
          alt="PC Store Logo"
          sx={{
            height: 85,
            width: '100%',
            maxWidth: 210,
            objectFit: 'contain',
          }}
        />
      </Box>

      <Divider sx={{ borderColor: dividerColor }} />

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, px: 1, pt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <motion.div style={{ width: '100%' }} whileHover={{ x: 4 }}>
                <ListItemButton
                  onClick={() => { navigate(item.path); setMobileOpen(false) }}
                  sx={{
                    borderRadius: 3,
                    color: isActive ? '#20232a' : textMutedColor,
                    bgcolor: isActive ? ACCENT : 'transparent',
                    '&:hover': {
                      bgcolor: isActive ? ACCENT : hoverBg,
                      color: isActive ? '#20232a' : ACCENT,
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <ListItemIcon sx={{
                    color: isActive ? '#20232a' : textMutedColor,
                    minWidth: 40,
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 'normal', fontSize: 14 }}
                  />
                </ListItemButton>
              </motion.div>
            </ListItem>
          )
        })}
      </List>

      <Divider sx={{ borderColor: dividerColor }} />

      {/* User + Logout + Theme Toggle */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={() => navigate(isAdmin ? '/admin/perfil' : '/dashboard/perfil')}
          sx={{
            borderRadius: 3,
            color: textMutedColor,
            mb: 1,
            '&:hover': { bgcolor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)', color: textColor }
          }}
        >
          <ListItemIcon sx={{ color: textMutedColor, minWidth: 40 }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText
            primary={user?.firstName || 'Perfil'}
            secondary={isAdmin ? 'Administrador' : 'Cliente'}
            primaryTypographyProps={{ color: textColor, fontSize: 14 }}
            secondaryTypographyProps={{ color: ACCENT, fontSize: 12, fontWeight: 'bold' }}
          />
        </ListItemButton>

        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 3,
            color: isLight ? '#ef4444' : 'rgba(239,68,68,0.7)',
            '&:hover': { bgcolor: 'rgba(239,68,68,0.1)', color: '#f87171' }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ fontSize: 14 }} />
        </ListItemButton>

        <ListItemButton
          onClick={toggleMode}
          sx={{
            borderRadius: 3,
            color: textMutedColor,
            mt: 1,
            '&:hover': { bgcolor: hoverBg, color: ACCENT }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </ListItemIcon>
          <ListItemText
            primary={mode === 'light' ? 'Modo oscuro' : 'Modo claro'}
            primaryTypographyProps={{ fontSize: 14 }}
          />
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: palette.bg }}>
      {/* AppBar mobile */}
      <AppBar position="fixed" elevation={0} sx={{
        display: { sm: 'none' },
        background: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(32,35,42,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${dividerColor}`,
      }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <IconButton color="inherit" onClick={() => setMobileOpen(true)} sx={{ color: textColor }}>
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            src={isLight ? '/Logo-negro.png' : '/Logo-blanco.png'}
            alt="PC Store Logo"
            sx={{ height: 60, width: 'auto', objectFit: 'contain', mr: 2 }}
          />
        </Toolbar>
      </AppBar>

      {/* Drawer mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' },
        }}
      >
        {drawer}
      </Drawer>

      {/* Drawer desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            width: DRAWER_WIDTH, 
            border: 'none', 
            borderRight: `1px solid ${dividerColor}`,
            boxSizing: 'border-box' 
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{
        flexGrow: 1,
        ml: { sm: `${DRAWER_WIDTH}px` },
        mt: { xs: '64px', sm: 0 },
        p: 3,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Box sx={{ flexGrow: 1 }}>
          <Breadcrumbs />
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  )
}