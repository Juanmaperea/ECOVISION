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

// GET /health/detailed -> estado individual de BD, YOLOv8 y Gemini.
// Endpoint propuesto pero AÚN NO implementado en el backend: en la rama
// develop el módulo "metrics" solo tiene un util interno (Timer) y no se
// registra ningún router de métricas en app/main.py. Se deja la llamada
// lista para integrarse sin cambios en la UI: si el backend responde 404,
// la pantalla de Estado del Sistema simplemente muestra estas tarjetas
// como "Pendiente".
export async function getDetailedHealth() {
  try {
    const { data } = await apiClient.get('/health/detailed')
    return { ok: true, data }
  } catch (error) {
    return { ok: false, error: toFriendlyError(error) }
  }
}
