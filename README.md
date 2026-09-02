# ZARO GROUP

Plataforma empresarial de **Innovación, gestión y crecimiento**.

Monorepo con arquitectura de microservicios en contenedores:

```
┌────────────────────────────────────────────────────────────┐
│                         nginx                              │
│      (proxy reverso, TLS, seguridad, compresión)           │
└───────────────┬────────────────────────────┬───────────────┘
        ┌───────┴───────┐            ┌───────┴────────┐
        │  frontend-web │            │  backend (Go) │
        │  React·Vite   │───────────▶│  Clean Arch.  │
        │  Tailwind     │   REST      └──┬───────┬────┘
        │  IndexedDB    │   JWT/refresh   │       │
        │  (offline)    │                 │       │
        └────────────────                  │       │
                                   ┌───────┴───┐  ┌──┴────────┐
                                   │  MySQL    │  │  Redis    │
                                   │  (8.0)    │  │  (cache)  │
                                   └───────────┘  └───────────┘
```

- **Backend**: Go 1.22, Clean Architecture, REST API con JWT (24h) + refresh (7d), bcrypt cost 12, AES-256, rate limiting (100 req/min), circuit breaker.
- **Frontend Web**: React 18 + TypeScript + Vite + Tailwind, offline-first con IndexedDB y cola de sincronización con backoff exponencial.
- **App Móvil**: React Native + Expo, SQLite offline, sincronización con resolución de conflictos *last-writer-wins*.
- **Infra**: Docker Compose (dev/prod), Nginx, MySQL 8, Redis, GitHub Actions CI/CD.

## Estructura

```
.
├── backend/          # API Go (Clean Architecture)
├── frontend-web/     # Aplicación web React
├── mobile/           # App móvil Expo/React Native
├── mysql/            # Configuración de base de datos
├── nginx/            # Proxy reverso y seguridad
├── redis/            # Configuración de caché
├── scripts/          # Despliegue y monitoreo
├── api-docs/         # Especificación OpenAPI
└── .github/          # CI/CD (GitHub Actions)
```

## Inicio rápido (desarrollo)

```bash
# 1. Configurar variables de entorno
cp .env.example .env.local

# 2. Levantar el stack completo
docker compose up -d --build

# Frontend:     http://localhost:3000
# Backend API:  http://localhost:8080
# Base de datos: localhost:3306
```

O usar el script de ayuda:

```bash
./scripts/development/dev.sh up
```

## Producción

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `scripts/deploy/backend.sh` | Despliegue/rollback del backend |
| `scripts/deploy/web.sh` | Despliegue/rollback del frontend |
| `scripts/monitoring/status.sh` | Estado de la infraestructura |
| `scripts/monitoring/backup.sh` | Backup automático de MySQL |
| `scripts/monitoring/healthcheck.sh` | Healthcheck del API |
| `scripts/development/dev.sh` | Entorno de desarrollo |

## CI/CD (GitHub Actions)

- **backend.yml**: lint (vet + staticcheck), tests unitarios/e2e, build, escaneo de vulnerabilidades (Trivy), deploy.
- **web.yml**: lint, typecheck, tests, build, deploy.
- **mobile.yml**: typecheck, lint, build iOS/Android con EAS.
- **security.yml**: escaneo de dependencias (govulncheck, npm audit), CodeQL, escaneo de imágenes Docker.

## Licencia

© ZARO GROUP. Todos los derechos reservados.
