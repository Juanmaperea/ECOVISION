import { Camera, Clock, Target, Sparkles } from 'lucide-react'
import SectionCard from '../components/common/SectionCard.jsx'
import CategoryBarChart from '../components/charts/CategoryBarChart.jsx'
import MaterialDonutChart from '../components/charts/MaterialDonutChart.jsx'
import DetectionsLineChart from '../components/charts/DetectionsLineChart.jsx'
import { useMetrics } from '../hooks/useMetrics.js'
import { formatMs, formatPercent } from '../utils/format.js'
import { useBackendMetrics } from '../hooks/useBackendMetrics'
import {
  Cpu,
  MemoryStick,
  DollarSign,
  CalendarDays,
} from 'lucide-react'

export default function Statistics() {
  const metrics = useMetrics(14)
  const backend = useBackendMetrics()

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <SectionCard title="Detecciones por día" subtitle="Últimos 14 días" className="xl:col-span-2">
          <DetectionsLineChart data={metrics.dailySeries} height={280} />
        </SectionCard>
        <SectionCard title="Distribución por categorías" subtitle="Total acumulado">
          <MaterialDonutChart data={metrics.categoryData} height={200} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SectionCard title="Materiales más detectados" subtitle="Total acumulado">
          <CategoryBarChart data={metrics.categoryData} height={280} />
        </SectionCard>
        <SectionCard title="Indicadores generales">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

            <Indicator
              icon={Camera}
              label="Imágenes analizadas"
              value={metrics.total.toLocaleString('es-CO')}
              sub="Total acumulado"
            />

            <Indicator
              icon={Target}
              label="Precisión promedio"
              value={formatPercent(metrics.avgConfidence)}
              sub="YOLOv8"
            />

            <Indicator
              icon={Sparkles}
              label="Recomendaciones"
              value={metrics.recommendationsGenerated.toLocaleString('es-CO')}
              sub="Generadas"
            />

            <Indicator
              icon={Clock}
              label="Latencia"
              value={
                backend.metrics
                  ? `${backend.metrics.latency.toFixed(3)} s`
                  : '--'
              }
              sub="Último análisis"
            />

            <Indicator
              icon={Cpu}
              label="CPU"
              value={
                backend.metrics
                  ? `${backend.metrics.cpu.toFixed(1)} %`
                  : '--'
              }
              sub="Servidor"
            />

            <Indicator
              icon={MemoryStick}
              label="Memoria RAM"
              value={
                backend.metrics
                  ? `${backend.metrics.memory.toFixed(1)} MB`
                  : '--'
              }
              sub="Servidor"
            />

            <Indicator
              icon={DollarSign}
              label="Costo Gemini"
              value={
                backend.metrics
                  ? `$${backend.metrics.api_cost.toFixed(6)}`
                  : '--'
              }
              sub="Última consulta"
            />

            <Indicator
              icon={CalendarDays}
              label="Detecciones hoy"
              value={metrics.detectionsToday.toLocaleString('es-CO')}
              sub="Hoy"
            />

          </div>
        </SectionCard>
      </div>
    </div>
  )
}

function Indicator({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-xl2 border border-slate-100 p-4 dark:border-slate-800">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
        <Icon size={15} />
      </div>
      <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-[11px] text-slate-400">{sub}</p>
    </div>
  )
}
