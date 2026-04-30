import { useParams, useNavigate } from 'react-router-dom'
import { useLeadDetalle } from '../hooks/useLeadDetalle'
import { LeadDetalle } from '../components/LeadDetalle'
import { leadsApi } from '../api'

export default function LeadsDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lead, loading, error } = useLeadDetalle(id)

  const handleActualizar = async (data) => {
    await leadsApi.update(id, data)
  }

  if (loading) return <div className="text-center text-gray-400 py-16">Cargando...</div>
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>
  if (!lead) return <div className="text-center text-gray-400 py-8">Lead no encontrado</div>

  return <LeadDetalle lead={lead} onActualizar={handleActualizar} />
}