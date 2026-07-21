import { API_BASE_URL } from './client'

async function requestHealth(path) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`)

    if (!response.ok) {
      throw new Error(`El backend respondió ${response.status}`)
    }

    return {
      ok: true,
      data: await response.json(),
      error: null,
    }
  } catch (error) {
    return {
      ok: false,
      data: null,
      error,
    }
  }
}

export function getHealth() {
  return requestHealth('/api/v1/health')
}

export function getDetailedHealth() {
  return requestHealth('/api/v1/health/detailed')
}

