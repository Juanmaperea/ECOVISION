import { apiClient, toFriendlyError } from './client'

// Cliente para el módulo de historial (app/modules/history, rama develop).
// Endpoints reales implementados en el backend:
//   POST /api/v1/history              -> crea un registro (HistoryCreate)
//   GET  /api/v1/history              -> lista todos los registros (desc.)
//   GET  /api/v1/history/{history_id} -> obtiene un registro puntual
//
// El flujo de Cámara IA (src/hooks/useDetectionLoop.js) ya NO llama a
// createHistory() directamente: usa POST /analysis, que internamente crea
// el registro de historial del lado del backend (ver
// app/modules/analysis/service.py). createHistory() se deja disponible
// por si se necesita crear un registro manualmente desde algún otro flujo.
//
// IMPORTANTE: no existe (todavía) un endpoint DELETE /history en el
// backend, por lo que HU-12 ("eliminar el historial") no puede
// implementarse de extremo a extremo desde el frontend. La UI lo refleja
// deshabilitando la acción de vaciar historial en lugar de simularla.
//
// IMPORTANTE 2: el esquema HistoryCreate/HistoryResponse no incluye el
// campo "container" (contenedor recomendado); solo se persiste
// detected_object, confidence, recommendation y explanation. Por eso los
// registros que vienen del historial no muestran contenedor recomendado,
// a diferencia de una detección recién realizada en Cámara IA (que sí lo
// conoce porque viene directo de la respuesta de /analysis).

export async function getHistory() {
  try {
    const { data } = await apiClient.get('/history')
    return { ok: true, data }
  } catch (error) {
    return { ok: false, error: toFriendlyError(error) }
  }
}

export async function getHistoryById(id) {
  try {
    const { data } = await apiClient.get(`/history/${id}`)
    return { ok: true, data }
  } catch (error) {
    return { ok: false, error: toFriendlyError(error) }
  }
}

export async function createHistory({ detectedObject, confidence, recommendation, explanation }) {
  try {
    const { data } = await apiClient.post('/history', {
      detected_object: detectedObject,
      confidence,
      recommendation,
      explanation,
    })
    return { ok: true, data }
  } catch (error) {
    return { ok: false, error: toFriendlyError(error) }
  }
}
