export const inputStyle = (palette) => ({
  '& .MuiOutlinedInput-root': {
    color: palette.textPrimary,
    borderRadius: 3,
    backgroundColor: palette.inputBg,
    '& fieldset': { borderColor: palette.inputBorder },
    '&:hover fieldset': { borderColor: palette.accent },
    '&.Mui-focused fieldset': { borderColor: palette.accent, borderWidth: 2 },
  },
  '& .MuiInputLabel-root': {
    color: palette.textSecondary,
    backgroundColor: 'transparent',
    fontWeight: 600,
  },
  '& .MuiInputLabel-root.Mui-focused': { color: palette.accent },
  '& .MuiInputLabel-shrink': { color: palette.accent },
})

export const glowBtn = (palette) => ({
  mt: 3, mb: 1,
  borderRadius: 3,
  color: palette.accentContrast,
  borderColor: 'transparent',
  background: palette.accentGradient,
  py: 1.5,
  fontSize: '1rem',
  fontWeight: 'bold',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: 'transparent',
    boxShadow: `0 8px 30px -5px ${palette.accentGlow}`,
    background: palette.accentGradient,
    transform: 'translateY(-1px) scale(1.01)',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  '&:disabled': {
    color: palette.textSecondary,
    borderColor: palette.inputBorder,
    background: 'transparent',
  }
})
