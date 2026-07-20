export const fieldSx = (palette) => ({
  '& .MuiOutlinedInput-root': {
    color: palette.textPrimary,
    borderRadius: 2,
    backgroundColor: palette.inputBg,
    '& fieldset': { borderColor: palette.inputBorder },
    '&:hover fieldset': { borderColor: palette.accent },
    '&.Mui-focused fieldset': { borderColor: palette.accent, borderWidth: 2 },
  },
  '& .MuiInputLabel-root': { color: palette.textSecondary },
  '& .MuiInputLabel-root.Mui-focused': { color: palette.accent },
  '& .MuiSelect-icon': { color: palette.textSecondary },
})

export const primaryBtnSx = (palette) => ({
  bgcolor: palette.accent,
  color: palette.accentContrast,
  fontWeight: 'bold',
  borderRadius: 3,
  boxShadow: `0 4px 20px -6px ${palette.accentGlow}`,
  '&:hover': { bgcolor: palette.accent, boxShadow: `0 6px 24px -4px ${palette.accentGlow}`, filter: 'brightness(1.05)' },
})
