import { useCallback, useEffect, useState } from 'react'
import { getHealth, getDetailedHealth } from '../api/health'

const POLL_INTERVAL_MS = 30000

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
    try {
      const healthResult = await getHealth()

      let detailedResult = {
        ok: false,
        data: null,
      }

      try {
        detailedResult = await getDetailedHealth()
      } catch {
        // El endpoint detallado es opcional y no debe tumbar la aplicación.
      }

      setState({
        loading: false,
        reachable: healthResult.ok,
        data: healthResult.ok ? healthResult.data : null,
        detailed: detailedResult.ok ? detailedResult.data : null,
        detailedAvailable: detailedResult.ok,
        lastCheckedAt: new Date().toISOString(),
        error: healthResult.ok ? null : healthResult.error,
      })
    } catch (error) {
      setState({
        loading: false,
        reachable: false,
        data: null,
        detailed: null,
        detailedAvailable: false,
        lastCheckedAt: new Date().toISOString(),
        error,
      })
    }
  }, [])

  useEffect(() => {
    check()

    if (!poll) return undefined

    const id = setInterval(check, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [check, poll])

  return {
    ...state,
    refresh: check,
  }
}