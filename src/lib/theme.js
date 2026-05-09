import { useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'ai_saas_theme_mode'

const getPreferredTheme = () => {
  if (typeof window === 'undefined') return 'light'

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyTheme = (theme) => {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  root.setAttribute('data-theme', theme)
}

export const useTheme = () => {
  const [theme, setTheme] = useState(getPreferredTheme)

  useEffect(() => {
    applyTheme(theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
  }
}
