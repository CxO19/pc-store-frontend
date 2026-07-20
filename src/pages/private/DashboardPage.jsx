import {
  Box, Grid, Card, CardContent, Typography,
  CircularProgress, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper
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
const BG_CARD = 'rgba(255,255,255,0.04)'
const BORDER = '1px solid rgba(255,255,255,0.07)'

const statCards = (stats) => [
  { title: 'Usuarios', value: stats.users, icon: <PeopleIcon />, color: '#63CAAC' },
  { title: 'Productos', value: stats.products, icon: <InventoryIcon />, color: '#818cf8' },
  { title: 'Categorías', value: stats.categories, icon: <CategoryIcon />, color: '#f59e0b' },
  { title: 'Órdenes', value: stats.orders, icon: <ShoppingCartIcon />, color: '#f87171' },
]

const statusColor = {
  pending: { label: 'Pendiente', color: 'warning' },
  confirmed: { label: 'Confirmada', color: 'success' },
  cancelled: { label: 'Cancelada', color: 'error' },
}

export default function DashboardPage() {
  const { stats, productsByCategory, ordersByStatus, recentOrders, loading } = useDashboard()

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: ACCENT }} size={60} />
      </Box>
    )
  }

  return (
    <Box>
      {/* Título */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" fontWeight="bold" color="white" mb={0.5}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="rgba(255,255,255,0.4)" mb={4}>
          Resumen general del sistema
        </Typography>
      </motion.div>

      {/* Tarjetas resumen */}
      <Grid container spacing={3} mb={4}>
        {statCards(stats).map((card, index) => (
          <Grid item xs={12} sm={6} lg={3} key={card.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card sx={{
                background: BG_CARD,
                backdropFilter: 'blur(10px)',
                border: BORDER,
                borderRadius: 4,
                transition: 'all 0.3s',
                '&:hover': { border: `1px solid ${card.color}`, boxShadow: `0 0 20px ${card.color}33` }
              }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
                  <Box sx={{
                    width: 56, height: 56, borderRadius: 3,
                    bgcolor: `${card.color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: card.color, fontSize: 28,
                  }}>
                    {card.icon}
                  </Box>
                  <Box>
                    <Typography variant="body2" color="rgba(255,255,255,0.5)">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="white">
                      {card.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} mb={4}>

        {/* Gráfico de barras - Productos por categoría */}
        <Grid item xs={12} md={7}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card sx={{ background: BG_CARD, backdropFilter: 'blur(10px)', border: BORDER, borderRadius: 4, p: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="white" mb={3} px={1}>
                Productos por Categoría
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={productsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                    labelStyle={{ color: 'white' }}
                    itemStyle={{ color: ACCENT }}
                  />
                  <Bar dataKey="value" fill={ACCENT} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Grid>

        {/* Gráfico de torta - Órdenes por estado */}
        <Grid item xs={12} md={5}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card sx={{ background: BG_CARD, backdropFilter: 'blur(10px)', border: BORDER, borderRadius: 4, p: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="white" mb={3} px={1}>
                Órdenes por Estado
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={ordersByStatus}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ordersByStatus.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Legend
                    formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.7)' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Actividad reciente */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card sx={{ background: BG_CARD, backdropFilter: 'blur(10px)', border: BORDER, borderRadius: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="white" mb={3}>
              Órdenes Recientes
            </Typography>
            {recentOrders.length === 0 ? (
              <Typography color="rgba(255,255,255,0.4)" textAlign="center" py={3}>
                No hay órdenes aún
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {['ID', 'Usuario', 'Total', 'Estado', 'Fecha'].map(h => (
                        <TableCell key={h} sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.07)', fontSize: 12 }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.05)', fontSize: 12 }}>
                          {order.id?.slice(0, 8)}...
                        </TableCell>
                        <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.05)' }}>
                          {order.user?.firstName || order.userId?.slice(0, 8)}
                        </TableCell>
                        <TableCell sx={{ color: ACCENT, borderColor: 'rgba(255,255,255,0.05)', fontWeight: 'bold' }}>
                          ${Number(order.total).toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                          <Chip
                            label={statusColor[order.status]?.label || order.status}
                            color={statusColor[order.status]?.color || 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.05)', fontSize: 12 }}>
                          {new Date(order.createdAt).toLocaleDateString('es-EC')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  )
}