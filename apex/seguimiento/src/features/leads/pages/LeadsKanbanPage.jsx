import { useLeads } from '../hooks/useLeads'
import { LeadsKanban } from '../components/LeadsKanban'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/shared/components'

export default function LeadsKanbanPage() {
  const { leads, byEstado, loading, error, moverLead, reload, estancadosCount } = useLeads()
  const navigate = useNavigate()

  const total = leads.length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Leads</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {total} leads en seguimiento{estancadosCount > 0 ? ` · ${estancadosCount} sin contactar hace +2 días` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
            <Icon name="filter" size={16} /> Filtros
          </button>
          <button
            onClick={() => navigate('/ejecutivo/leads/nuevo')}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
          >
            <Icon name="plus" size={16} /> Nuevo lead
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex-1 max-w-xs">
          <div className="relative">
            <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Buscar por título, empresa, origen..."
            />
          </div>
        </div>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white">
          <option>Todos los orígenes</option>
          <option>WhatsApp</option>
          <option>Email</option>
          <option>Instagram</option>
          <option>Facebook</option>
        </select>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white">
          <option>Todos los intereses</option>
          <option>Tubería PE</option>
          <option>Accesorios</option>
        </select>
      </div>

      {estancadosCount > 0 && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
          <Icon name="warning" size={18} className="text-yellow-600" />
          <div>
            <strong>{estancadosCount} lead estancado.</strong>
            <span className="text-gray-600"> GAMO INGENIEROS SAS sin contactar hace 1 día.</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 py-16">Cargando...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <LeadsKanban leads={leads} onMover={moverLead} />
      )}
    </div>
  )
}