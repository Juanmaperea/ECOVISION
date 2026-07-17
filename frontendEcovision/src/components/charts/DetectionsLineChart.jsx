import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { EmptyState } from '../common/States.jsx'

export default function DetectionsLineChart({ data, height = 260 }) {
  if (!data?.length || data.every((d) => d.value === 0)) {
    return <EmptyState title="Sin actividad reciente" message="La tendencia diaria aparecerá con el uso de la Cámara IA." />
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="detectionsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22a06c" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#22a06c" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
        <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-500" />
        <YAxis tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-500" allowDecimals={false} />
        <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e2e8f0' }} />
        <Area type="monotone" dataKey="value" stroke="#178055" strokeWidth={2} fill="url(#detectionsFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
