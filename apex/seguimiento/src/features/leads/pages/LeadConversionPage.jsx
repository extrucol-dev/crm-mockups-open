import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { LeadConversion } from '../components/LeadConversion'
import { useLeadDetalle } from '../hooks/useLeadDetalle'
import { leadsApi } from '../api'

export default function LeadConversionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lead, loading } = useLeadDetalle(id)

  const handleConvert = async (data) => {
    await leadsApi.convertir(Number(id), data)
    navigate('/ejecutivo/oportunidades')
  }

  if (loading) return <div className="text-center text-gray-400 py-16">Cargando...</div>

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Convertir a oportunidad</h1>
        <p className="text-sm text-gray-500 mt-0.5">Crea una oportunidad comercial desde este lead</p>
      </div>
      {lead && <LeadConversion lead={lead} onConvert={handleConvert} />}
    </div>
  )
}