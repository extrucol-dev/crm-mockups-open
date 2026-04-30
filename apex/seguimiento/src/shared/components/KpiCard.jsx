import Icon from './Icons'

export function KpiCard({ label, value, hint, icon, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-card p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white rounded-lg shadow-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
        {icon && (
          <div className="p-2 bg-primary/10 rounded-md">
            <Icon name={icon} size={20} className="text-primary" />
          </div>
        )}
      </div>
    </div>
  )
}