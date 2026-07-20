import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import { useThemeMode } from '../../theme/ThemeModeContext'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirmar', danger, loading, onConfirm, onClose }) {
  const { palette } = useThemeMode()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { background: palette.paperBg, backdropFilter: 'blur(16px)', borderRadius: 4, border: `1px solid ${palette.paperBorder}`, minWidth: 340 } } }}
    >
      <DialogTitle sx={{ color: palette.textPrimary, fontWeight: 'bold' }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: palette.textSecondary }}>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: palette.textSecondary }}>Cancelar</Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          sx={{
            bgcolor: danger ? palette.dangerSolidBg : palette.accent,
            color: danger ? palette.dangerSolidText : palette.accentContrast,
            fontWeight: 'bold',
            '&:hover': { bgcolor: danger ? palette.dangerSolidBg : palette.accent, filter: 'brightness(1.1)' },
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
