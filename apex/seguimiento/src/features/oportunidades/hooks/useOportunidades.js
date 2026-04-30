import { useState, useEffect } from 'react'
import { oportunidadesApi } from '../api'
import { COLUMNAS_KANBAN } from '../mocks'

export function useOportunidades() {
  const [oportunidades, setOportunidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const data = await oportunidadesApi.list()
      setOportunidades(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const byEstado = COLUMNAS_KANBAN.reduce((acc, col) => {
    acc[col.id] = oportunidades.filter(o => o.id_estado_oportunidad === col.id)
    return acc
  }, {})

  const moverOportunidad = async (id, id_estado_oportunidad) => {
    if (id_estado_oportunidad === 'GANADA' || id_estado_oportunidad === 'PERDIDA') return
    setOportunidades(prev => prev.map(o => o.id_oportunidad === id ? { ...o, id_estado_oportunidad } : o))
    await oportunidadesApi.update(id, { id_estado_oportunidad })
  }

  const createOportunidad = async (data) => {
    await oportunidadesApi.create(data)
    await load()
  }

  const totalPipeline = oportunidades
    .filter(o => !['GANADA', 'PERDIDA'].includes(o.id_estado_oportunidad))
    .reduce((sum, o) => sum + (o.valor || 0), 0)

  return { oportunidades, byEstado, loading, error, moverOportunidad, createOportunidad, reload: load, totalPipeline }
}