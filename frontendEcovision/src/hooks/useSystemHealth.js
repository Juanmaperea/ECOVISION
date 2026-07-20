import { useCallback, useEffect, useState } from 'react'
import { getHealth } from '../api/health'

const POLL_INTERVAL_MS = 30000

// Consulta periódica de GET /health (implementado en el backend) y, de forma
// oportunista, GET /health/detailed (no implementado aún). Ver comentario en
// src/api/health.js sobre por qué el segundo endpoint se trata como opcional.
export function useSystemHealth({ poll = true } = {}) {
  const [state, setState] = useState({
    loading: true,
    reachable: false,
    data: null,
    detailed: null,
    detailedAvailable: false,
    lastCheckedAt: null,
    error: null,
  })

  const check = useCallback(async () => {
    const result = await getHealth()

    setState({
      loading: false,
      reachable: result.ok,
      data: result.ok ? result.data : null,
      detailed: null,
      detailedAvailable: false,
      lastCheckedAt: new Date().toISOString(),
      error: result.ok ? null : result.error,
    })
  }, [])

  useEffect(() => {
    check()
    if (!poll) return undefined
    const id = setInterval(check, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [check, poll])

  return { ...state, refresh: check }
}
