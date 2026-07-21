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
      name: 'Backend (FastAPI)'},
    {
      name: 'Modelo YOLOv8',},
    {
      name: 'Gemini API',},
    {
      name: 'Base de datos (PostgreSQL)',},
  ]

  return (
    <div className="flex flex-col gap-4">
      <SectionCard
        >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <div key={service.name} className="rounded-xl2 border border-slate-100 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{service.name}</p>
                
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{service.detail}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Información del sistema">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <Field label="Aplicación" value={ 'EcoVision'} />
        </dl>
      </SectionCard>

      
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
