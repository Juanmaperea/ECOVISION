import { CATEGORY_COLORS } from '../../utils/wasteTaxonomy'

export function CategoryBadge({ category }) {
  const color = CATEGORY_COLORS[category] ?? '#94a3b8'
  return (
    <span
      className="badge"
      style={{ backgroundColor: `${color}1a`, color }}
    >
      {category}
    </span>
  )
}

export function ConfidenceBadge({ confidence }) {
  const pct = Math.round((confidence ?? 0) * 100)
  let tone = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
  let text = 'Alta confianza'
  if (pct < 50) {
    tone = 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    text = 'Baja confianza'
  } else if (pct < 80) {
    tone = 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    text = 'Confianza media'
  }
  return (
    <span className={`badge ${tone}`}>
      {text} · {pct}%
    </span>
  )
}

export function StatusBadge({ status }) {
  const tone =
    status === 'ok'
      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
      : status === 'pending'
        ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
        : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
  const label = status === 'ok' ? 'Activo' : status === 'pending' ? 'Pendiente' : 'Inactivo'
  return <span className={`badge ${tone}`}>{label}</span>
}
