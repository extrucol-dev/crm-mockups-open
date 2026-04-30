import { useOportunidades } from '../hooks/useOportunidades'
import { OportunidadesKanban } from '../components/OportunidadesKanban'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/shared/components'
import { fmtCompact } from '@/shared/utils/format'

export default function OportunidadesKanbanPage() {
  const { oportunidades, byEstado, loading, error, moverOportunidad, reload, totalPipeline } = useOportunidades()
  const navigate = useNavigate()

  const total = oportunidades.length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Oportunidades</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {total} oportunidades · {fmtCompact(totalPipeline)} en pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
            <Icon name="filter" size={16} /> Filtros
          </button>
          <button
            onClick={() => navigate('/ejecutivo/oportunidades/nuevo')}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
          >
            <Icon name="plus" size={16} /> Nueva oportunidad
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex-1 max-w-xs">
          <div className="relative">
            <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="Buscar por título, empresa..." />
          </div>
        </div>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white">
          <option>Todos los sectores</option>
          <option>Agua potable</option><option>Gas natural</option><option>Agro/Riego</option><option>Industrial</option>
        </select>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white">
          <option>Todos los tipos</option>
          <option>Licitación</option><option>Suministro</option><option>Proyecto</option>
        </select>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 py-16">Cargando...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <OportunidadesKanban oportunidades={oportunidades} onMover={moverOportunidad} />
      )}
    </div>
  )
}