import { apiClient, toFriendlyError } from './client'

export async function getLatestMetrics() {
  try {
    const { data } = await apiClient.get('/metrics/latest')
    return { ok: true, data }
  } catch (error) {
    return { ok: false, error: toFriendlyError(error) }
  }
}