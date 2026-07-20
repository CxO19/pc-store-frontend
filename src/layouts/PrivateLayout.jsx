import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Drawer, AppBar, Toolbar, Typography, Avatar,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  IconButton, Divider, Tooltip
} from '@mui/material'
import ComputerIcon from '@mui/icons-material/Computer'
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
import { useAuth } from '../hooks/useAuth'
import { useThemeMode } from '../theme/ThemeModeContext'

const ACCENT = '#63CAAC'
const DRAWER_WIDTH = 240

const adminMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Usuarios', icon: <PeopleIcon />, path: '/admin/usuarios' },
  { text: 'Productos', icon: <InventoryIcon />, path: '/admin/productos' },
  { text: 'Categorías', icon: <CategoryIcon />, path: '/admin/categorias' },
  { text: 'Marcas', icon: <BrandingWatermarkIcon />, path: '/admin/marcas' },
  { text: 'Órdenes', icon: <ShoppingCartIcon />, path: '/admin/ordenes' },
]

const clientMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Mis Órdenes', icon: <ShoppingCartIcon />, path: '/admin/ordenes' },
]

export default function PrivateLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { mode, toggleMode, palette } = useThemeMode()

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return {}
    }
  })()
  const isAdmin = user?.role === 'admin'
  const menuItems = isAdmin ? adminMenuItems : clientMenuItems

  const drawer = (
    <Box sx={{
      height: '100%',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: ACCENT, width: 36, height: 36 }}>
          <ComputerIcon fontSize="small" sx={{ color: '#20232a' }} />
        </Avatar>
        <Typography variant="h6" fontWeight="bold" color="white">
          PC Store
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }} />

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
                    color: isActive ? '#20232a' : 'rgba(255,255,255,0.6)',
                    bgcolor: isActive ? ACCENT : 'transparent',
                    '&:hover': {
                      bgcolor: isActive ? ACCENT : 'rgba(99,202,172,0.1)',
                      color: isActive ? '#20232a' : ACCENT,
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <ListItemIcon sx={{
                    color: isActive ? '#20232a' : 'rgba(255,255,255,0.6)',
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

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }} />

      {/* User + Logout */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={() => navigate('/perfil')}
          sx={{
            borderRadius: 3,
            color: 'rgba(255,255,255,0.6)',
            mb: 1,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }
          }}
        >
          <ListItemIcon sx={{ color: 'rgba(255,255,255,0.6)', minWidth: 40 }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText
            primary={user?.firstName || 'Perfil'}
            secondary={isAdmin ? 'Administrador' : 'Cliente'}
            primaryTypographyProps={{ color: 'white', fontSize: 14 }}
            secondaryTypographyProps={{ color: ACCENT, fontSize: 12 }}
          />
        </ListItemButton>
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 3,
            color: 'rgba(239,68,68,0.7)',
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
            color: 'rgba(255,255,255,0.6)',
            mt: 1,
            '&:hover': { bgcolor: 'rgba(99,202,172,0.1)', color: ACCENT }
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
        background: 'rgba(26,26,46,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" color="white">PC Store</Typography>
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
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none', boxSizing: 'border-box' },
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
      }}>
        <Outlet />
      </Box>
    </Box>
  )
}