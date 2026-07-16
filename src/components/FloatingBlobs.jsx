import { Box } from '@mui/material'

export default function FloatingBlobs({ palette }) {
  const blobs = [
    { size: 420, top: '-10%', left: '-8%', duration: 14 },
    { size: 320, top: '55%', left: '68%', duration: 18 },
    { size: 260, top: '75%', left: '5%', duration: 16 },
  ]

  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
      {blobs.map((blob, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            top: blob.top,
            left: blob.left,
            width: blob.size,
            height: blob.size,
            borderRadius: '50%',
            background: palette.accent,
            opacity: palette.mode === 'dark' ? 0.12 : 0.14,
            filter: 'blur(80px)',
            animation: `authFloatBlob${i} ${blob.duration}s ease-in-out infinite`,
            [`@keyframes authFloatBlob${i}`]: {
              '0%, 100%': { transform: 'translate(0, 0)' },
              '33%': { transform: 'translate(30px, -20px)' },
              '66%': { transform: 'translate(-20px, 20px)' },
            },
          }}
        />
      ))}
    </Box>
  )
}
