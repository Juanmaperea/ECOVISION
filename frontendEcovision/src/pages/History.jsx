import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, RefreshCw, ChevronLeft, ChevronRight, Info } from 'lucide-react'
import SectionCard from '../components/common/SectionCard.jsx'
import { CategoryBadge, ConfidenceBadge } from '../components/common/Badges.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/common/States.jsx'
import { useHistory } from '../context/HistoryContext.jsx'
import { ALL_CATEGORIES } from '../utils/wasteTaxonomy.js'
import { formatDateTime, formatMs } from '../utils/format.js'

const PAGE_SIZE = 8
const SORT_OPTIONS = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'oldest', label: 'Más antiguos' },
  { value: 'confidence', label: 'Mayor confianza' },
]

export default function History() {
  const { records, loading, error, refresh } = useHistory()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [sort, setSort] = useState('recent')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = records
    if (category !== 'Todas') result = result.filter((r) => r.category === category)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter((r) => r.label.toLowerCase().includes(q) || r.detectedObject.toLowerCase().includes(q))
    }
    const sorted = [...result]
    if (sort === 'recent') sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (sort === 'oldest') sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    if (sort === 'confidence') sorted.sort((a, b) => b.confidence - a.confidence)
    return sorted
  }, [records, category, search, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-4">
      <SectionCard
        action={
          <div className="flex items-center gap-2">
            <span
              title="El backend todavía no expone un endpoint DELETE /history (HU-12 pendiente)."
              className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-400 dark:border-slate-700 sm:flex"
            >
              <Info size={13} /> Vaciar historial (pendiente en backend)
            </span>
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Actualizar
            </button>
          </div>
        }
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Buscar detección…"
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setPage(1)
            }}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
          >
            <option>Todas</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <LoadingState label="Cargando historial…" />
        ) : error ? (
          <ErrorState message={error.message} onRetry={refresh} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="El historial está vacío"
            message={records.length === 0 ? 'Aún no se han registrado detecciones.' : 'Ningún registro coincide con los filtros aplicados.'}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                    <th className="py-2 pr-4 font-medium">Fecha y hora</th>
                    <th className="py-2 pr-4 font-medium">Objeto detectado</th>
                    <th className="py-2 pr-4 font-medium">Categoría</th>
                    <th className="py-2 pr-4 font-medium">Confianza</th>
                    <th className="py-2 pr-0 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pageItems.map((r) => (
                    <tr key={r.id}>
                      <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">{formatDateTime(r.createdAt)}</td>
                      <td className="py-3 pr-4 font-medium text-slate-800 dark:text-slate-100">{r.label}</td>
                      <td className="py-3 pr-4">
                        <CategoryBadge category={r.category} />
                      </td>
                      <td className="py-3 pr-4">
                        <ConfidenceBadge confidence={r.confidence} />
                      </td>
                      <td className="py-3 pr-0 text-right">
                        <Link to={`/historial/${r.id}`} className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
                          Ver detalle
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>
                Mostrando {pageItems.length} de {filtered.length} registros
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-200 p-1.5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
                >
                  <ChevronLeft size={14} />
                </button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-lg border border-slate-200 p-1.5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </SectionCard>
    </div>
  )
}
