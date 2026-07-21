import { useState, useEffect, useCallback } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, TableSortLabel,
  TextField, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Chip, IconButton, Tooltip, CircularProgress,
  MenuItem, InputAdornment, Avatar, Paper
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RestoreIcon from '@mui/icons-material/Restore'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../../../api/axios'
import { useThemeMode } from '../../../theme/ThemeModeContext'

const ACCENT = '#63CAAC'
const ACCENT_GLOW = 'rgba(99, 202, 172, 0.4)'

const ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'client', label: 'Cliente' },
]

const initialForm = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  role: 'client',
}

export default function UsersPage() {
  const { mode, palette } = useThemeMode()
  const isLight = mode === 'light'

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('firstName')
  const [sortOrder, setSortOrder] = useState('asc')

  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        sortBy,
        sortOrder,
      }
      if (search.trim()) params.search = search.trim()
      const res = await api.get('/usuarios', { params })
      const data = res.data
      setUsers(data.data || data.items || [])
      setTotal(data.meta?.totalItems || data.total || 0)
    } catch {
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }, [page, rowsPerPage, search, sortBy, sortOrder])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 0) setPage(0)
      else fetchUsers()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const handleChangePage = (_, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  const handleOpenCreate = () => {
    setForm(initialForm)
    setFormErrors({})
    setOpenCreate(true)
  }

  const handleOpenEdit = (user) => {
    setSelectedUser(user)
    setForm({
      email: user.email || '',
      password: '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role || 'client',
    })
    setFormErrors({})
    setOpenEdit(true)
  }

  const handleCloseModals = () => {
    setOpenCreate(false)
    setOpenEdit(false)
    setSelectedUser(null)
    setFormErrors({})
  }

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormErrors({ ...formErrors, [e.target.name]: '' })
  }

  const validateForm = (isEdit) => {
    const errors = {}
    if (!form.email.trim()) errors.email = 'El email es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email inválido'
    
    if (!isEdit && !form.password.trim()) errors.password = 'La contraseña es requerida'
    else if (form.password && form.password.length < 6) errors.password = 'Mínimo 6 caracteres'
    
    if (!form.firstName.trim()) errors.firstName = 'El nombre es requerido'
    if (!form.lastName.trim()) errors.lastName = 'El apellido es requerido'
    return errors
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const errors = validateForm(false)
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }
    setSaving(true)
    try {
      await api.post('/usuarios', {
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        role: form.role,
      })
      toast.success('Usuario creado exitosamente')
      handleCloseModals()
      fetchUsers()
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al crear usuario'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    const errors = validateForm(true)
    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }
    setSaving(true)
    try {
      const payload = {
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        role: form.role,
      }
      if (form.password.trim()) payload.password = form.password
      await api.patch(`/usuarios/${selectedUser.id}`, payload)
      toast.success('Usuario actualizado exitosamente')
      handleCloseModals()
      fetchUsers()
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar usuario'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    } finally {
      setSaving(false)
    }
  }

  const handleOpenConfirm = (user) => {
    setSelectedUser(user)
    setOpenConfirm(true)
  }

  const handleToggleStatus = async () => {
    setSaving(true)
    try {
      const isActive = selectedUser.isActive !== false
      await api.patch(`/usuarios/${selectedUser.id}`, { isActive: !isActive })
      toast.success(isActive ? 'Usuario desactivado' : 'Usuario reactivado')
      setOpenConfirm(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al cambiar estado'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?'
  }

  const roleColors = {
    admin: { bg: 'rgba(99,202,172,0.15)', color: isLight ? '#0f766e' : ACCENT, border: 'rgba(99,202,172,0.3)' },
    client: { bg: 'rgba(96,165,250,0.15)', color: isLight ? '#1d4ed8' : '#93c5fd', border: 'rgba(96,165,250,0.3)' },
  }

  const roleLabels = {
    admin: 'Administrador',
    client: 'Cliente',
  }

  const fieldStyles = {
    '& .MuiOutlinedInput-root': {
      color: palette.textPrimary,
      borderRadius: 3,
      bgcolor: palette.inputBg || (isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255, 255, 255, 0.05)'),
      '& fieldset': { borderColor: palette.inputBorder || (isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)') },
      '&:hover fieldset': { borderColor: isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)' },
      '&.Mui-focused fieldset': { borderColor: ACCENT },
      '&.Mui-error fieldset': { borderColor: '#ef4444' },
    },
    '& .MuiInputLabel-root': { color: palette.textMuted },
    '& .MuiInputLabel-root.Mui-focused': { color: ACCENT },
    '& .MuiFormHelperText-root': { color: '#ef4444' },
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', px: { xs: 2, sm: 4, md: 6 }, py: 4, boxSizing: 'border-box' }}>
      
      {/* Header section */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            gap: 3, 
            mb: 4,
            width: '100%' 
          }}
        >
          <Box>
            <Typography 
              variant="h4" 
              fontWeight="800" 
              sx={{ color: palette.textPrimary, mb: 0.5, letterSpacing: '-0.5px' }}
            >
              Usuarios
            </Typography>
            <Typography variant="body2" sx={{ color: palette.textMuted }}>
              {total} usuarios registrados en el sistema
            </Typography>
          </Box>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{
                bgcolor: ACCENT,
                color: '#20232a',
                fontWeight: 'bold',
                borderRadius: 3,
                px: 3.5,
                py: 1.4,
                boxShadow: `0 4px 14px ${ACCENT_GLOW}`,
                '&:hover': {
                  bgcolor: ACCENT,
                  boxShadow: `0 6px 20px ${ACCENT_GLOW}`,
                },
              }}
            >
              Nuevo Usuario
            </Button>
          </motion.div>
        </Box>
      </motion.div>

      {/* Search bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nombre, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          size="medium"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: palette.textMuted, ml: 1 }} />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearch('')} sx={{ color: palette.textMuted, mr: 1 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 4,
            '& .MuiOutlinedInput-root': {
              color: palette.textPrimary,
              borderRadius: 3.5,
              bgcolor: palette.inputBg,
              '& fieldset': { borderColor: palette.inputBorder },
              '&:hover fieldset': { borderColor: isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)' },
              '&.Mui-focused fieldset': { borderColor: ACCENT },
            },
            '& input::placeholder': { color: palette.textMuted, opacity: 1 },
          }}
        />
      </motion.div>

      {/* Table container */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            bgcolor: palette.paperBg,
            border: `1px solid ${palette.paperBorder}`,
            backdropFilter: 'blur(16px)',
            mb: 3,
            boxShadow: isLight ? '0 10px 30px rgba(0, 0, 0, 0.08)' : '0 30px 80px -12px rgba(0, 0, 0, 0.7)',
            overflowX: 'auto',
            width: '100%',
            backgroundImage: 'none',
          }}
        >
          <Table sx={{ minWidth: 900, width: '100%' }}>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: `2px solid ${palette.paperBorder}`, py: 2.5 } }}>
                <TableCell align="left" sx={{ color: palette.textPrimary, fontWeight: '800', fontSize: '0.9rem', pl: 4 }}>
                  Usuario
                </TableCell>
                <TableCell align="left" sx={{ color: palette.textPrimary, fontWeight: '800', fontSize: '0.9rem', px: 3 }}>
                  <TableSortLabel
                    active={sortBy === 'email'}
                    direction={sortBy === 'email' ? sortOrder : 'asc'}
                    onClick={() => handleSort('email')}
                    sx={{
                      color: `${palette.textPrimary} !important`,
                      fontWeight: '800 !important',
                      '&:hover': { color: `${ACCENT} !important` },
                      '&.Mui-active': { color: `${ACCENT} !important` },
                      '& .MuiTableSortLabel-icon': { color: `${ACCENT} !important` },
                    }}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell align="left" sx={{ color: palette.textPrimary, fontWeight: '800', fontSize: '0.9rem', px: 3 }}>
                  <TableSortLabel
                    active={sortBy === 'role'}
                    direction={sortBy === 'role' ? sortOrder : 'asc'}
                    onClick={() => handleSort('role')}
                    sx={{
                      color: `${palette.textPrimary} !important`,
                      fontWeight: '800 !important',
                      '&:hover': { color: `${ACCENT} !important` },
                      '&.Mui-active': { color: `${ACCENT} !important` },
                      '& .MuiTableSortLabel-icon': { color: `${ACCENT} !important` },
                    }}
                  >
                    Rol
                  </TableSortLabel>
                </TableCell>
                <TableCell align="left" sx={{ color: palette.textPrimary, fontWeight: '800', fontSize: '0.9rem', px: 3 }}>
                  Estado
                </TableCell>
                <TableCell align="center" sx={{ color: palette.textPrimary, fontWeight: '800', fontSize: '0.9rem', pr: 4 }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10, borderBottom: 'none' }}>
                    <CircularProgress size={45} sx={{ color: ACCENT }} />
                    <Typography color={palette.textMuted} mt={2} fontSize={15}>Cargando usuarios...</Typography>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10, borderBottom: 'none' }}>
                    <Typography color={palette.textMuted} fontSize={16}>No se encontraron usuarios registrados</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                    style={{ display: 'table-row' }}
                  >
                    <TableCell align="left" sx={{ borderBottom: `1px solid ${palette.paperBorder}`, py: 3, pl: 4 }}>
                      <Box display="flex" alignItems="center" gap={2.5}>
                        <Avatar sx={{
                          width: 42, height: 42, fontSize: 15, fontWeight: 'bold',
                          bgcolor: user.isActive === false ? 'rgba(239,68,68,0.15)' : `${ACCENT}20`,
                          color: user.isActive === false ? '#f87171' : (isLight ? '#0f766e' : ACCENT),
                        }}>
                          {getInitials(user.firstName, user.lastName)}
                        </Avatar>
                        <Typography color={palette.textPrimary} fontWeight="600" fontSize={15}>
                          {user.firstName} {user.lastName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left" sx={{ borderBottom: `1px solid ${palette.paperBorder}`, py: 3, px: 3 }}>
                      <Typography color={palette.textMuted} fontSize={14.5}>{user.email}</Typography>
                    </TableCell>
                    <TableCell align="left" sx={{ borderBottom: `1px solid ${palette.paperBorder}`, py: 3, px: 3 }}>
                      <Chip
                        label={roleLabels[user.role] || user.role}
                        size="small"
                        sx={{
                          bgcolor: roleColors[user.role]?.bg,
                          color: roleColors[user.role]?.color,
                          border: `1px solid ${roleColors[user.role]?.border}`,
                          fontWeight: 'bold',
                          fontSize: 12.5,
                          px: 1.5,
                          py: 0.5,
                        }}
                      />
                    </TableCell>
                    <TableCell align="left" sx={{ borderBottom: `1px solid ${palette.paperBorder}`, py: 3, px: 3 }}>
                      <Chip
                        label={user.isActive === false ? 'Inactivo' : 'Activo'}
                        size="small"
                        sx={{
                          bgcolor: user.isActive === false ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
                          color: user.isActive === false ? '#f87171' : '#16a34a',
                          border: `1px solid ${user.isActive === false ? '#f87171' : '#16a34a'}`,
                          fontWeight: 'bold',
                          fontSize: 12.5,
                          px: 1.5,
                          py: 0.5,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: `1px solid ${palette.paperBorder}`, py: 3, pr: 4 }}>
                      <Box display="flex" justifyContent="center" gap={1.5}>
                        <Tooltip title="Editar" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(user)}
                            sx={{
                              color: palette.textMuted,
                              p: 1,
                              '&:hover': { color: ACCENT, bgcolor: `${ACCENT}15` },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={user.isActive === false ? 'Reactivar' : 'Desactivar'} arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenConfirm(user)}
                            sx={{
                              color: user.isActive === false ? '#16a34a' : 'rgba(239,68,68,0.7)',
                              p: 1,
                              '&:hover': {
                                color: user.isActive === false ? '#16a34a' : '#ef4444',
                                bgcolor: user.isActive === false ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                              },
                            }}
                          >
                            {user.isActive === false ? <RestoreIcon fontSize="small" /> : <DeleteIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            sx={{
              color: palette.textMuted,
              borderTop: `1px solid ${palette.paperBorder}`,
              py: 1.5,
              px: 2,
              '& .MuiTablePagination-select': { color: palette.textPrimary },
              '& .MuiTablePagination-selectIcon': { color: palette.textMuted },
              '& .MuiIconButton-root': {
                color: palette.textMuted,
                '&:hover': { color: ACCENT, bgcolor: `${ACCENT}15` },
                '&.Mui-disabled': { color: isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.15)' },
              },
            }}
          />
        </TableContainer>
      </motion.div>

      {/* Dialogo Crear / Editar */}
      <Dialog
        open={openCreate || openEdit}
        onClose={handleCloseModals}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              background: palette.paperBg,
              backdropFilter: 'blur(16px)',
              border: `1px solid ${palette.paperBorder}`,
              borderRadius: 4,
              boxShadow: isLight ? '0 10px 30px rgba(0, 0, 0, 0.08)' : '0 30px 80px -12px rgba(0, 0, 0, 0.7)',
              p: 1,
            },
          },
        }}
      >
        <form onSubmit={openCreate ? handleCreate : handleEdit}>
          <DialogTitle sx={{ color: palette.textPrimary, fontWeight: 'bold', pb: 0, pt: 2, px: 3 }}>
            {openCreate ? 'Nuevo Usuario' : 'Editar Usuario'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3, px: 3 }}>
            <Box display="flex" flexDirection="column" gap={3}>
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleFormChange}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                  size="medium"
                  sx={fieldStyles}
                />
                <TextField
                  fullWidth
                  label="Apellido"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleFormChange}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                  size="medium"
                  sx={fieldStyles}
                />
              </Box>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleFormChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                size="medium"
                sx={fieldStyles}
              />
              <TextField
                fullWidth
                label={openCreate ? 'Contraseña' : 'Contraseña (dejar vacío para mantener)'}
                name="password"
                type="password"
                value={form.password}
                onChange={handleFormChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                size="medium"
                autoComplete="new-password"
                sx={fieldStyles}
              />
              <TextField
                select
                fullWidth
                label="Rol"
                name="role"
                value={form.role}
                onChange={handleFormChange}
                size="medium"
                sx={{
                  ...fieldStyles,
                  '& .MuiSelect-select': { color: palette.textPrimary },
                  '& .MuiSvgIcon-root': { color: palette.textMuted },
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        background: palette.paperBg,
                        backdropFilter: 'blur(16px)',
                        border: `1px solid ${palette.paperBorder}`,
                        '& .MuiMenuItem-root': {
                          color: palette.textPrimary,
                          '&:hover': { bgcolor: `${ACCENT}20` },
                          '&.Mui-selected': { bgcolor: `${ACCENT}30`, color: ACCENT },
                        },
                      },
                    },
                  },
                }}
              >
                {ROLES.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
            <Button
              onClick={handleCloseModals}
              sx={{
                color: palette.textMuted,
                borderRadius: 3,
                px: 2.5,
                '&:hover': { bgcolor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', color: palette.textPrimary },
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} sx={{ color: '#20232a' }} /> : null}
              sx={{
                bgcolor: ACCENT,
                color: '#20232a',
                fontWeight: 'bold',
                borderRadius: 3,
                px: 3,
                '&:hover': {
                  bgcolor: ACCENT,
                  boxShadow: `0 0 15px ${ACCENT_GLOW}`,
                },
              }}
            >
              {saving ? 'Guardando...' : openCreate ? 'Crear' : 'Guardar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialogo Confirmación */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              background: palette.paperBg,
              backdropFilter: 'blur(16px)',
              border: `1px solid ${palette.paperBorder}`,
              borderRadius: 4,
              boxShadow: isLight ? '0 10px 30px rgba(0, 0, 0, 0.08)' : '0 30px 80px -12px rgba(0, 0, 0, 0.7)',
              p: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ color: palette.textPrimary, fontWeight: 'bold', pb: 0, pt: 2, px: 3 }}>
          {selectedUser?.isActive === false ? 'Reactivar Usuario' : 'Desactivar Usuario'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3 }}>
          <Typography color={palette.textMuted} fontSize={14}>
            {selectedUser?.isActive === false
              ? `¿Estás seguro de reactivar a ${selectedUser?.firstName} ${selectedUser?.lastName}?`
              : `¿Estás seguro de desactivar a ${selectedUser?.firstName} ${selectedUser?.lastName}? Esta acción no eliminará al usuario permanentemente.`
            }
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button
            onClick={() => setOpenConfirm(false)}
            sx={{
              color: palette.textMuted,
              borderRadius: 3,
              px: 2.5,
              '&:hover': { bgcolor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', color: palette.textPrimary },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleToggleStatus}
            disabled={saving}
            sx={{
              bgcolor: selectedUser?.isActive === false ? '#16a34a' : '#ef4444',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: 3,
              px: 3,
              '&:hover': {
                bgcolor: selectedUser?.isActive === false ? '#16a34a' : '#ef4444',
                opacity: 0.9,
              },
            }}
          >
            {saving ? 'Procesando...' : selectedUser?.isActive === false ? 'Reactivar' : 'Desactivar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}