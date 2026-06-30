# EcoVision AI

Monorepo para el agente visual inteligente de clasificación responsable de residuos.

## Componentes principales

- `frontend/`: aplicación web que captura video desde el navegador, muestra detecciones, confianza, recomendaciones e historial.
- `backend/`: API FastAPI que orquesta visión, reglas de clasificación y razonamiento con LLM.
- `backend/app/services/vision/`: integración con YOLOv8 para detección de residuos.
- `backend/app/services/llm/`: cliente de Gemini 2.5 Flash y prompts controlados.
- `infra/`: configuración de Docker, despliegue cloud, reverse proxy y scripts.
- `.github/workflows/`: CI/CD, pruebas y despliegue automatizado.
- `docs/`: arquitectura, decisiones técnicas, API, pruebas, despliegue e IA responsable.

## Alcance técnico

El proyecto se limita a residuos comunes reconocibles por modelos preentrenados de visión computacional. No se almacenan imágenes de cámara en producción y no se entrena un modelo personalizado dentro de esta primera versión.

## Ejecución local sugerida

```bash
cp .env.example .env
docker compose up --build
```

Frontend: http://localhost:5173  
Backend: http://localhost:8000/docs
