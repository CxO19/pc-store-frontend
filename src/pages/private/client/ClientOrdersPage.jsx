import { useEffect, useState } from 'react'
import {
  Box, Typography, Card, CardContent, Chip, Button, Divider, Grid, CircularProgress
} from '@mui/material'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../../api/axios'
import { useThemeMode } from '../../../theme/ThemeModeContext'
import { primaryBtnSx } from '../../../theme/adminStyles'

export default function ClientOrdersPage() {
  const { palette } = useThemeMode()
  const navigate = useNavigate()
  const isLight = palette.mode === 'light'

  const textColor = isLight ? '#1a1a1a' : '#ffffff'
  const textMuted = isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my-orders')
      .then(({ data }) => {
        setOrders(data.data || data || [])
      })
      .catch(() => {
        toast.error('No se pudo cargar el historial de órdenes')
      })
      .finally(() => setLoading(false))
  }, [])

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'entregado':
        return { label: 'Entregado', bg: palette.successBg, color: palette.success, border: palette.successBorder }
      case 'processing':
      case 'procesando':
        return { label: 'Procesando', bg: `${palette.accent}20`, color: palette.accent, border: palette.accent }
      case 'shipped':
      case 'en camino':
        return { label: 'En camino', bg: palette.infoBg || 'rgba(33, 150, 243, 0.15)', color: palette.info || '#2196f3', border: palette.infoBorder || 'rgba(33, 150, 243, 0.3)' }
      default:
        return { label: status || 'Pendiente', bg: palette.dangerBg, color: palette.danger, border: palette.dangerBorder }
    }
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${palette.accent}15`,
            color: palette.accent,
            border: `1px solid ${palette.accent}30`,
          }}
        >
          <ReceiptLongOutlinedIcon />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: textColor, textShadow: palette.mode === 'dark' ? `0 0 30px ${palette.accentGlow}` : 'none' }}>
            Mis Órdenes
          </Typography>
          <Typography sx={{ color: textMuted }}>
            Aquí puedes consultar el historial y estado de tus compras realizadas en PC Store.
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: palette.accent }} />
        </Box>
      ) : orders.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            bgcolor: palette.paperBg,
            border: `1px solid ${palette.paperBorder}`,
            boxShadow: isLight 
              ? '0 10px 30px rgba(0, 0, 0, 0.08)' 
              : '0 10px 30px -10px rgba(99, 202, 172, 0.15)',
            borderRadius: 4,
            p: 6,
            textAlign: 'center',
            backgroundImage: 'none',
          }}
        >
          <ShoppingBagOutlinedIcon sx={{ fontSize: 60, color: textMuted, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ color: textColor, mb: 1 }}>
            No tenés compras registradas
          </Typography>
          <Typography sx={{ color: textMuted, mb: 3 }}>
            Explorá nuestro catálogo de componentes y armá tu setup ideal.
          </Typography>
          {/* 💡 CORREGIDO: Usando navigate en lugar de href para ir a la vista correcta */}
          <Button 
            variant="contained" 
            onClick={() => navigate('/dashboard/productos')} 
            sx={primaryBtnSx(palette)}
          >
            Ver catálogo
          </Button>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {orders.map((order) => {
            const statusInfo = getStatusConfig(order.status)
            return (
              <Card
                key={order.id}
                elevation={0}
                sx={{
                  bgcolor: palette.paperBg,
                  border: `1px solid ${palette.paperBorder}`,
                  borderRadius: 4,
                  backgroundImage: 'none',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  '&:hover': {
                    borderColor: `${palette.accent}50`,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: textMuted, display: 'block' }}>
                        ORDEN #{order.id?.slice(-8).toUpperCase() || order.id}
                      </Typography>
                      <Typography variant="body2" sx={{ color: textMuted }}>
                        Fecha: {new Date(order.createdAt || Date.now()).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={statusInfo.label}
                      sx={{
                        bgcolor: statusInfo.bg,
                        color: statusInfo.color,
                        border: `1px solid ${statusInfo.border}`,
                        fontWeight: 'bold',
                        px: 1,
                      }}
                    />
                  </Box>

                  <Divider sx={{ borderColor: palette.paperBorder, my: 2 }} />

                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {order.items?.map((item, idx) => (
                          <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: textColor }}>
                              • {item.productName || item.name} <span style={{ color: textMuted }}>x{item.quantity}</span>
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" sx={{ color: textColor }}>
                              ${(Number(item.price) * item.quantity).toFixed(2)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, justifyContent: 'space-between', alignItems: { xs: 'center', md: 'flex-end' }, gap: 1 }}>
                      <Box sx={{ textAlign: { md: 'right' } }}>
                        <Typography variant="caption" sx={{ color: textMuted, display: 'block' }}>
                          Total de la compra
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: palette.accent }}>
                          ${Number(order.total || order.amount || 0).toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )
          })}
        </Box>
      )}
    </Box>
  )
}