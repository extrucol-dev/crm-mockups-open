import { useParams, useNavigate } from 'react-router-dom'
import { useOportunidadDetalle } from '../hooks/useOportunidadDetalle'
import { OportunidadDetalle } from '../components/OportunidadDetalle'
import { oportunidadesApi } from '../api'

export default function OportunidadesDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { opp, loading, error } = useOportunidadDetalle(id)

  const handleActualizar = async (data) => {
    await oportunidadesApi.update(id, data)
  }

  if (loading) return <div className="text-center text-gray-400 py-16">Cargando...</div>
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>
  if (!opp) return <div className="text-center text-gray-400 py-8">Oportunidad no encontrada</div>

  return <OportunidadDetalle opp={opp} onActualizar={handleActualizar} />
}