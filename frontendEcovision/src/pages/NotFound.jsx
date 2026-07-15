import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 p-10 text-center">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Página no encontrada</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">La sección que buscas no existe o fue movida.</p>
      <Link to="/" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
        Volver al Dashboard
      </Link>
    </div>
  )
}
