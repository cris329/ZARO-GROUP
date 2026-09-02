SHELL := /bin/bash

.DEFAULT_GOAL := help

help:
	@echo "ZARO GROUP - Innovación, gestión y crecimiento"
	@echo ""
	@echo "Uso: make [comando]"
	@echo ""
	@echo "Desarrollo:"
	@echo "  dev            Levanta todos los contenedores de desarrollo"
	@echo "  backend        Levanta solo el backend"
	@echo "  web            Levanta solo el frontend web"
	@echo "  mobile         Levanta el entorno de build mobile"
	@echo "  mysql-only     Levanta solo MySQL"
	@echo ""
	@echo "Build:"
	@echo "  build          Compila el backend y construye imágenes"
	@echo "  build-backend  Compila el backend Go"
	@echo "  build-web      Construye el frontend web"
	@echo "  build-mobile   Compila la app móvil (APK/IPA)"
	@echo ""
	@echo "Testing:"
	@echo "  test           Ejecuta todas las pruebas"
	@echo "  test-backend   Ejecuta pruebas del backend"
	@echo "  test-web       Ejecuta pruebas del frontend web"
	@echo "  test-mobile    Ejecuta pruebas del mobile"
	@echo ""
	@echo "Producción:"
	@echo "  up             Levanta producción"
	@echo "  down           Detiene todos los contenedores"
	@echo "  deploy         Despliega a producción"
	@echo "  rollback       Revierte el último despliegue"
	@echo ""
	@echo "Monitoreo:"
	@echo "  logs           Muestra logs de todos los servicios"
	@echo "  health         Verifica estado de todos los servicios"
	@echo "  metrics        Muestra métricas de los servicios"
	@echo "  backup         Ejecuta backup de MySQL"
	@echo "  restore        Restaura MySQL"
	@echo ""
	@echo "Seguridad:"
	@echo "  scan           Escanea vulnerabilidades de la API"
	@echo "  audit          Ejecuta auditoría de seguridad"
	@echo ""
	@echo "Utilidades:"
	@echo "  clean          Limpia artefactos de build"
	@echo "  seed           Carga datos de prueba"

# ===== Desarrollo =====
dev:
	docker compose -f docker-compose.yml up --build

backend:
	docker compose -f docker-compose.yml up --build backend

web:
	docker compose -f docker-compose.yml up --build frontend-web

mobile:
	docker compose -f docker-compose.yml up --build mobile-build

mysql-only:
	docker compose -f docker-compose.yml up -d mysql

# ===== Build =====
build:
	cd backend && CGO_ENABLED=0 GOOS=linux go build -o bin/api ./cmd/api
	docker compose -f docker-compose.prod.yml build

build-backend:
	cd backend && CGO_ENABLED=0 GOOS=linux go build -o bin/api ./cmd/api

build-web:
	cd frontend-web && npm run build

build-mobile:
	docker compose -f docker-compose.prod.yml run --rm mobile-build npx eas build

# ===== Testing =====
test: test-backend test-web test-mobile

test-backend:
	cd backend && go test ./... -cover

test-web:
	cd frontend-web && npm run test

test-mobile:
	cd mobile && npm run test

# ===== Producción =====
up:
	docker compose -f docker-compose.prod.yml up -d

down:
	docker compose -f docker-compose.yml down -v

deploy:
	./scripts/deploy/backend.sh && ./scripts/deploy/web.sh

rollback:
	./scripts/deploy/backend.sh rollback && ./scripts/deploy/web.sh rollback

# ===== Monitoreo =====
logs:
	docker compose -f docker-compose.yml logs -f

health:
	./scripts/monitoring/healthcheck.sh

metrics:
	./scripts/monitoring/metrics.sh

backup:
	docker exec o meblas_mysql ./backup.sh

restore:
	docker exec -i o meblas_mysql ./restore.sh

# ===== Seguridad =====
scan:
	cd backend && go vet ./...
	cd backend && gosec ./...

audit:
	cd frontend-web && npm audit
	cd mobile && npm audit

# ===== Utilidades =====
clean:
	rm -rf backend/bin backend/vendor frontend-web/dist mobile/.expo
	docker system prune -f

seed:
	docker compose -f docker-compose.yml exec backend go run ./cmd/api -seed
