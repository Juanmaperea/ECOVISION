import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Camera, History, BarChart3, HeartPulse, Info, Leaf } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/camara', label: 'Cámara IA', icon: Camera },
  { to: '/historial', label: 'Historial', icon: History },
  { to: '/estadisticas', label: 'Estadísticas', icon: BarChart3 },
  { to: '/acerca-del-proyecto', label: 'Acerca del proyecto', icon: Info },
]

export default function Sidebar({ onNavigate }) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white">
          <Leaf size={20} />
        </div>
        <div>
          <p className="text-base font-bold leading-tight text-slate-900 dark:text-white">EcoVision</p>
          <p className="text-xs leading-tight text-slate-500 dark:text-slate-400">IA para un planeta limpio</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 rounded-xl2 border border-brand-100 bg-brand-50 p-4 dark:border-brand-900/60 dark:bg-brand-900/20">
        <p className="flex items-center gap-2 text-sm font-semibold text-brand-800 dark:text-brand-300">
          <Leaf size={16} /> Impacto ambiental
        </p>
        <p className="mt-1 text-xs text-brand-700/80 dark:text-brand-300/80">
          Cada detección cuenta para un mundo más limpio.
        </p>
      </div>
    </aside>
  )
}
