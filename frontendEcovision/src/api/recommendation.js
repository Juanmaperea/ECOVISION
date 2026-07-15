import { apiClient, toFriendlyError } from './client'

// POST /recommendation { detected_object, confidence }
// -> { detected_object, confidence, container, explanation, recommendation }
export async function getRecommendation({ detectedObject, confidence }) {
  try {
    const { data } = await apiClient.post('/recommendation', {
      detected_object: detectedObject,
      confidence,
    })
    return { ok: true, data }
  } catch (error) {
    return { ok: false, error: toFriendlyError(error) }
  }
}
