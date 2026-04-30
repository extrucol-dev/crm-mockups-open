import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OportunidadForm } from '../components/OportunidadForm'
import { oportunidadesApi } from '../api'

export default function OportunidadesFormPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await oportunidadesApi.create(data)
      navigate('/ejecutivo/oportunidades')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nueva oportunidad</h1>
        <p className="text-sm text-gray-500 mt-0.5">Completa los datos para crear una nueva oportunidad comercial</p>
      </div>
      <OportunidadForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}