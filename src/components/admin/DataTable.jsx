import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, TablePagination, TextField, InputAdornment, CircularProgress, Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useThemeMode } from '../../theme/ThemeModeContext'
import { fieldSx } from '../../theme/adminStyles'

export default function DataTable({
  columns, rows, loading, total, page, limit,
  onPageChange, onLimitChange,
  sortBy, sortOrder, onSortChange,
  search, onSearchChange,
  renderActions, emptyMessage = 'Sin resultados', toolbarExtra,
}) {
  const { palette } = useThemeMode()

  return (
    <Paper sx={{
      background: palette.paperBg,
      backdropFilter: 'blur(16px)',
      border: `1px solid ${palette.paperBorder}`,
      boxShadow: palette.paperShadow,
      borderRadius: 4,
      overflow: 'hidden',
    }}>
      <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: palette.textSecondary, fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ minWidth: 240, ...fieldSx(palette) }}
        />
        {toolbarExtra}
      </Box>
      <TableContainer sx={{ maxHeight: 560 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{ bgcolor: palette.navBg, backdropFilter: 'blur(8px)', color: palette.textSecondary, fontWeight: 'bold', borderBottom: `1px solid ${palette.paperBorder}` }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortBy === col.key}
                      direction={sortBy === col.key ? sortOrder : 'asc'}
                      onClick={() => onSortChange(col.key)}
                      sx={{
                        color: 'inherit',
                        '&.MuiTableSortLabel-root:hover': { color: palette.accent },
                        '&.Mui-active': { color: palette.accent },
                        '& .MuiTableSortLabel-icon': { color: `${palette.accent} !important` },
                      }}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : col.label}
                </TableCell>
              ))}
              {renderActions && (
                <TableCell align="right" sx={{ bgcolor: palette.navBg, backdropFilter: 'blur(8px)', color: palette.textSecondary, fontWeight: 'bold', borderBottom: `1px solid ${palette.paperBorder}` }}>
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 6, border: 'none' }}>
                  <CircularProgress size={32} sx={{ color: palette.accent }} />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 6, border: 'none' }}>
                  <Typography sx={{ color: palette.textSecondary }}>{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : rows.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:hover': { bgcolor: palette.accentBg } }}>
                {columns.map((col) => (
                  <TableCell key={col.key} sx={{ color: palette.textPrimary, borderBottom: `1px solid ${palette.paperBorder}` }}>
                    {col.render ? col.render(row) : row[col.key]}
                  </TableCell>
                ))}
                {renderActions && (
                  <TableCell align="right" sx={{ borderBottom: `1px solid ${palette.paperBorder}` }}>
                    {renderActions(row)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={total === 0 ? 0 : page - 1}
        rowsPerPage={limit}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        onRowsPerPageChange={(e) => onLimitChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        sx={{
          color: palette.textSecondary,
          borderTop: `1px solid ${palette.paperBorder}`,
          '.MuiTablePagination-selectIcon': { color: palette.textSecondary },
          '.MuiTablePagination-actions button': { color: palette.textSecondary },
        }}
      />
    </Paper>
  )
}
