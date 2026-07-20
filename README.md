# EcoVision

Sistema inteligente para la clasificación de residuos utilizando Visión por Computador e Inteligencia Artificial.

## Tecnologías

- FastAPI
- PostgreSQL
- SQLAlchemy
- OpenCV
- YOLOv8
- Gemini 2.5 Flash
- Docker
- GitHub Actions
- Pytest

## Estructura

```
backend/
frontend/
docker-compose.yml
```

## Backend

Entrar al backend

```bash
cd backend
```

Instalar dependencias

```bash
pip install -r requirements.txt
```

Ejecutar

```bash
uvicorn app.main:app --reload
```

Swagger

```
http://localhost:8000/docs
```

## Docker

```bash
docker compose up --build
```

## Tests

```bash
pytest
```

## Licencia

Proyecto académico.