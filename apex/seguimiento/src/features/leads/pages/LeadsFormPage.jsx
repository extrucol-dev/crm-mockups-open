import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LeadForm } from '../components/LeadForm'
import { leadsApi } from '../api'

export default function LeadsFormPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await leadsApi.create(data)
      navigate('/ejecutivo/leads')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Lead</h1>
        <p className="text-sm text-gray-500 mt-0.5">Registra un prospecto y sus intereses comerciales</p>
      </div>
      <LeadForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}