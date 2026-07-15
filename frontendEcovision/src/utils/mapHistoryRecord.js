import { getWasteInfo } from './wasteTaxonomy'

// Normaliza un registro proveniente del backend (schemas/history.py:
// HistoryResponse = { id, detected_object, confidence, recommendation,
// explanation, created_at }) hacia la forma que usa la interfaz.
//
// `extra` permite enriquecer el registro con datos que SOLO existen en el
// momento de una detección en vivo (Cámara IA) y que el backend no
// persiste todavía en el historial, como el contenedor recomendado
// (RecommendationResponse.container) o el tiempo de respuesta medido en
// el cliente. Al leer el historial desde GET /history esos campos no
// estarán disponibles y la UI debe mostrarlo honestamente en vez de
// inventar un valor.
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
