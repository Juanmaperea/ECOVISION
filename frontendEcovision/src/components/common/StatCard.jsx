export default function StatCard({ icon: Icon, iconClassName, label, value, trend, trendLabel }) {
  return (
    <div className="card flex flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconClassName ?? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300'}`}>
          <Icon size={18} />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        {trend !== undefined && trend !== null && (
          <p className={`mt-0.5 text-xs font-medium ${trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}% {trendLabel}
          </p>
        )}
      </div>
    </div>
  )
}
