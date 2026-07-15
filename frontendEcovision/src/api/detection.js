import { apiClient, toFriendlyError } from './client'

// POST /visual-processing/detect (multipart/form-data, campo "image")
// -> { detected_object, confidence }
export async function detectFrame(blob) {
  try {
    const formData = new FormData()
    formData.append('image', blob, 'frame.jpg')

    const start = performance.now()
    const { data } = await apiClient.post('/visual-processing/detect', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    const elapsedMs = performance.now() - start

    return { ok: true, data, elapsedMs }
  } catch (error) {
    return { ok: false, error: toFriendlyError(error) }
  }
}
