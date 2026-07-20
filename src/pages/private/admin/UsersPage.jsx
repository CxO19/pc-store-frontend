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
    admin: { bg: 'rgba(99,202,172,0.12)', color: ACCENT, border: 'rgba(99,202,172,0.3)' },
    client: { bg: 'rgba(96,165,250,0.12)', color: '#93c5fd', border: 'rgba(96,165,250,0.3)' },
  }

  const roleLabels = {
    admin: 'Administrador',
    client: 'Cliente',
  }

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="white" mb={0.5}>
              Usuarios
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.4)">
              {total} usuarios registrados
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
                px: 3,
                '&:hover': {
                  bgcolor: ACCENT,
                  boxShadow: `0 0 20px ${ACCENT_GLOW}`,
                },
              }}
            >
              Nuevo Usuario
            </Button>
          </motion.div>
        </Box>
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <TextField
          fullWidth
          placeholder="Buscar por nombre, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearch('')} sx={{ color: 'rgba(255,255,255,0.4)' }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.04)',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
              '&.Mui-focused fieldset': { borderColor: ACCENT },
            },
            '& input::placeholder': { color: 'rgba(255,255,255,0.3)', opacity: 1 },
          }}
        />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            bgcolor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(10px)',
            mb: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: '1px solid rgba(255,255,255,0.07)' } }}>
                <TableCell sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', fontSize: 13 }}>
                  Usuario
                </TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', fontSize: 13 }}>
                  <TableSortLabel
                    active={sortBy === 'email'}
                    direction={sortBy === 'email' ? sortOrder : 'asc'}
                    onClick={() => handleSort('email')}
                    sx={{
                      color: 'rgba(255,255,255,0.5) !important',
                      '&:hover': { color: `${ACCENT} !important` },
                      '&.Mui-active': { color: `${ACCENT} !important` },
                      '& .MuiTableSortLabel-icon': { color: `${ACCENT} !important` },
                    }}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', fontSize: 13 }}>
                  <TableSortLabel
                    active={sortBy === 'role'}
                    direction={sortBy === 'role' ? sortOrder : 'asc'}
                    onClick={() => handleSort('role')}
                    sx={{
                      color: 'rgba(255,255,255,0.5) !important',
                      '&:hover': { color: `${ACCENT} !important` },
                      '&.Mui-active': { color: `${ACCENT} !important` },
                      '& .MuiTableSortLabel-icon': { color: `${ACCENT} !important` },
                    }}
                  >
                    Rol
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', fontSize: 13 }}>
                  Estado
                </TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', fontSize: 13 }} align="center">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8, borderBottom: 'none' }}>
                    <CircularProgress size={40} sx={{ color: ACCENT }} />
                    <Typography color="rgba(255,255,255,0.4)" mt={2}>Cargando usuarios...</Typography>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8, borderBottom: 'none' }}>
                    <Typography color="rgba(255,255,255,0.3)" fontSize={15}>
                      No se encontraron usuarios
                    </Typography>
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
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{
                          width: 36, height: 36, fontSize: 14, fontWeight: 'bold',
                          bgcolor: user.isActive === false ? 'rgba(239,68,68,0.15)' : `${ACCENT}20`,
                          color: user.isActive === false ? '#f87171' : ACCENT,
                        }}>
                          {getInitials(user.firstName, user.lastName)}
                        </Avatar>
                        <Box>
                          <Typography color="white" fontWeight="medium" fontSize={14}>
                            {user.firstName} {user.lastName}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <Typography color="rgba(255,255,255,0.6)" fontSize={14}>
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <Chip
                        label={roleLabels[user.role] || user.role}
                        size="small"
                        sx={{
                          bgcolor: roleColors[user.role]?.bg || 'rgba(255,255,255,0.06)',
                          color: roleColors[user.role]?.color || 'rgba(255,255,255,0.6)',
                          border: `1px solid ${roleColors[user.role]?.border || 'rgba(255,255,255,0.1)'}`,
                          fontWeight: 'bold',
                          fontSize: 12,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <Chip
                        label={user.isActive === false ? 'Inactivo' : 'Activo'}
                        size="small"
                        sx={{
                          bgcolor: user.isActive === false
                            ? 'rgba(239,68,68,0.12)'
                            : 'rgba(34,197,94,0.12)',
                          color: user.isActive === false ? '#f87171' : '#4ade80',
                          border: `1px solid ${user.isActive === false ? '#f87171' : '#4ade80'}`,
                          fontWeight: 'bold',
                          fontSize: 12,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} align="center">
                      <Box display="flex" justifyContent="center" gap={0.5}>
                        <Tooltip title="Editar" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(user)}
                            sx={{
                              color: 'rgba(255,255,255,0.4)',
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
                              color: user.isActive === false ? '#4ade80' : 'rgba(239,68,68,0.5)',
                              '&:hover': {
                                color: user.isActive === false ? '#4ade80' : '#f87171',
                                bgcolor: user.isActive === false
                                  ? 'rgba(34,197,94,0.1)'
                                  : 'rgba(239,68,68,0.1)',
                              },
                            }}
                          >
                            {user.isActive === false
                              ? <RestoreIcon fontSize="small" />
                              : <DeleteIcon fontSize="small" />
                            }
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
              color: 'rgba(255,255,255,0.5)',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              '& .MuiTablePagination-select': { color: 'white' },
              '& .MuiTablePagination-selectIcon': { color: 'rgba(255,255,255,0.5)' },
              '& .MuiIconButton-root': {
                color: 'rgba(255,255,255,0.5)',
                '&:hover': { color: ACCENT, bgcolor: `${ACCENT}15` },
                '&.Mui-disabled': { color: 'rgba(255,255,255,0.15)' },
              },
            }}
          />
        </TableContainer>
      </motion.div>

      {/* Create/Edit Modal */}
      <Dialog
        open={openCreate || openEdit}
        onClose={handleCloseModals}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            bgcolor: '#1e2130',
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundImage: 'none',
          },
        }}
      >
        <form onSubmit={openCreate ? handleCreate : handleEdit}>
          <DialogTitle sx={{ color: 'white', fontWeight: 'bold', pb: 0 }}>
            {openCreate ? 'Nuevo Usuario' : 'Editar Usuario'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box display="flex" flexDirection="column" gap={2.5}>
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleFormChange}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                  size="small"
                  variant="outlined"
                  InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.4)' } }}
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
                  size="small"
                  variant="outlined"
                  InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.4)' } }}
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
                size="small"
                variant="outlined"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.4)' } }}
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
                size="small"
                variant="outlined"
                autoComplete="new-password"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.4)' } }}
                sx={fieldStyles}
              />
              <TextField
                select
                fullWidth
                label="Rol"
                name="role"
                value={form.role}
                onChange={handleFormChange}
                size="small"
                variant="outlined"
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.4)' } }}
                sx={{
                  ...fieldStyles,
                  '& .MuiSelect-select': { color: 'white' },
                  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.4)' },
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        bgcolor: '#1e2130',
                        border: '1px solid rgba(255,255,255,0.08)',
                        '& .MuiMenuItem-root': {
                          color: 'white',
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
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleCloseModals}
              sx={{
                color: 'rgba(255,255,255,0.5)',
                borderRadius: 3,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'white' },
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

      {/* Confirm Dialog */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            bgcolor: '#1e2130',
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 'bold', pb: 0 }}>
          {selectedUser?.isActive === false ? 'Reactivar Usuario' : 'Desactivar Usuario'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography color="rgba(255,255,255,0.6)" fontSize={14}>
            {selectedUser?.isActive === false
              ? `¿Estás seguro de reactivar a ${selectedUser?.firstName} ${selectedUser?.lastName}?`
              : `¿Estás seguro de desactivar a ${selectedUser?.firstName} ${selectedUser?.lastName}? Esta acción no eliminará al usuario permanentemente.`
            }
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenConfirm(false)}
            sx={{
              color: 'rgba(255,255,255,0.5)',
              borderRadius: 3,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'white' },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleToggleStatus}
            disabled={saving}
            sx={{
              bgcolor: selectedUser?.isActive === false ? '#4ade80' : '#ef4444',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: 3,
              '&:hover': {
                bgcolor: selectedUser?.isActive === false ? '#4ade80' : '#ef4444',
                opacity: 0.9,
              },
            }}
          >
            {saving
              ? 'Procesando...'
              : selectedUser?.isActive === false
                ? 'Reactivar'
                : 'Desactivar'
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    borderRadius: 3,
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
    '&.Mui-focused fieldset': { borderColor: '#63CAAC' },
    '&.Mui-error fieldset': { borderColor: '#ef4444' },
  },
  '& .MuiFormHelperText-root': {
    color: '#ef4444',
    '&.Mui-error': { color: '#ef4444' },
  },
}
