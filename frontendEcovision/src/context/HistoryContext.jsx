import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getHistory, getHistoryById } from '../api/history'
import { mapHistoryRecord } from '../utils/mapHistoryRecord'

// -----------------------------------------------------------------------
// Repositorio de historial de detecciones.
//
// El backend (rama develop del repo) SÍ implementa este recurso:
//   GET  /api/v1/history           -> lista completa, más reciente primero
//   GET  /api/v1/history/{id}      -> un registro puntual
//   POST /api/v1/history           -> se usa desde useDetectionLoop justo
//                                      después de una recomendación válida
//
// No existe (todavía) un DELETE /history, así que este contexto no expone
// una función para vaciar el historial: HU-12 queda pendiente del lado del
// backend y la UI lo refleja deshabilitando esa acción en vez de simularla
// con un borrado que solo ocurre en el navegador.
// -----------------------------------------------------------------------

const HistoryContext = createContext(null)

export function HistoryProvider({ children }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cache, setCache] = useState({}) // registros individuales obtenidos por id, con extras en vivo (container, inferenceMs)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    const result = await getHistory()
    if (result.ok) {
      setRecords(result.data.map((item) => mapHistoryRecord(item)))
    } else {
      setError(result.error)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Guarda en memoria los campos que el backend no persiste (container,
  // inferenceMs) para que, si el usuario navega al detalle de una detección
  // recién realizada en la misma sesión, no se pierda esa información.
  const rememberLiveExtras = useCallback((id, extras) => {
    setCache((prev) => ({ ...prev, [id]: extras }))
  }, [])

  const getById = useCallback(
    async (id) => {
      const fromList = records.find((r) => String(r.id) === String(id))
      if (fromList) return { ok: true, data: { ...fromList, ...(cache[id] ?? {}) } }

      const result = await getHistoryById(id)
      if (!result.ok) return result
      return { ok: true, data: mapHistoryRecord(result.data, cache[id] ?? {}) }
    },
    [records, cache],
  )

  const value = useMemo(
    () => ({ records, loading, error, refresh, getById, rememberLiveExtras }),
    [records, loading, error, refresh, getById, rememberLiveExtras],
  )

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
}

export function useHistory() {
  const ctx = useContext(HistoryContext)
  if (!ctx) throw new Error('useHistory debe usarse dentro de HistoryProvider')
  return ctx
}
