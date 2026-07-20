import { Menu, Moon, Sun, Leaf, CircleCheck, CircleAlert } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useSystemHealth } from '../../hooks/useSystemHealth.js'

export default function Topbar({ title, subtitle, onOpenSidebar }) {
  const { isDark, toggleTheme } = useTheme()
  const { loading, reachable } = useSystemHealth()

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <span
          className={`badge hidden sm:inline-flex ${
            loading
              ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              : reachable
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
          }`}
        >
          {loading ? (
            <CircleAlert size={14} />
          ) : reachable ? (
            <CircleCheck size={14} />
          ) : (
            <CircleAlert size={14} />
          )}
          {loading ? 'Verificando backend…' : reachable ? 'Sistema funcionando' : 'Backend no disponible'}
        </span>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 dark:border-slate-700 sm:flex">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white">
            <Leaf size={13} />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">EcoVision</span>
        </div>
      </div>
    </header>
  )
}
