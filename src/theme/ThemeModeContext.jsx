import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { palettes } from './palette'

const STORAGE_KEY = 'pcstore-theme-mode'
const ThemeModeContext = createContext(null)

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem(STORAGE_KEY) || 'light')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const toggleMode = () => setMode((m) => (m === 'light' ? 'dark' : 'light'))

  const value = useMemo(() => ({ mode, toggleMode, palette: palettes[mode] }), [mode])

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  )
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext)
  if (!ctx) throw new Error('useThemeMode debe usarse dentro de ThemeModeProvider')
  return ctx
}
