import {
  Box, Card, CardContent, Typography,
  CircularProgress, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import InventoryIcon from '@mui/icons-material/Inventory'
import CategoryIcon from '@mui/icons-material/Category'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { useDashboard } from '../../hooks/useDashboard'

const ACCENT = '#63CAAC'
const BG_CARD = 'rgba(255, 255, 255, 0.05)'
const BORDER = '1px solid rgba(255, 255, 255, 0.12)'

const statusColor = {
  pending: { label: 'Pendiente', color: 'warning' },
  confirmed: { label: 'Confirmada', color: 'success' },
  cancelled: { label: 'Cancelada', color: 'error' },
}

export default function DashboardPage() {
  const { stats = {}, productsByCategory = [], ordersByStatus = [], recentOrders = [], loading } = useDashboard()

  const statCards = [
    { title: 'Usuarios', value: stats.users ?? 0, icon: <PeopleIcon fontSize="medium" />, color: '#63CAAC' },
    { title: 'Productos', value: stats.products ?? 0, icon: <InventoryIcon fontSize="medium" />, color: '#818cf8' },
    { title: 'Categorías', value: stats.categories ?? 0, icon: <CategoryIcon fontSize="medium" />, color: '#f59e0b' },
    { title: 'Órdenes', value: stats.orders ?? 0, icon: <ShoppingCartIcon fontSize="medium" />, color: '#f87171' },
  ]

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress sx={{ color: ACCENT }} size={50} />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 3 }, boxSizing: 'border-box' }}>
      
      {/* --- ENCABEZADO MEJORADO (Mayor Visibilidad y Elegancia) --- */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Typography 
          variant="h4" 
          fontWeight={800} 
          sx={{ 
            color: '#FFFFFF', 
            letterSpacing: '-0.02em', 
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            mb: 0.5 
          }}
        >
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.75)', mb: 4, fontWeight: 400 }}>
          Resumen general y métricas clave del sistema
        </Typography>
      </motion.div>

      {/* --- TARJETAS EN FILA HORIZONTAL (CSS GRID 4 COLUMNAS) --- */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
          gap: 3, 
          mb: 4 
        }}
      >
        {statCards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ y: -3 }}
          >
            <Card
              sx={{
                background: BG_CARD,
                backdropFilter: 'blur(16px)',
                border: BORDER,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  border: `1px solid ${card.color}`,
                  boxShadow: `0 6px 24px ${card.color}30`
                }
              }}
            >
              <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, mb: 0.5 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ color: '#FFFFFF' }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    bgcolor: `${card.color}22`,
                    border: `1px solid ${card.color}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color,
                  }}
                >
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* --- SECCIÓN DE GRÁFICOS (2 COLUMNAS) --- */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' }, 
          gap: 3, 
          mb: 4 
        }}
      >
        {/* Gráfico 1: Barras */}
        <Card sx={{ background: BG_CARD, backdropFilter: 'blur(16px)', border: BORDER, borderRadius: 3, p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF', mb: 3 }}>
            Productos por Categoría
          </Typography>
          <Box sx={{ width: '100%', height: 300 }}>
            {productsByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#121222', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8 }}
                    labelStyle={{ color: '#FFF', fontWeight: 'bold' }}
                    itemStyle={{ color: ACCENT }}
                  />
                  <Bar dataKey="value" fill={ACCENT} radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>Sin datos de categorías</Typography>
              </Box>
            )}
          </Box>
        </Card>

        {/* Gráfico 2: Torta */}
        <Card sx={{ background: BG_CARD, backdropFilter: 'blur(16px)', border: BORDER, borderRadius: 3, p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF', mb: 3 }}>
            Órdenes por Estado
          </Typography>
          <Box sx={{ width: '100%', height: 300 }}>
            {ordersByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ordersByStatus}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {ordersByStatus.map((entry, index) => (
                      <Cell key={index} fill={entry.color || ACCENT} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#121222', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8 }}
                    itemStyle={{ color: '#FFF' }}
                  />
                  <Legend formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>Sin datos de órdenes</Typography>
              </Box>
            )}
          </Box>
        </Card>
      </Box>

      {/* --- TABLA DE ACTIVIDAD RECIENTE --- */}
      <Card sx={{ background: BG_CARD, backdropFilter: 'blur(16px)', border: BORDER, borderRadius: 3, p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF', mb: 3 }}>
          Órdenes Recientes
        </Typography>
        {recentOrders.length === 0 ? (
          <Typography color="rgba(255,255,255,0.5)" textAlign="center" py={4}>
            No hay órdenes registradas aún
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['ID Órden', 'Cliente', 'Total', 'Estado', 'Fecha'].map((h) => (
                    <TableCell key={h} sx={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.1)', fontWeight: 'bold' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' } }}>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.05)' }}>
                      #{order.id?.slice(0, 8)}
                    </TableCell>
                    <TableCell sx={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.05)', fontWeight: 500 }}>
                      {order.user?.firstName || order.userId?.slice(0, 8) || 'Cliente'}
                    </TableCell>
                    <TableCell sx={{ color: ACCENT, borderColor: 'rgba(255,255,255,0.05)', fontWeight: 'bold' }}>
                      ${Number(order.total || 0).toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      <Chip
                        label={statusColor[order.status]?.label || order.status}
                        color={statusColor[order.status]?.color || 'default'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.05)' }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-EC') : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

    </Box>
  )
}