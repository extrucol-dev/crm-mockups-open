import { useState, useEffect } from 'react'
import { oportunidadesApi } from '../api'

export function useOportunidadDetalle(id) {
  const [opp, setOpp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    setLoading(true)
    Promise.all([
      oportunidadesApi.get(id),
    ])
      .then(([data]) => {
        setOpp(data)
        setError(null)
      })
      .catch(e => {
        if (!controller.signal.aborted) setError(e.message)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [id])

  return { opp, loading, error }
}