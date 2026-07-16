import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Slide } from '@mui/material'
import ComputerIcon from '@mui/icons-material/Computer'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useThemeMode } from '../theme/ThemeModeContext'
import AuthLayout from '../components/AuthLayout'
import AuthCard from '../components/AuthCard'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'

const ROUTE_ORDER = ['/', '/register']

export default function AuthPage() {
  const location = useLocation()
  const { palette } = useThemeMode()
  const isRegister = location.pathname === '/register'

  const [activeView, setActiveView] = useState(isRegister ? 'register' : 'login')
  const [slideIn, setSlideIn] = useState(true)
  const [direction, setDirection] = useState('left')
  const prevPath = useRef(location.pathname)

  useEffect(() => {
    const currentPath = location.pathname
    if (currentPath === prevPath.current) return
    if (currentPath !== '/' && currentPath !== '/register') return

    const prevIdx = ROUTE_ORDER.indexOf(prevPath.current)
    const nextIdx = ROUTE_ORDER.indexOf(currentPath)
    const dir = nextIdx > prevIdx ? 'left' : 'right'
    setDirection(dir)
    setSlideIn(false)

    const timer = setTimeout(() => {
      setActiveView(currentPath === '/register' ? 'register' : 'login')
      setSlideIn(true)
      prevPath.current = currentPath
    }, 300)

    return () => clearTimeout(timer)
  }, [location.pathname])

  const config = {
    login: {
      icon: <ComputerIcon fontSize="large" sx={{ color: palette.accentContrast }} />,
      title: 'Bienvenido de nuevo',
      subtitle: 'Inicia sesión para continuar',
    },
    register: {
      icon: <PersonAddIcon fontSize="large" sx={{ color: palette.accentContrast }} />,
      title: 'Crear cuenta',
      subtitle: 'Únete a PC Store',
    },
  }

  const current = config[activeView]

  return (
    <AuthLayout palette={palette}>
      <AuthCard
        palette={palette}
        icon={current.icon}
        title={current.title}
        subtitle={current.subtitle}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
          <Slide direction={direction} in={slideIn} timeout={300}>
            <Box>
              {activeView === 'login' ? <LoginForm /> : <RegisterForm />}
            </Box>
          </Slide>
        </Box>
      </AuthCard>
    </AuthLayout>
  )
}
