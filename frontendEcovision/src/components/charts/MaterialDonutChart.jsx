import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { EmptyState } from '../common/States.jsx'

export default function MaterialDonutChart({ data, height = 240 }) {
  const total = data?.reduce((sum, d) => sum + d.value, 0) ?? 0

  if (!total) {
    return <EmptyState title="Aún no hay detecciones" message="La distribución aparecerá cuando existan registros." />
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <ResponsiveContainer width="100%" height={height} className="max-w-[220px]">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="85%" paddingAngle={2}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e2e8f0' }} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {data.map((entry) => (
          <li key={entry.name} className="flex items-center justify-between gap-2 text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              {total ? Math.round((entry.value / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
