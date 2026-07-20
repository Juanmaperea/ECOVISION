import { apiClient, toFriendlyError } from './client'

// GET /health -> { status, application, version }
// Este endpoint SÍ está implementado en el backend actual.
export async function getHealth() {
  try {
    const { data } = await apiClient.get('/health')
    return { ok: true, data }
  } catch (error) {
    return { ok: false, error: toFriendlyError(error) }
  }
}

