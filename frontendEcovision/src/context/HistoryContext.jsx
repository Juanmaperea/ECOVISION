import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getHistory, getHistoryById } from '../api/history'
import { mapHistoryRecord } from '../utils/mapHistoryRecord'

// -----------------------------------------------------------------------
// Repositorio de historial de detecciones.
//
// El backend (rama develop del repo) SÍ implementa este recurso:
//   GET  /api/v1/history           -> lista completa, más reciente primero
//   GET  /api/v1/history/{id}      -> un registro puntual
//
// Los registros se crean en el backend a través de POST /analysis (ver
// app/modules/analysis/service.py), que guarda internamente en /history
// como parte de su flujo. Por eso este contexto no expone una función
// "addDetection": basta con llamar refresh() después de un análisis
// exitoso en Cámara IA para que la lista se actualice desde el backend.
//
// No existe (todavía) un DELETE /history, así que este contexto tampoco
// expone una función para vaciar el historial: HU-12 queda pendiente del
// lado del backend y la UI lo refleja deshabilitando esa acción en vez de
// simularla con un borrado que solo ocurriría en el navegador.
// -----------------------------------------------------------------------

const HistoryContext = createContext(null)

export function HistoryProvider({ children }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const getById = useCallback(
    async (id) => {
      const fromList = records.find((r) => String(r.id) === String(id))
      if (fromList) return { ok: true, data: fromList }

      const result = await getHistoryById(id)
      if (!result.ok) return result
      return { ok: true, data: mapHistoryRecord(result.data) }
    },
    [records],
  )

  const value = useMemo(
    () => ({ records, loading, error, refresh, getById }),
    [records, loading, error, refresh, getById],
  )

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
}

export function useHistory() {
  const ctx = useContext(HistoryContext)
  if (!ctx) throw new Error('useHistory debe usarse dentro de HistoryProvider')
  return ctx
}
