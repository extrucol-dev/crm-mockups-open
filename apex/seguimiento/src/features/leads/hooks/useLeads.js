import { useState, useEffect } from 'react'
import { leadsApi } from '../api'
import { COLUMNAS_KANBAN } from '../mocks'

export function useLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const data = await leadsApi.list()
      setLeads(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const byEstado = COLUMNAS_KANBAN.reduce((acc, col) => {
    acc[col.id] = leads.filter(l => l.id_estado_lead === col.id)
    return acc
  }, {})

  const createLead = async (data) => {
    await leadsApi.create(data)
    await load()
  }

  const moverLead = async (id, id_estado_lead) => {
    setLeads(prev => prev.map(l => l.id_lead === id ? { ...l, id_estado_lead } : l))
    await leadsApi.update(id, { id_estado_lead })
  }

  const estancadosCount = leads.filter(l => l.id_estado_lead === 'NUEVO' && l.age === '1d').length

  return { leads, byEstado, loading, error, createLead, moverLead, reload: load, estancadosCount }
}