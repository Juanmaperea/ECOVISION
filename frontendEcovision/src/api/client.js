import axios from 'axios'

// URL base del backend FastAPI (sin prefijo de versión). Configurable
// mediante variable de entorno VITE_API_URL (ver .env.example). Por defecto
// apunta al backend local.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Todos los routers del backend se registran en app/main.py bajo el prefijo
// "/api/v1" (rama develop del repo), p. ej. app.include_router(health_router,
// prefix="/api/v1"). Por eso el cliente HTTP usa esa base y el resto del
// código solo referencia rutas relativas como "/health" o "/history".
export const API_V1_URL = `${API_BASE_URL}/api/v1`

export const apiClient = axios.create({
  baseURL: API_V1_URL,
  timeout: 10000,
})

// Normaliza errores de red/HTTP en un formato consistente para la UI,
// cumpliendo con HU-18 (gestionar errores durante la ejecución) sin
// exponer detalles técnicos sensibles al usuario final.
export function toFriendlyError(error) {
  if (error.code === 'ECONNABORTED') {
    return { message: 'El servidor tardó demasiado en responder. Intenta nuevamente.', cause: 'timeout' }
  }
  if (error.response) {
    const status = error.response.status
    if (status === 404) return { message: 'El servicio solicitado no está disponible todavía.', cause: 'not_found' }
    if (status >= 500) return { message: 'El servidor presentó un error interno. Intenta nuevamente en unos segundos.', cause: 'server_error' }
    return { message: 'La solicitud no pudo completarse.', cause: 'bad_request' }
  }
  if (error.request) {
    return { message: 'No fue posible conectar con el backend. Verifica que el servicio esté activo.', cause: 'network' }
  }
  return { message: 'Ocurrió un error inesperado.', cause: 'unknown' }
}
