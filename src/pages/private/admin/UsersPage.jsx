import { useState, useEffect, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
  { value: 'user', label: 'Cliente' },
  { value: 'moderator', label: 'Moderador' },
]

const userSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
  password: z.string().refine((v) => v === '' || v.length >= 6, 'Mínimo 6 caracteres'),
  role: z.string(),
})

const initialForm = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  role: 'user',
}

export default function UsersPage() {
  const { mode, palette } = useThemeMode()
  const isLight = mode === 'light'

  // Textos más claros y legibles para el modo oscuro
  const brightTextMuted = isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.85)'

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
  const [saving, setSaving] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: initialForm,
  })

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page: page + 1, limit: rowsPerPage, sortBy, sortOrder }
      if (search.trim()) params.search = search.trim()
      const res = await api.get('/users', { params })
      const data = res.data
      setUsers(data.data || data.items || [])
      setTotal(data.meta?.totalItems || data.total || 0)
    } catch {
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }, [page, rowsPerPage, search, sortBy, sortOrder])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 0) setPage(0)
      else fetchUsers()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleSort = (column) => {
    if (sortBy === column) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    else { setSortBy(column); setSortOrder('asc') }
  }

  const handleChangePage = (_, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  const handleOpenCreate = () => {
    reset(initialForm)
    setOpenCreate(true)
  }

  const handleOpenEdit = (user) => {
    setSelectedUser(user)
    reset({
      email: user.email || '',
      password: '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role || 'user',
    })
    setOpenEdit(true)
  }

  const handleCloseModals = () => {
    setOpenCreate(false)
    setOpenEdit(false)
    setSelectedUser(null)
  }

  const onSubmit = async (data) => {
    if (openCreate && !data.password.trim()) {
      setError('password', { message: 'La contraseña es requerida' })
      return
    }

    setSaving(true)
    try {
      if (openCreate) {
        await api.post('/users', {
          email: data.email.trim(),
          password: data.password,
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          role: data.role,
        })
        toast.success('Usuario creado exitosamente')
      } else {
        const payload = {
          email: data.email.trim(),
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          role: data.role,
        }
        if (data.password.trim()) payload.password = data.password
        await api.patch(`/users/${selectedUser.id}`, payload)
        toast.success('Usuario actualizado exitosamente')
      }
      handleCloseModals()
      fetchUsers()
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar usuario'
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
      const currentActive = selectedUser.isActive ?? selectedUser.status ?? true
      const newStatus = typeof currentActive === 'boolean' ? !currentActive : (currentActive === 'active' ? 'inactive' : 'active')
      
      await api.patch(`/users/${selectedUser.id}`, { isActive: newStatus })
      toast.success(currentActive ? 'Usuario desactivado' : 'Usuario reactivado')
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

  const getInitials = (firstName, lastName) =>
    `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?'

  const roleColors = {
    admin: { bg: 'rgba(99,202,172,0.2)', color: ACCENT, border: 'rgba(99,202,172,0.4)' },
    moderator: { bg: 'rgba(234,179,8,0.2)', color: '#facc15', border: 'rgba(234,179,8,0.4)' },
    user: { bg: 'rgba(96,165,250,0.2)', color: '#93c5fd', border: 'rgba(96,165,250,0.4)' },
  }
  const roleLabels = { admin: 'Administrador', user: 'Cliente', moderator: 'Moderador' }

  const fieldStyles = {
    '& .MuiOutlinedInput-root': {
      color: palette.textPrimary,
      borderRadius: 3,
      bgcolor: palette.inputBg || (isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255, 255, 255, 0.05)'),
      '& fieldset': { borderColor: palette.inputBorder || (isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)') },
      '&:hover fieldset': { borderColor: isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)' },
      '&.Mui-focused fieldset': { borderColor: ACCENT },
      '&.Mui-error fieldset': { borderColor: '#ef4444' },
    },
    '& .MuiInputLabel-root': { color: brightTextMuted },
    '& .MuiInputLabel-root.Mui-focused': { color: ACCENT },
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', px: { xs: 2, sm: 4, md: 6 }, py: 4, boxSizing: 'border-box' }}>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 3, mb: 4, width: '100%' }}>
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ color: palette.textPrimary, mb: 0.5, letterSpacing: '-0.5px' }}>
              Usuarios
            </Typography>
            <Typography variant="body2" sx={{ color: brightTextMuted, fontSize: '0.95rem' }}>
              {total} usuarios registrados en el sistema
            </Typography>
          </Box>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{
                bgcolor: ACCENT, color: '#20232a', fontWeight: 'bold', borderRadius: 3,
                px: 3.5, py: 1.4, boxShadow: `0 4px 14px ${ACCENT_GLOW}`,
                '&:hover': { bgcolor: ACCENT, boxShadow: `0 6px 20px ${ACCENT_GLOW}` },
              }}
            >
              Nuevo Usuario
            </Button>
          </motion.div>
        </Box>
      </motion.div>

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
                <SearchIcon sx={{ color: brightTextMuted, ml: 1 }} />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearch('')} sx={{ color: brightTextMuted, mr: 1 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 4,
            '& .MuiOutlinedInput-root': {
              color: palette.textPrimary, borderRadius: 3.5, bgcolor: palette.inputBg,
              '& fieldset': { borderColor: palette.inputBorder || 'rgba(255,255,255,0.2)' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
              '&.Mui-focused fieldset': { borderColor: ACCENT },
            },
            '& input::placeholder': { color: brightTextMuted, opacity: 0.8 },
          }}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4, bgcolor: palette.paperBg, border: `1px solid ${palette.paperBorder}`,
            backdropFilter: 'blur(16px)', mb: 3,
            boxShadow: isLight ? '0 10px 30px rgba(0, 0, 0, 0.08)' : '0 30px 80px -12px rgba(0, 0, 0, 0.7)',
            overflowX: 'auto', width: '100%', backgroundImage: 'none',
          }}
        >
          <Table sx={{ minWidth: 900, width: '100%' }}>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: `2px solid ${palette.paperBorder}`, py: 2.5 } }}>
                <TableCell align="left" sx={{ color: palette.textPrimary, fontWeight: '800', fontSize: '0.95rem', pl: 4 }}>
                  Usuario
                </TableCell>
                <TableCell align="left" sx={{ color: palette.textPrimary, fontWeight: '800', fontSize: '0.95rem', px: 3 }}>
                  <TableSortLabel
                    active={sortBy === 'email'}
                    direction={sortBy === 'email' ? sortOrder : 'asc'}
                    onClick={() => handleSort('email')}
                    sx={{
                      color: `${palette.textPrimary} !important`, fontWeight: '800 !important',
                      '&:hover': { color: `${ACCENT} !important` },
                      '&.Mui-active': { color: `${ACCENT} !important` },
                      '& .MuiTableSortLabel-icon': { color: `${ACCENT} !important` },
                    }}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell align="left" sx={{ color: palette.textPrimary, fontWeight: '800', fontSize: '0.95rem', px: 3 }}>
                  <TableSortLabel
                    active={sortBy === 'role'}
                    direction={sortBy === 'role' ? sortOrder : 'asc'}
                    onClick={() => handleSort('role')}
                    sx={{
                      color: `${palette.textPrimary} !important`, fontWeight: '800 !important',
                      '&:hover': { color: `${ACCENT} !important` },
                      '&.Mui-active': { color: `${ACCENT} !important` },
                      '& .MuiTableSortLabel-icon': { color: `${ACCENT} !important` },
                    }}
                  >
                    Rol
                  </TableSortLabel>
                </TableCell>
                <TableCell align="left" sx={{ color: palette.textPrimary, fontWeight: '800', fontSize: '0.95rem', px: 3 }}>
                  Estado
                </TableCell>
                <TableCell align="center" sx={{ color: palette.textPrimary, fontWeight: '800', fontSize: '0.95rem', pr: 4 }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10, borderBottom: 'none' }}>
                    <CircularProgress size={45} sx={{ color: ACCENT }} />
                    <Typography color={brightTextMuted} mt={2} fontSize={15}>Cargando usuarios...</Typography>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10, borderBottom: 'none' }}>
                    <Typography color={brightTextMuted} fontSize={16}>No se encontraron usuarios registrados</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => {
                  const isInactive = user.isActive === false || user.status === false || user.status === 'inactive'
                  return (
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
                            bgcolor: isInactive ? 'rgba(239,68,68,0.2)' : `${ACCENT}25`,
                            color: isInactive ? '#f87171' : ACCENT,
                          }}>
                            {getInitials(user.firstName, user.lastName)}
                          </Avatar>
                          <Typography color={palette.textPrimary} fontWeight="600" fontSize={15}>
                            {user.firstName} {user.lastName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="left" sx={{ borderBottom: `1px solid ${palette.paperBorder}`, py: 3, px: 3 }}>
                        <Typography color={brightTextMuted} fontSize={14.5}>{user.email}</Typography>
                      </TableCell>
                      <TableCell align="left" sx={{ borderBottom: `1px solid ${palette.paperBorder}`, py: 3, px: 3 }}>
                        <Chip
                          label={roleLabels[user.role] || user.role}
                          size="small"
                          sx={{
                            bgcolor: roleColors[user.role]?.bg || 'rgba(255,255,255,0.1)',
                            color: roleColors[user.role]?.color || '#ffffff',
                            border: `1px solid ${roleColors[user.role]?.border || 'rgba(255,255,255,0.2)'}`,
                            fontWeight: 'bold', fontSize: 13, px: 1.5, py: 0.5,
                          }}
                        />
                      </TableCell>
                      <TableCell align="left" sx={{ borderBottom: `1px solid ${palette.paperBorder}`, py: 3, px: 3 }}>
                        <Chip
                          label={isInactive ? 'Inactivo' : 'Activo'}
                          size="small"
                          sx={{
                            bgcolor: isInactive ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)',
                            color: isInactive ? '#f87171' : '#4ade80',
                            border: `1px solid ${isInactive ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`,
                            fontWeight: 'bold', fontSize: 13, px: 1.5, py: 0.5,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: `1px solid ${palette.paperBorder}`, py: 3, pr: 4 }}>
                        <Box display="flex" justifyContent="center" gap={1.5}>
                          <Tooltip title="Editar" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEdit(user)}
                              sx={{ color: brightTextMuted, p: 1, '&:hover': { color: ACCENT, bgcolor: `${ACCENT}20` } }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={isInactive ? 'Reactivar' : 'Desactivar'} arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenConfirm(user)}
                              sx={{
                                color: isInactive ? '#4ade80' : 'rgba(239,68,68,0.85)', p: 1,
                                '&:hover': {
                                  color: isInactive ? '#4ade80' : '#ef4444',
                                  bgcolor: isInactive ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                                },
                              }}
                            >
                              {isInactive ? <RestoreIcon fontSize="small" /> : <DeleteIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </motion.tr>
                  )
                })
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
              color: brightTextMuted, borderTop: `1px solid ${palette.paperBorder}`, py: 1.5, px: 2,
              '& .MuiTablePagination-select': { color: palette.textPrimary },
              '& .MuiTablePagination-selectIcon': { color: brightTextMuted },
              '& .MuiIconButton-root': {
                color: brightTextMuted,
                '&:hover': { color: ACCENT, bgcolor: `${ACCENT}20` },
                '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)' },
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
              background: palette.paperBg, backdropFilter: 'blur(16px)', border: `1px solid ${palette.paperBorder}`,
              borderRadius: 4, boxShadow: '0 30px 80px -12px rgba(0, 0, 0, 0.7)', p: 1,
            },
          },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ color: palette.textPrimary, fontWeight: 'bold', pb: 0, pt: 2, px: 3 }}>
            {openCreate ? 'Nuevo Usuario' : 'Editar Usuario'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3, px: 3 }}>
            <Box display="flex" flexDirection="column" gap={3}>
              <Box display="flex" gap={2}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Nombre"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      size="medium"
                      sx={fieldStyles}
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Apellido"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      size="medium"
                      sx={fieldStyles}
                    />
                  )}
                />
              </Box>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    size="medium"
                    sx={fieldStyles}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={openCreate ? 'Contraseña' : 'Contraseña (dejar vacío para mantener)'}
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    size="medium"
                    autoComplete="new-password"
                    sx={fieldStyles}
                  />
                )}
              />
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Rol"
                    size="medium"
                    sx={{
                      ...fieldStyles,
                      '& .MuiSelect-select': { color: palette.textPrimary },
                      '& .MuiSvgIcon-root': { color: brightTextMuted },
                    }}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            background: palette.paperBg, backdropFilter: 'blur(16px)', border: `1px solid ${palette.paperBorder}`,
                            '& .MuiMenuItem-root': {
                              color: palette.textPrimary,
                              '&:hover': { bgcolor: `${ACCENT}25` },
                              '&.Mui-selected': { bgcolor: `${ACCENT}35`, color: ACCENT },
                            },
                          },
                        },
                      },
                    }}
                  >
                    {ROLES.map((role) => (
                      <MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
            <Button
              onClick={handleCloseModals}
              sx={{
                color: brightTextMuted, borderRadius: 3, px: 2.5,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: palette.textPrimary },
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
                bgcolor: ACCENT, color: '#20232a', fontWeight: 'bold', borderRadius: 3, px: 3,
                '&:hover': { bgcolor: ACCENT, boxShadow: `0 0 15px ${ACCENT_GLOW}` },
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
              background: palette.paperBg, backdropFilter: 'blur(16px)', border: `1px solid ${palette.paperBorder}`,
              borderRadius: 4, boxShadow: '0 30px 80px -12px rgba(0, 0, 0, 0.7)', p: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ color: palette.textPrimary, fontWeight: 'bold', pb: 0, pt: 2, px: 3 }}>
          {selectedUser?.isActive === false ? 'Reactivar Usuario' : 'Desactivar Usuario'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3 }}>
          <Typography color={brightTextMuted} fontSize={14.5}>
            {selectedUser?.isActive === false
              ? `¿Estás seguro de reactivar a ${selectedUser?.firstName} ${selectedUser?.lastName}?`
              : `¿Estás seguro de desactivar a ${selectedUser?.firstName} ${selectedUser?.lastName}? Esta acción cambiará su estado en el sistema.`
            }
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button
            onClick={() => setOpenConfirm(false)}
            sx={{
              color: brightTextMuted, borderRadius: 3, px: 2.5,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: palette.textPrimary },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleToggleStatus}
            disabled={saving}
            sx={{
              bgcolor: selectedUser?.isActive === false ? '#16a34a' : '#ef4444', color: 'white', fontWeight: 'bold', borderRadius: 3, px: 3,
              '&:hover': { bgcolor: selectedUser?.isActive === false ? '#16a34a' : '#ef4444', opacity: 0.9 },
            }}
          >
            {saving ? 'Procesando...' : selectedUser?.isActive === false ? 'Reactivar' : 'Desactivar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}