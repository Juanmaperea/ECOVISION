import { getWasteInfo } from './wasteTaxonomy'

// Normaliza un registro proveniente del backend (schemas/history.py:
// HistoryResponse = { id, detected_object, confidence, recommendation,
// explanation, created_at }) hacia la forma que usa la interfaz.
//
// `extra` permite enriquecer el registro con datos que el backend no
// persiste en el historial (ver schemas/history.py), como el contenedor
// recomendado o el tiempo de respuesta. GET /history nunca los trae, así
// que por defecto quedan en null y la UI lo muestra honestamente en vez
// de inventar un valor.
export function mapHistoryRecord(apiRecord, extra = {}) {
  const wasteInfo = getWasteInfo(apiRecord.detected_object)

  return {
    id: apiRecord.id,
    detectedObject: apiRecord.detected_object,
    label: wasteInfo.label,
    category: wasteInfo.category,
    material: wasteInfo.material,
    recyclability: wasteInfo.recyclability,
    confidence: apiRecord.confidence,
    explanation: apiRecord.explanation,
    recommendation: apiRecord.recommendation,
    createdAt: apiRecord.created_at,
    // No persistidos por el backend actual (ver schemas/history.py):
    container: extra.container ?? null,
    inferenceMs: extra.inferenceMs ?? null,
  }
}
