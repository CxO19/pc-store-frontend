import { Box } from '@mui/material'

export default function CircuitBackground({ palette }) {
  const lineOpacity = palette.mode === 'dark' ? 0.65 : 0.5
  const dotOpacity = palette.mode === 'dark' ? 1 : 0.85
  const strokeWidth = palette.mode === 'dark' ? 1 : 1.4
  const fade = 'radial-gradient(ellipse 70% 70% at 50% 45%, transparent 0%, transparent 22%, black 60%)'

  const nodes = [
    { cx: 40, cy: 20, delay: 0 },
    { cx: 90, cy: 70, delay: 0.6 },
    { cx: 120, cy: 90, delay: 1.2 },
    { cx: 70, cy: 40, delay: 1.8 },
    { cx: 20, cy: 110, delay: 0.9 },
  ]

  return (
    <Box sx={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      zIndex: 0,
      pointerEvents: 'none',
      maskImage: fade,
      WebkitMaskImage: fade,
    }}>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="circuitPattern" width="160" height="160" patternUnits="userSpaceOnUse">
            <path
              d="M0 70 H40 V20 H90 V70 H140 M70 0 V40 H120 V90 H70 V160 M20 110 H70 M0 20 V0 M140 140 H160"
              fill="none"
              stroke={palette.accent}
              strokeWidth={strokeWidth}
              opacity={lineOpacity}
            />
            <path
              d="M90 70 L120 90 M40 20 L20 0"
              fill="none"
              stroke={palette.accent}
              strokeWidth={strokeWidth}
              opacity={lineOpacity * 0.7}
            />
            {nodes.map((n, i) => (
              <circle key={i} cx={n.cx} cy={n.cy} r="3.2" fill={palette.accent} opacity={dotOpacity}>
                <animate
                  attributeName="opacity"
                  values={`${dotOpacity};${dotOpacity * 0.25};${dotOpacity}`}
                  dur="3.2s"
                  begin={`${n.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
            {nodes.map((n, i) => (
              <rect
                key={`sq-${i}`}
                x={n.cx - 6} y={n.cy - 6} width="12" height="12"
                rx="2"
                fill="none"
                stroke={palette.accent}
                strokeWidth={strokeWidth * 0.8}
                opacity={lineOpacity}
              />
            ))}
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#circuitPattern)" />
      </svg>
    </Box>
  )
}
