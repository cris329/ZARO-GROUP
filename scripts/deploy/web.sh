#!/bin/bash
# ===== ZARO GROUP - Deploy del frontend web =====
set -e

MODE="${1:-deploy}" # deploy | rollback

echo "ZARO GROUP Web - Modo: $MODE"

case "$MODE" in
  deploy)
    echo "Construyendo frontend..."
    docker compose -f docker-compose.prod.yml build frontend-web

    echo "Desplegando..."
    docker compose -f docker-compose.prod.yml up -d --no-deps frontend-web

    echo "Verificando..."
    sleep 5
    for i in $(seq 1 10); do
      if curl -sf http://localhost:3000/ > /dev/null; then
        echo "Frontend desplegado ✓"
        exit 0
      fi
      echo "Esperando... ($i/10)"
      sleep 5
    done

    echo "Verificación falló"
    exit 1
    ;;

  rollback)
    echo "Revirtiendo frontend..."
    PREV_TAG=$(docker images zaro_web -q | head -2 | tail -1)
    if [ -n "$PREV_TAG" ]; then
      docker tag "$PREV_TAG" zaro_web:latest
      docker compose -f docker-compose.prod.yml up -d --no-build frontend-web
      echo "Rollback completado."
    else
      echo "Sin despliegue anterior disponible."
    fi
    ;;
esac