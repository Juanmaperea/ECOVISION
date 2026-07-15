import { Loader2, AlertTriangle, Inbox } from 'lucide-react'

export function LoadingState({ label = 'Cargando…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-500 dark:text-slate-400">
      <Loader2 size={22} className="animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function ErrorState({ message = 'Ocurrió un error inesperado.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300">
        <AlertTriangle size={18} />
      </div>
      <p className="max-w-sm text-sm text-slate-600 dark:text-slate-300">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title = 'Sin datos', message, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-slate-500 dark:text-slate-400">
      <Icon size={22} />
      <p className="text-sm font-medium">{title}</p>
      {message && <p className="max-w-sm text-xs">{message}</p>}
    </div>
  )
}
