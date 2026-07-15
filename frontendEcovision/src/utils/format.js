export function formatDateTime(value) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(value) {
  const date = value instanceof Date ? value : new Date(value)
  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.round(diffMs / 1000)

  if (diffSec < 5) return 'Justo ahora'
  if (diffSec < 60) return `Hace ${diffSec} seg`
  const diffMin = Math.round(diffSec / 60)
  if (diffMin < 60) return `Hace ${diffMin} min`
  const diffHour = Math.round(diffMin / 60)
  if (diffHour < 24) return `Hace ${diffHour} h`
  const diffDay = Math.round(diffHour / 24)
  return `Hace ${diffDay} d`
}

export function formatPercent(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return `${(value * 100).toFixed(digits)}%`
}

export function formatMs(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return `${Math.round(value)} ms`
}

export function dayKey(value) {
  const date = value instanceof Date ? value : new Date(value)
  return date.toISOString().slice(0, 10)
}

export function shortDay(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`)
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
}
