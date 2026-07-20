import { useEffect, useState } from 'react'
import { getLatestMetrics } from '../api/metrics'

export function useBackendMetrics() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadMetrics() {
        const result = await getLatestMetrics()

        if (result.ok) {
        setMetrics(result.data)
        setError(null)
        } else {
        setError(result.error)
        }

        setLoading(false)
    }

    // Primera carga
    loadMetrics()

    // Actualizar cada 3 segundos
    const id = setInterval(loadMetrics, 3000)

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(id)
    }, [])

  return {
    metrics,
    loading,
    error,
  }
}