# Arquitectura

La solución se organiza como monorepo con dos servicios principales:

1. Frontend web: captura video, permite autorización de cámara y muestra resultados.
2. Backend FastAPI: recibe frames, ejecuta detección con YOLOv8, estructura el contexto y consulta Gemini 2.5 Flash.

Los servicios se ejecutan en contenedores Docker y se validan mediante GitHub Actions.
