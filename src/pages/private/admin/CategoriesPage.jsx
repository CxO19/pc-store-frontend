import { useEffect, useMemo, useState } from 'react'
import {
  Box, Typography, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Tooltip
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import BlockIcon from '@mui/icons-material/Block'
import toast from 'react-hot-toast'
import api from '../../../api/axios'
import DataTable from '../../../components/admin/DataTable'
import ConfirmDialog from '../../../components/admin/ConfirmDialog'
import { useThemeMode } from '../../../theme/ThemeModeContext'
import { fieldSx, primaryBtnSx } from '../../../theme/adminStyles'

const EMPTY_FORM = { name: '', description: '' }

export default function CategoriesPage() {
  const { palette } = useThemeMode()
  const isLight = palette.mode === 'light'

  const textColor = isLight ? '#1a1a1a' : '#ffffff'
  const textMuted = isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'

  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [search, setSearch] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deactivating, setDeactivating] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setPage(1), 0)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      api.get('/categories', {
        params: {
          search: search || undefined,
          page, limit, sort: sortBy, order: sortOrder,
        },
      })
        .then(({ data }) => {
          setRows(data.data || [])
          setTotal(data.total || 0)
        })
        .catch(() => toast.error('No se pudieron cargar las categorías'))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [search, page, limit, sortBy, sortOrder, refreshKey])

  const columns = useMemo(() => [
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'description', label: 'Descripción', render: (row) => row.description || '—' },
    {
      key: 'isActive',
      label: 'Estado',
      render: (row) => (
        <Chip
          size="small"
          label={row.isActive !== false ? 'Activo' : 'Inactivo'}
          sx={{
            bgcolor: row.isActive !== false ? palette.successBg : palette.dangerBg,
            color: row.isActive !== false ? palette.success : palette.danger,
            border: `1px solid ${row.isActive !== false ? palette.successBorder : palette.dangerBorder}`,
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
    setForm(EMPTY_FORM)
    setFormErrors({})
    setFormOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm({
      name: row.name || '',
      description: row.description || '',
    })
    setFormErrors({})
    setFormOpen(true)
  }

  const validate = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'El nombre es obligatorio'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
    }
    try {
      if (editingId) {
        await api.patch(`/categories/${editingId}`, payload)
        toast.success('Categoría actualizada')
      } else {
        await api.post('/categories', payload)
        toast.success('Categoría creada')
      }
      setFormOpen(false)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo guardar la categoría'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async () => {
    if (!confirmTarget) return
    setDeactivating(true)
    try {
      await api.delete(`/categories/${confirmTarget.id}`)
      toast.success('Categoría desactivada')
      setConfirmTarget(null)
      setRows((prev) => prev.filter((r) => r.id !== confirmTarget.id))
      setTotal((t) => Math.max(0, t - 1))
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo desactivar la categoría'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    } finally {
      setDeactivating(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: textColor, textShadow: palette.mode === 'dark' ? `0 0 30px ${palette.accentGlow}` : 'none' }} mb={0.5}>
            Gestión de Categorías
          </Typography>
          <Typography sx={{ color: textMuted }}>
            {total} categoría{total === 1 ? '' : 's'} registrada{total === 1 ? '' : 's'}
          </Typography>
        </Box>
        <Button startIcon={<AddIcon />} onClick={openCreate} variant="contained" sx={primaryBtnSx(palette)}>
          Nueva categoría
        </Button>
      </Box>

      {/* Si tu DataTable acepta propiedades de estilo en el contenedor o papel, pásalas aquí: */}
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
        emptyMessage="No hay categorías que coincidan con la búsqueda"
        // Propiedad para alinear el fondo del contenedor de la tabla con el paperBg de tu tema
        sx={{
          backgroundColor: palette.paperBg,
          backgroundImage: 'none',
          border: `1px solid ${palette.paperBorder}`,
          borderRadius: 4,
          '& .MuiToolbar-root, & thead': {
            backgroundColor: 'transparent',
          },
        }}
        renderActions={(row) => (
          <>
            <Tooltip title="Editar">
              <IconButton size="small" onClick={() => openEdit(row)} sx={{ color: palette.accent }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={row.isActive !== false ? 'Desactivar' : 'Ya está inactiva'}>
              <span>
                <IconButton
                  size="small"
                  disabled={row.isActive === false}
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
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { background: palette.paperBg, backdropFilter: 'blur(16px)', borderRadius: 4, border: `1px solid ${palette.paperBorder}` } } }}
      >
        <DialogTitle sx={{ color: textColor, fontWeight: 'bold' }}>
          {editingId ? 'Editar categoría' : 'Nueva categoría'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth label="Nombre" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={!!formErrors.name} helperText={formErrors.name}
              sx={fieldSx(palette)}
            />
            <TextField
              fullWidth multiline minRows={2} label="Descripción" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              sx={fieldSx(palette)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFormOpen(false)} disabled={saving} sx={{ color: textMuted }}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving} variant="contained" sx={primaryBtnSx(palette)}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!confirmTarget}
        title="Desactivar categoría"
        message={`¿Seguro que querés desactivar "${confirmTarget?.name}"?`}
        confirmLabel="Desactivar"
        danger
        loading={deactivating}
        onConfirm={handleDeactivate}
        onClose={() => setConfirmTarget(null)}
      />
    </Box>
  )
}