import { useState, useEffect } from 'react'
import { leadsApi } from '../api'

export function useLeadDetalle(id) {
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    leadsApi.get(id)
      .then(data => {
        setLead(data)
        setError(null)
      })
      .catch(e => {
        if (!controller.signal.aborted) setError(e.message)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [id])

  return { lead, loading, error }
}