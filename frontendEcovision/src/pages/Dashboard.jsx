import { Link } from 'react-router-dom'
import { Camera, Target, TrendingUp, Trophy, Leaf, Recycle, Gauge, ArrowRight } from 'lucide-react'
import StatCard from '../components/common/StatCard.jsx'
import SectionCard from '../components/common/SectionCard.jsx'
import CategoryBarChart from '../components/charts/CategoryBarChart.jsx'
import MaterialDonutChart from '../components/charts/MaterialDonutChart.jsx'
import DetectionsLineChart from '../components/charts/DetectionsLineChart.jsx'
import { CategoryBadge } from '../components/common/Badges.jsx'
import { EmptyState } from '../components/common/States.jsx'
import { useMetrics } from '../hooks/useMetrics.js'
import { useSystemHealth } from '../hooks/useSystemHealth.js'
import { formatPercent, formatRelativeTime } from '../utils/format.js'

export default function Dashboard() {
  const metrics = useMetrics(14)
  const { loading, reachable } = useSystemHealth()

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Camera} label="Imágenes analizadas" value={metrics.total.toLocaleString('es-CO')} />
        <StatCard
          icon={Target}
          label="Precisión promedio"
          value={formatPercent(metrics.avgConfidence)}
          iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
        />
        <StatCard
          icon={TrendingUp}
          label="Detecciones hoy"
          value={metrics.detectionsToday.toLocaleString('es-CO')}
          iconClassName="bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300"
        />
        <StatCard
          icon={Trophy}
          label="Categoría más frecuente"
          value={metrics.topCategory}
          trend={metrics.total ? metrics.topCategoryShare * 100 : null}
          trendLabel="del total"
          iconClassName="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <SectionCard title="Detecciones por categoría" subtitle="Todas las sesiones registradas" className="xl:col-span-2">
          <CategoryBarChart data={metrics.categoryData} />
        </SectionCard>
        <SectionCard title="Impacto ambiental" subtitle="Estimado a partir del historial">
          <div className="grid grid-cols-2 gap-4">
            <ImpactStat icon={Leaf} label="CO₂ ahorrado" value={`${metrics.co2SavedKg.toFixed(1)} kg`} />
            <ImpactStat icon={Recycle} label="Material reciclado" value={`${metrics.recycledKg.toFixed(1)} kg`} />
            <ImpactStat icon={Target} label="Recomendaciones IA" value={metrics.recommendationsGenerated.toLocaleString('es-CO')} />
          </div>
        </SectionCard>

      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <SectionCard title="Distribución de materiales" subtitle="Total acumulado">
          <MaterialDonutChart data={metrics.categoryData} />
        </SectionCard>

        <SectionCard title="Detecciones por día" subtitle="Últimos 14 días" className="xl:col-span-2">
          <DetectionsLineChart data={metrics.dailySeries} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <SectionCard
          title="Actividad reciente"
          className="xl:col-span-2"
          action={<Link to="/historial" className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">Ver todas</Link>}
        >
          {metrics.recent.length === 0 ? (
            <EmptyState title="Todavía no hay detecciones" message="Ve a Cámara IA para iniciar el análisis en tiempo real." />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {metrics.recent.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{r.label}</p>
                    <p className="text-xs text-slate-400">{formatRelativeTime(r.createdAt)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <CategoryBadge category={r.category} />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {formatPercent(r.confidence)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        
      </div>
    </div>
  )
}

function StatusRow({ label, ok, loading, note }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm text-slate-700 dark:text-slate-200">{label}</p>
        {note && <p className="text-[11px] text-slate-400">{note}</p>}
      </div>
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          loading ? 'bg-slate-300 dark:bg-slate-600' : ok ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      />
    </div>
  )
}

function ImpactStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl2 border border-slate-100 p-3 dark:border-slate-800">
      <Icon size={16} className="text-brand-600 dark:text-brand-400" />
      <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}
