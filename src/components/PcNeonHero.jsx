import { Box } from '@mui/material'

const SECONDARY = '#4c8dff'

function SideRail({ palette, mirror }) {
  const isDark = palette.mode === 'dark'
  const glowStrength = isDark ? 1 : 0.55
  const lineOpacity = isDark ? 0.85 : 0.5
  const fillOpacity = isDark ? 0.18 : 0.1
  const cx = 70

  return (
    <svg width="100%" height="100%" viewBox="0 0 140 700" preserveAspectRatio="xMidYMid meet"
      style={{ transform: mirror ? 'scaleX(-1)' : 'none' }}
    >
      <defs>
        <filter id={`railGlow-${mirror}`} x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation={5 * glowStrength} result="b1" />
          <feGaussianBlur stdDeviation={12 * glowStrength} in="SourceGraphic" result="b2" />
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Linea vertical conectora */}
      <line x1={cx} y1="60" x2={cx} y2="640" stroke={palette.accent} strokeWidth="1.5" opacity={lineOpacity * 0.6} filter={`url(#railGlow-${mirror})`} />

      {/* Ventilador arriba, girando */}
      <g filter={`url(#railGlow-${mirror})`}>
        <circle cx={cx} cy="110" r="40" fill="none" stroke={SECONDARY} strokeWidth="2.5" opacity={glowStrength} />
        <circle cx={cx} cy="110" r="8" fill={SECONDARY} opacity={glowStrength} />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path key={deg} d={`M${cx} 110 Q${cx + 20} 89 ${cx} 68 Q${cx - 14} 90 ${cx} 110 Z`} fill={SECONDARY} opacity={glowStrength * 0.5} transform={`rotate(${deg} ${cx} 110)`}>
            <animateTransform attributeName="transform" type="rotate" from={`${deg} ${cx} 110`} to={`${deg + 360} ${cx} 110`} dur="5s" repeatCount="indefinite" />
          </path>
        ))}
      </g>

      {/* Chip CPU */}
      <g filter={`url(#railGlow-${mirror})`} fill="none" stroke={palette.accent} strokeWidth="1.5" opacity={lineOpacity}>
        <rect x={cx - 26} y="240" width="52" height="52" rx="4" fill={palette.accent} fillOpacity={fillOpacity} />
        <rect x={cx - 10} y="256" width="20" height="20" />
        {[cx - 12, cx, cx + 12].map((p) => (
          <g key={p}>
            <line x1={p} y1="228" x2={p} y2="240" />
            <line x1={p} y1="292" x2={p} y2="304" />
          </g>
        ))}
      </g>

      {/* Memoria RAM */}
      <g filter={`url(#railGlow-${mirror})`} fill="none" stroke={palette.accent} strokeWidth="1.5" opacity={lineOpacity}>
        <rect x={cx - 20} y="380" width="40" height="120" rx="3" fill={palette.accent} fillOpacity={fillOpacity} />
        <line x1={cx - 10} y1="392" x2={cx - 10} y2="488" strokeWidth="1" opacity="0.7" />
        <line x1={cx} y1="392" x2={cx} y2="488" strokeWidth="1" opacity="0.7" />
        <line x1={cx + 10} y1="392" x2={cx + 10} y2="488" strokeWidth="1" opacity="0.7" />
      </g>

      {/* Nodo pulsante abajo */}
      <circle cx={cx} cy="590" r="5" fill={SECONDARY} opacity={glowStrength} filter={`url(#railGlow-${mirror})`}>
        <animate attributeName="r" values="5;8;5" dur="2.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

export default function PcNeonHero({ palette }) {
  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      <Box sx={{
        display: { xs: 'none', xl: 'block' },
        position: 'absolute',
        left: 110,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 140,
        height: '82%',
        opacity: 0.9,
      }}>
        <SideRail palette={palette} mirror={false} />
      </Box>

      <Box sx={{
        display: { xs: 'none', xl: 'block' },
        position: 'absolute',
        right: 110,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 140,
        height: '82%',
        opacity: 0.9,
      }}>
        <SideRail palette={palette} mirror={true} />
      </Box>
    </Box>
  )
}
