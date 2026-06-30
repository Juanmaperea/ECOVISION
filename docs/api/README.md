# API

Endpoints iniciales:

- `GET /api/v1/health`: estado del backend.
- `POST /api/v1/detect`: recibe un frame y retorna clase, confianza, contenedor recomendado, explicación y tips.
- `GET /metrics`: métricas Prometheus generadas por el backend.
