import { RefreshCw } from 'lucide-react'
import SectionCard from '../components/common/SectionCard.jsx'
import { StatusBadge } from '../components/common/Badges.jsx'
import { useSystemHealth } from '../hooks/useSystemHealth.js'
import { formatDateTime } from '../utils/format.js'
import { API_BASE_URL } from '../api/client.js'

export default function SystemStatus() {
  const health = useSystemHealth()

  const services = [
    {
      name: 'Backend (FastAPI)',
      status: health.loading ? 'pending' : health.reachable ? 'ok' : 'down',
      detail: health.reachable ? `Versión ${health.data?.version ?? '—'}` : health.error?.message ?? 'Sin respuesta',
    },
    {
      name: 'Modelo YOLOv8',
      status: health.detailedAvailable ? (health.detailed?.yolo?.status ?? 'pending') : health.reachable ? 'ok' : 'pending',
      detail: health.detailedAvailable
        ? health.detailed?.yolo?.detail ?? '—'
        : 'Inferido de /health: aún no existe un chequeo específico del modelo en el backend.',
    },
    {
      name: 'Gemini API',
      status: health.detailedAvailable ? (health.detailed?.gemini?.status ?? 'pending') : 'pending',
      detail: health.detailedAvailable
        ? health.detailed?.gemini?.detail ?? '—'
        : 'El backend aún no expone un endpoint de estado para el servicio de recomendaciones.',
    },
    {
      name: 'Base de datos (PostgreSQL)',
      status: health.detailedAvailable ? (health.detailed?.database?.status ?? 'pending') : 'pending',
      detail: health.detailedAvailable
        ? health.detailed?.database?.detail ?? '—'
        : 'Los módulos de historial y métricas del backend todavía no exponen este chequeo.',
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <SectionCard
        title="Servicios"
        subtitle={health.lastCheckedAt ? `Última verificación: ${formatDateTime(health.lastCheckedAt)}` : undefined}
        action={
          <button
            type="button"
            onClick={health.refresh}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RefreshCw size={13} /> Verificar ahora
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <div key={service.name} className="rounded-xl2 border border-slate-100 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{service.name}</p>
                <StatusBadge status={service.status} />
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{service.detail}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Información del sistema">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <Field label="Aplicación" value={health.data?.application ?? 'EcoVision'} />
          <Field label="Versión" value={health.data?.version ?? '—'} />
          <Field label="Entorno" value={import.meta.env.MODE} />
          <Field label="URL del backend" value={API_BASE_URL} />
        </dl>
      </SectionCard>

      <div className="rounded-xl2 border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
        Esta pantalla consulta el endpoint <code>GET /health</code>, ya disponible en el backend. Las tarjetas de Modelo
        YOLOv8, Gemini API y Base de datos están listas para integrarse contra un futuro endpoint{' '}
        <code>GET /health/detailed</code>; mientras el backend no lo exponga, se muestran como “Pendiente” en lugar de datos
        simulados.
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="break-all font-medium text-slate-800 dark:text-slate-100">{value}</dd>
    </div>
  )
}
