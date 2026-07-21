import { useEffect, useMemo, useState } from 'react'
import {
  Box, Typography, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid, IconButton, Tooltip
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

const EMPTY_FORM = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '', brandId: '' }

export default function ProductsPage() {
  const { palette } = useThemeMode()
  const isLight = palette.mode === 'light'

  const textColor = isLight ? '#1a1a1a' : '#ffffff'
  const textMuted = isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'

  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [brandFilter, setBrandFilter] = useState('')

  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deactivating, setDeactivating] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Configuración unificada para los menús desplegables (Selects) para que combinen con la temática
  const menuPropsConfig = {
    PaperProps: {
      sx: {
        bgcolor: palette.paperBg || (isLight ? '#ffffff' : '#1e2130'),
        border: `1px solid ${palette.paperBorder || (isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)')}`,
        backgroundImage: 'none',
        '& .MuiMenuItem-root': {
          color: textColor,
          fontSize: '0.9rem',
          '&:hover': { bgcolor: `${palette.accent || '#63CAAC'}20` },
          '&.Mui-selected': { bgcolor: `${palette.accent || '#63CAAC'}30`, color: palette.accent || '#63CAAC' },
        },
      },
    },
  }

  useEffect(() => {
    api.get('/categories', { params: { limit: 100 } }).then(({ data }) => setCategories(data.data || [])).catch(() => {})
    api.get('/brands', { params: { limit: 100 } }).then(({ data }) => setBrands(data.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setPage(1), 0)
    return () => clearTimeout(timer)
  }, [search, categoryFilter, brandFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      api.get('/products', {
        params: {
          search: search || undefined,
          categoryId: categoryFilter || undefined,
          brandId: brandFilter || undefined,
          page, limit, sort: sortBy, order: sortOrder,
        },
      })
        .then(({ data }) => {
          setRows(data.data || [])
          setTotal(data.total || 0)
        })
        .catch(() => toast.error('No se pudieron cargar los productos'))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [search, categoryFilter, brandFilter, page, limit, sortBy, sortOrder, refreshKey])

  const activeCategories = useMemo(() => categories.filter((c) => c.isActive !== false), [categories])
  const activeBrands = useMemo(() => brands.filter((b) => b.isActive !== false), [brands])

  const columns = useMemo(() => [
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'category', label: 'Categoría', render: (row) => row.category?.name || '—' },
    { key: 'brand', label: 'Marca', render: (row) => row.brand?.name || '—' },
    { key: 'price', label: 'Precio', sortable: true, render: (row) => `$${Number(row.price).toFixed(2)}` },
    { key: 'stock', label: 'Stock', sortable: true },
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
    setForm(EMPTY_FORM)
    setFormErrors({})
    setFormOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm({
      name: row.name || '',
      description: row.description || '',
      price: row.price ?? '',
      stock: row.stock ?? '',
      imageUrl: row.imageUrl || '',
      categoryId: row.categoryId || '',
      brandId: row.brandId || '',
    })
    setFormErrors({})
    setFormOpen(true)
  }

  const validate = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'El nombre es obligatorio'
    if (form.price === '' || Number(form.price) <= 0) errors.price = 'El precio debe ser mayor a 0'
    if (form.stock !== '' && Number(form.stock) < 0) errors.stock = 'El stock no puede ser negativo'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      price: Number(form.price),
      stock: form.stock === '' ? undefined : Number(form.stock),
      imageUrl: form.imageUrl.trim() || undefined,
      categoryId: form.categoryId || undefined,
      brandId: form.brandId || undefined,
    }
    try {
      if (editingId) {
        await api.patch(`/products/${editingId}`, payload)
        toast.success('Producto actualizado')
      } else {
        await api.post('/products', payload)
        toast.success('Producto creado')
      }
      setFormOpen(false)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo guardar el producto'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async () => {
    if (!confirmTarget) return
    setDeactivating(true)
    try {
      await api.delete(`/products/${confirmTarget.id}`)
      toast.success('Producto desactivado')
      setConfirmTarget(null)
      setRows((prev) => prev.filter((r) => r.id !== confirmTarget.id))
      setTotal((t) => Math.max(0, t - 1))
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo desactivar el producto'
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
            Productos
          </Typography>
          <Typography sx={{ color: textMuted }}>
            {total} producto{total === 1 ? '' : 's'} en el catálogo
          </Typography>
        </Box>
        <Button startIcon={<AddIcon />} onClick={openCreate} variant="contained" sx={primaryBtnSx(palette)}>
          Nuevo producto
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
        emptyMessage="No hay productos que coincidan con la búsqueda"
        toolbarExtra={
          <>
            <TextField
              select size="small" label="Categoría" value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{ minWidth: 180, ...fieldSx(palette) }}
              SelectProps={{ MenuProps: menuPropsConfig }}
            >
              <MenuItem value="">Todas</MenuItem>
              {activeCategories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </TextField>
            <TextField
              select size="small" label="Marca" value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              sx={{ minWidth: 180, ...fieldSx(palette) }}
              SelectProps={{ MenuProps: menuPropsConfig }}
            >
              <MenuItem value="">Todas</MenuItem>
              {activeBrands.map((b) => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
            </TextField>
          </>
        }
        renderActions={(row) => (
          <>
            <Tooltip title="Editar">
              <IconButton size="small" onClick={() => openEdit(row)} sx={{ color: palette.accent }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={row.isActive ? 'Desactivar' : 'Ya está inactivo'}>
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
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { background: palette.paperBg, backdropFilter: 'blur(16px)', borderRadius: 4, border: `1px solid ${palette.paperBorder}` } } }}
      >
        <DialogTitle sx={{ color: textColor, fontWeight: 'bold' }}>
          {editingId ? 'Editar producto' : 'Nuevo producto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth label="Nombre" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={!!formErrors.name} helperText={formErrors.name}
                sx={fieldSx(palette)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth multiline minRows={2} label="Descripción" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                sx={fieldSx(palette)}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth type="number" label="Precio" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                error={!!formErrors.price} helperText={formErrors.price}
                sx={fieldSx(palette)}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth type="number" label="Stock" value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                error={!!formErrors.stock} helperText={formErrors.stock}
                sx={fieldSx(palette)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth label="URL de imagen" value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                sx={fieldSx(palette)}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                select fullWidth label="Categoría" value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                sx={fieldSx(palette)}
                SelectProps={{ MenuProps: menuPropsConfig }}
              >
                <MenuItem value="">Sin categoría</MenuItem>
                {activeCategories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                select fullWidth label="Marca" value={form.brandId}
                onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                sx={fieldSx(palette)}
                SelectProps={{ MenuProps: menuPropsConfig }}
              >
                <MenuItem value="">Sin marca</MenuItem>
                {activeBrands.map((b) => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
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
        title="Desactivar producto"
        message={`¿Seguro que querés desactivar "${confirmTarget?.name}"? Dejará de mostrarse en el catálogo.`}
        confirmLabel="Desactivar"
        danger
        loading={deactivating}
        onConfirm={handleDeactivate}
        onClose={() => setConfirmTarget(null)}
      />
    </Box>
  )
}