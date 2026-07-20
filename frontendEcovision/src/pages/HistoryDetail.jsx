import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Lightbulb } from 'lucide-react'
import SectionCard from '../components/common/SectionCard.jsx'
import { CategoryBadge, ConfidenceBadge } from '../components/common/Badges.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/common/States.jsx'
import { useHistory } from '../context/HistoryContext.jsx'
import { formatDateTime, formatMs } from '../utils/format.js'

export default function HistoryDetail() {
  const { id } = useParams()
  const { getById } = useHistory()
  const [state, setState] = useState({ loading: true, record: null, error: null })

  useEffect(() => {
    let cancelled = false
    setState({ loading: true, record: null, error: null })

    getById(id).then((result) => {
      if (cancelled) return
      if (result.ok) {
        setState({ loading: false, record: result.data, error: null })
      } else {
        setState({ loading: false, record: null, error: result.error })
      }
    })

    return () => {
      cancelled = true
    }
  }, [id, getById])

  if (state.loading) {
    return (
      <SectionCard>
        <LoadingState label="Cargando detección…" />
      </SectionCard>
    )
  }

  if (state.error || !state.record) {
    return (
      <SectionCard>
        {state.error ? (
          <ErrorState message={state.error.message} />
        ) : (
          <EmptyState title="Detección no encontrada" message="Es posible que este registro no exista o haya sido removido." />
        )}
        <Link to="/historial" className="mt-4 flex w-fit items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
          <ArrowLeft size={14} /> Volver a Historial
        </Link>
      </SectionCard>
    )
  }

  const record = state.record

  return (
    <div className="flex flex-col gap-4">
      <Link to="/historial" className="flex w-fit items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
        <ArrowLeft size={14} /> Volver a Historial
      </Link>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <SectionCard title="Información" className="xl:col-span-2">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{record.label}</h3>
            <ConfidenceBadge confidence={record.confidence} />
            <CategoryBadge category={record.category} />
          </div>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <Field label="Material" value={record.material} />
            <Field
              label="Contenedor recomendado"
              value={record.container ?? 'No disponible (el backend aún no persiste este dato en el historial)'}
            />
            <Field label="Nivel de reciclabilidad" value={record.recyclability} />
            <Field label="Fecha y hora" value={formatDateTime(record.createdAt)} />
            <Field label="Modelo utilizado" value="YOLOv8" />
          </dl>

          
        </SectionCard>

        <SectionCard title="Recomendación generada por IA (Gemini)">
          {!record.explanation ? (
            <EmptyState title="Sin recomendación" message="Esta detección no obtuvo respuesta del servicio de recomendaciones." />
          ) : (
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Explicación</p>
                <p className="text-slate-700 dark:text-slate-200">{record.explanation}</p>
              </div>
              {record.recommendation && (
                <div className="flex items-start gap-2 rounded-lg bg-brand-50 p-3 text-brand-800 dark:bg-brand-900/20 dark:text-brand-300">
                  <Lightbulb size={16} className="mt-0.5 shrink-0" />
                  <p>{record.recommendation}</p>
                </div>
              )}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="font-medium text-slate-800 dark:text-slate-100">{value}</dd>
    </div>
  )
}
