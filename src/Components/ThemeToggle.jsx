import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../lib/theme'

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type='button'
      onClick={toggleTheme}
      className='inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer'
      aria-label='Toggle theme'
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className='w-4 h-4 text-amber-500' /> : <Moon className='w-4 h-4 text-slate-700' />}
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  )
}

export default ThemeToggle
