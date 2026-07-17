import { apiClient, toFriendlyError } from './client'

// POST /analysis (multipart/form-data, campo "image")
// -> { detected_object, confidence, is_valid_detection, container, explanation, recommendation }
//
// Este endpoint hace, en una sola llamada del lado del backend
// (app/modules/analysis/service.py): detección YOLOv8 + filtro de
// confianza/clase reconocida + recomendación Gemini + guardado en el
// historial (POST /history internamente) — solo cuando la detección es
// válida. El campo `is_valid_detection` indica si la detección pasó ese
// filtro; cuando es false, `container`/`explanation`/`recommendation`
// vienen en null y no se llamó a Gemini ni se guardó nada. Por eso
// AnalysisResponse NO trae "id" ni "created_at": cuando sí hubo guardado,
// ese registro ya quedó persistido en la base de datos, pero su
// identificador no se devuelve en la respuesta. Para ver el registro con
// su id real hay que refrescar el historial (GET /history) después de una
// llamada exitosa.
export async function analyzeFrame(blob) {
  try {
    const formData = new FormData()
    formData.append('image', blob, 'frame.jpg')

    const start = performance.now()
    const { data } = await apiClient.post('/analysis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    const elapsedMs = performance.now() - start

    return { ok: true, data, elapsedMs }
  } catch (error) {
    return { ok: false, error: toFriendlyError(error) }
  }
}
