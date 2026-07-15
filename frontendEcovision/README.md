# EcoVision — Frontend

Frontend en React + Vite para **EcoVision**, agente visual inteligente para la clasificación responsable de residuos
(Proyecto Integrador II, Universidad del Valle). Esta aplicación cubre las historias de usuario de frontend definidas
en el Product Backlog: Épica 1 (Gestión de Captura de Video), Épica 5 (Interfaz de Usuario) y el consumo de las Épicas
2/3/4 expuestas por el backend (detección, recomendaciones y historial).

> Nota de integración: el backend de este proyecto vive en un monorepo con varias ramas de Git. La rama
> `feature/frontendBase` (donde históricamente vivía este frontend) tiene un backend incompleto (`main.py` vacío,
> módulos `history`/`metrics` sin implementar). El contrato real y completo del backend está en la rama **`develop`**
> (routers de `health`, `history`, `visual_processing`, `recommendation` y `analysis`, todos registrados bajo el
> prefijo `/api/v1`, con pruebas automatizadas). Este frontend fue integrado contra ese contrato de `develop`.

## Requisitos

- Node.js 18+
- El backend de EcoVision corriendo (rama `develop`), por defecto en `http://localhost:8000`

## Instalación

```bash
npm install
cp .env.example .env   # ajusta VITE_API_URL si el backend corre en otra URL/puerto
npm run dev
```

Abre `http://localhost:5173`.

## Scripts

- `npm run dev` — servidor de desarrollo con recarga en caliente.
- `npm run build` — build de producción en `dist/`.
- `npm run preview` — sirve el build de producción localmente.
- `npm run lint` — ESLint sobre todo el proyecto.

## Estructura

```
src/
  api/            Clientes HTTP hacia el backend (health, history, detección, recomendación)
  components/
    layout/       Sidebar, Topbar, AppLayout (shell de la aplicación)
    charts/       Gráficos reutilizables (recharts)
    common/       Badges, estados de carga/error/vacío, tarjetas, diálogos
  context/        ThemeContext (modo oscuro) e HistoryContext (historial contra el backend real)
  hooks/          useCameraCapture, useDetectionLoop, useMetrics, useSystemHealth
  pages/          Dashboard, CameraAI, History, HistoryDetail, Statistics, SystemStatus, About
  utils/          Formateo de fechas/números, taxonomía de residuos y mapeo de registros de historial
```

## Integración con el backend (rama `develop`)

Todas las rutas del backend se registran en `app/main.py` bajo el prefijo `/api/v1` (por eso `src/api/client.js`
arma el `baseURL` como `${VITE_API_URL}/api/v1`). Endpoints consumidos por este frontend:

- `GET /api/v1/health` → `{ status, application, version }`
- `POST /api/v1/visual-processing/detect` (multipart, campo `image`) → `{ detected_object, confidence }`
- `POST /api/v1/recommendation` (`{ detected_object, confidence }`) → `{ detected_object, confidence, container, explanation, recommendation }`
- `POST /api/v1/history` (`{ detected_object, confidence, recommendation, explanation }`) → registro creado (`id`, `created_at`, …)
- `GET /api/v1/history` → lista completa, más reciente primero
- `GET /api/v1/history/{id}` → un registro puntual

El backend también expone `POST /api/v1/analysis`, que hace detección + recomendación + guardado en una sola llamada
(`app/modules/analysis/service.py`). **Este frontend NO lo usa**: ese endpoint no aplica ningún umbral de confianza
antes de consultar a Gemini y guardar en base de datos (incluso una detección "Unknown" se persistiría). En su lugar,
`src/hooks/useDetectionLoop.js` orquesta los tres pasos por separado (`detect` → `recommendation` → `history`) y solo
avanza al segundo y tercer paso cuando la confianza supera `CONFIDENCE_THRESHOLD` (0.4), cumpliendo con lo que piden
HU-06 ("solo se envían al módulo de razonamiento las detecciones válidas") y HU-10 ("solo se almacenan clasificaciones
válidas").

### Brechas conocidas del backend (no se tocan desde este repo)

- **CORS**: `app/main.py` (rama `develop`) no registra `CORSMiddleware`. Sin esto, el navegador bloqueará las
  peticiones desde `http://localhost:5173` hacia `http://localhost:8000`. Hay que agregarlo en el backend para que la
  integración funcione fuera de Swagger/Postman.
- **Sin `DELETE /history`**: el router de historial solo expone `POST`, `GET` (lista) y `GET /{id}`. HU-12 ("eliminar
  el historial") no se puede completar desde el frontend todavía; la pantalla de Historial lo refleja mostrando esa
  acción como "pendiente en backend" en vez de simular un borrado que solo ocurriría en el navegador.
- **`container` no se persiste**: `schemas/history.py` (`HistoryCreate`/`HistoryResponse`) solo guarda
  `detected_object`, `confidence`, `recommendation` y `explanation`. El contenedor recomendado sí se conoce en el
  momento de una detección en vivo (viene de `/recommendation`), pero se pierde al recargar el historial desde
  `GET /history`. La pantalla de detalle lo indica explícitamente en vez de mostrar un dato inventado.
- **Sin métricas expuestas**: `app/modules/metrics` solo tiene un `Timer` interno; no hay router registrado en
  `main.py`. `src/api/health.js` deja lista (y documentada) la llamada a un futuro `GET /health/detailed` para que la
  pantalla "Estado del sistema" muestre YOLOv8/Gemini/BD sin inventar datos mientras tanto.

## Docker

Este repo incluye su propio `Dockerfile` (build multi-stage: Node para compilar, nginx para servir) y un
`nginx.conf` con fallback de rutas para React Router.

```bash
docker build -t ecovision-frontend --build-arg VITE_API_URL=http://localhost:8000 .
docker run -p 8080:80 ecovision-frontend
```

Abre `http://localhost:8080`.

El `docker-compose.yml` de la raíz del monorepo (rama `develop`) hoy solo define `postgres` y `backend`; no incluye
un servicio de frontend. Si quieren levantar todo junto, un service block como este se puede agregar a ese
`docker-compose.yml` (no se modifica desde aquí porque no es parte de este repo del frontend):

```yaml
  frontend:
    build:
      context: ./frontendEcovision
      args:
        VITE_API_URL: http://localhost:8000
    container_name: ecovision_frontend
    depends_on:
      - backend
    ports:
      - "8080:80"
```

## Notas de producto

- **Privacidad de imágenes**: siguiendo el análisis de riesgos del documento inicial del proyecto, la aplicación no
  almacena las imágenes capturadas por la cámara; solo conserva la información estructurada de cada detección.
- **Taxonomía de residuos**: el modelo YOLOv8 preentrenado (clases COCO) no incluye todavía clases específicas como
  "lata de aluminio" o "caja de cartón". `src/utils/wasteTaxonomy.js` centraliza el mapeo de clases crudas a categorías
  de reciclaje en español y puede extenderse sin tocar el resto de la aplicación cuando el backend incorpore un modelo
  con clases propias.
