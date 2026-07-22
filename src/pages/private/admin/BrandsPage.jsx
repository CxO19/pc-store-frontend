import { useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box, Typography, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, IconButton, Tooltip, Avatar
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import BlockIcon from '@mui/icons-material/Block'
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark'
import toast from 'react-hot-toast'
import api from '../../../api/axios'
import DataTable from '../../../components/admin/DataTable'
import ConfirmDialog from '../../../components/admin/ConfirmDialog'
import { useThemeMode } from '../../../theme/ThemeModeContext'
import { fieldSx, primaryBtnSx } from '../../../theme/adminStyles'

const EMPTY_FORM = { name: '', country: '', logoUrl: '' }

const brandSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  country: z.string(),
  logoUrl: z.string(),
})

export default function BrandsPage() {
  const { palette } = useThemeMode()

  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [search, setSearch] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deactivating, setDeactivating] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: EMPTY_FORM,
  })

  useEffect(() => {
    const timer = setTimeout(() => setPage(1), 0)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      api.get('/brands', { params: { search: search || undefined, page, limit, sort: sortBy, order: sortOrder } })
        .then(({ data }) => {
          setRows(data.data || [])
          setTotal(data.total || 0)
        })
        .catch(() => toast.error('No se pudieron cargar las marcas'))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [search, page, limit, sortBy, sortOrder, refreshKey])

  const columns = useMemo(() => [
    {
      key: 'logoUrl',
      label: '',
      render: (row) => (
        <Avatar variant="rounded" src={row.logoUrl || ''} sx={{ width: 32, height: 32, bgcolor: palette.accentBg }}>
          <BrandingWatermarkIcon sx={{ fontSize: 18, color: palette.accent }} />
        </Avatar>
      ),
    },
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'country', label: 'País', render: (row) => row.country || '—' },
    {
      key: 'isActive',
      label: 'Estado',
      render: (row) => (
        <Chip
          size="small"
          label={row.isActive ? 'Activo' : 'Inactivo'}
          sx={{
            bgcolor: row.isActive ? palette.successBg : palette.dangerBg,
            color: row.isActive ? palette.success : palette.danger,
            border: `1px solid ${row.isActive ? palette.successBorder : palette.dangerBorder}`,
            fontWeight: 'bold',
          }}
        />
      ),
    },
  ], [palette])

  const handleSort = (key) => {
    if (sortBy === key) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
    else { setSortBy(key); setSortOrder('asc') }
  }

  const openCreate = () => {
    setEditingId(null)
    reset(EMPTY_FORM)
    setFormOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    reset({ name: row.name || '', country: row.country || '', logoUrl: row.logoUrl || '' })
    setFormOpen(true)
  }

  const onSubmit = async (data) => {
    setSaving(true)
    const payload = {
      name: data.name.trim(),
      country: data.country.trim() || undefined,
      logoUrl: data.logoUrl.trim() || undefined,
    }
    try {
      if (editingId) {
        await api.patch(`/brands/${editingId}`, payload)
        toast.success('Marca actualizada')
      } else {
        await api.post('/brands', payload)
        toast.success('Marca creada')
      }
      setFormOpen(false)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo guardar la marca'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async () => {
    if (!confirmTarget) return
    setDeactivating(true)
    try {
      await api.delete(`/brands/${confirmTarget.id}`)
      toast.success('Marca desactivada')
      setConfirmTarget(null)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo desactivar la marca'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    } finally {
      setDeactivating(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: palette.textPrimary, textShadow: palette.mode === 'dark' ? `0 0 30px ${palette.accentGlow}` : 'none' }} mb={0.5}>
            Marcas
          </Typography>
          <Typography sx={{ color: palette.textSecondary }}>
            {total} marca{total === 1 ? '' : 's'} registrada{total === 1 ? '' : 's'}
          </Typography>
        </Box>
        <Button startIcon={<AddIcon />} onClick={openCreate} variant="contained" sx={primaryBtnSx(palette)}>
          Nueva marca
        </Button>
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
        onSortChange={handleSort}
        search={search}
        onSearchChange={setSearch}
        emptyMessage="No hay marcas que coincidan con la búsqueda"
        renderActions={(row) => (
          <>
            <Tooltip title="Editar">
              <IconButton size="small" onClick={() => openEdit(row)} sx={{ color: palette.accent }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={row.isActive ? 'Desactivar' : 'Ya está inactiva'}>
              <span>
                <IconButton
                  size="small"
                  disabled={!row.isActive}
                  onClick={() => setConfirmTarget(row)}
                  sx={{ color: palette.danger }}
                >
                  <BlockIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </>
        )}
      />

      <Dialog
        open={formOpen}
        onClose={() => !saving && setFormOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { background: palette.paperBg, backdropFilter: 'blur(16px)', borderRadius: 4, border: `1px solid ${palette.paperBorder}` } } }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ color: palette.textPrimary, fontWeight: 'bold' }}>
            {editingId ? 'Editar marca' : 'Nueva marca'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth label="Nombre"
                      error={!!errors.name} helperText={errors.name?.message}
                      sx={fieldSx(palette)}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth label="País"
                      sx={fieldSx(palette)}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="logoUrl"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth label="URL del logo"
                      sx={fieldSx(palette)}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setFormOpen(false)} disabled={saving} sx={{ color: palette.textSecondary }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving} variant="contained" sx={primaryBtnSx(palette)}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={!!confirmTarget}
        title="Desactivar marca"
        message={`¿Seguro que querés desactivar "${confirmTarget?.name}"? No se podrá asignar a nuevos productos.`}
        confirmLabel="Desactivar"
        danger
        loading={deactivating}
        onConfirm={handleDeactivate}
        onClose={() => setConfirmTarget(null)}
      />
    </Box>
  )
}