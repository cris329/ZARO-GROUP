#!/bin/bash
# ===== OMEBLAS - Deploy del backend =====
set -e

MODE="${1:-deploy}" # deploy | rollback

echo "OMEBLAS Backend - Modo: $MODE"

deploy() {
  echo "Compilando imagen de producción..."
  docker compose -f docker-compose.prod.yml build backend

  echo "Deteniendo contenedor anterior..."
  docker compose -f docker-compose.prod.yml stop backend

  echo "Levantando nuevo backend..."
  docker compose -f docker-compose.prod.yml up -d backend

  echo "Verificando healthcheck..."
  sleep 5
  for i in $(seq 1 10); do
    if curl -sf http://localhost:8080/health > /dev/null; then
      echo "Backend saludable ✓"
      return 0
    fi
    echo "Esperando... ($i/10)"
    sleep 5
  done
  rollback
}

rollback() {
  echo "Healthcheck falló, revirtiendo..."
  docker compose -f docker-compose.prod.yml logs backend --tail 50
  PREV_TAG=$(docker images omeblas_backend -q | head -2 | tail -1)
  if [ -n "$PREV_TAG" ]; then
    docker tag "$PREV_TAG" omeblas_backend:latest
    docker compose -f docker-compose.prod.yml up -d --no-build backend
    echo "Rollback completado."
  else
    echo "Sin despliegue anterior disponible."
  fi
  exit 1
}

case "$MODE" in
  deploy) deploy ;;
  rollback) rollback ;;
  *) echo "Uso: $0 [deploy|rollback]"; exit 1 ;;
esac