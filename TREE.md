# Estructura sugerida

```text
ecovision-ai/
├── .github/workflows/
├── backend/
│   ├── app/
│   │   ├── api/v1/routes/
│   │   ├── core/
│   │   ├── middleware/
│   │   ├── monitoring/
│   │   ├── prompts/
│   │   ├── rules/
│   │   ├── schemas/
│   │   ├── services/
│   │   │   ├── vision/
│   │   │   ├── llm/
│   │   │   └── recommendation/
│   │   └── utils/
│   ├── models/
│   ├── scripts/
│   └── tests/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── tests/
├── infra/
├── data/
├── docs/
├── tests/e2e/
├── docker-compose.yml
└── .env.example
```
