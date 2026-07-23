import { useEffect, useState } from 'react'
import { Box, Typography, Chip, CircularProgress } from '@mui/material'
import toast from 'react-hot-toast'
import api from '../../../api/axios'
import DataTable from '../../../components/admin/DataTable'
import { useThemeMode } from '../../../theme/ThemeModeContext'

const STATUS_OPTIONS = ['Todos', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  shipped: 'Enviada',
  delivered: 'Entregada',
  cancelled: 'Cancelada',
}

const statusColors = {
  pending: 'warning',
  confirmed: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
}

export default function OrdersAdminPage() {
  const { palette } = useThemeMode()
  const isLight = palette.mode === 'light'
  const textColor = isLight ? '#1a1a1a' : '#ffffff'

  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const fetchOrders = () => {
    setLoading(true)
    const params = { page, limit, sortBy, sortOrder }
    if (search) params.search = search
    if (statusFilter !== 'Todos') params.status = statusFilter

    api.get('/orders', { params })
      .then(res => {
        setRows(res.data.data || res.data || [])
        setTotal(res.data.total || res.data.data?.length || 0)
      })
      .catch(() => toast.error('Error al cargar órdenes'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [page, limit, sortBy, sortOrder, statusFilter])

  const columns = [
    { id: 'id', label: 'ID Orden', sortable: true, render: (row) => `#${row.id?.slice(0, 8) || '—'}` },
    { id: 'user', label: 'Cliente', sortable: false, render: (row) => row.user?.firstName || row.user?.email || row.userId?.slice(0, 8) || 'Cliente' },
    { id: 'total', label: 'Total', sortable: true, render: (row) => `$${Number(row.total || 0).toFixed(2)}`, align: 'right' },
    { id: 'status', label: 'Estado', sortable: true, render: (row) => (
      <Chip label={statusLabels[row.status] || row.status} color={statusColors[row.status] || 'default'} size="small" sx={{ fontWeight: 600 }} />
    )},
    { id: 'createdAt', label: 'Fecha', sortable: true, render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString('es-EC') : '—' },
  ]

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 3 }, boxSizing: 'border-box' }}>
      <Typography variant="h4" fontWeight={800} sx={{ color: textColor, mb: 1 }}>Gestión de Órdenes</Typography>
      <Typography variant="body1" sx={{ color: isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)', mb: 3 }}>
        Visualiza y administra todas las órdenes del sistema
      </Typography>

      {/* Filtro por estado */}
      <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
        {STATUS_OPTIONS.map(s => (
          <Chip key={s} label={s === 'Todos' ? 'Todos' : statusLabels[s] || s}
            onClick={() => { setStatusFilter(s); setPage(1) }}
            sx={{
              bgcolor: statusFilter === s ? palette.accent : (isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)'),
              color: statusFilter === s ? '#1a1a1a' : textColor,
              fontWeight: 'bold',
              border: `1px solid ${statusFilter === s ? palette.accent : palette.paperBorder}`,
              cursor: 'pointer',
              '&:hover': { bgcolor: statusFilter === s ? palette.accent : `${palette.accent}30` }
            }}
          />
        ))}
      </Box>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1) }}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(col, dir) => { setSortBy(col); setSortOrder(dir) }}
        search={search}
        onSearchChange={(s) => { setSearch(s); setPage(1) }}
        emptyMessage="No se encontraron órdenes"
      />
    </Box>
  )
}
