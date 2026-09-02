#!/bin/bash
# ===== ZARO GROUP - Entorno de desarrollo =====
# Levanta backend con recarga en caliente (air) y docker compose de dev.

set -e

ACTION="${1:-up}"

case "$ACTION" in
  up)
    echo "Levantando entorno de desarrollo..."
    cp -n .env.example .env.local || true
    docker compose up -d --build
    echo "Backend dev en http://localhost:8080 (air hot-reload)"
    echo "Frontend dev en http://localhost:5173"
    echo "Base de datos en localhost:3306"
    docker compose logs -f --tail=100
    ;;

  down)
    echo "Deteniendo entorno de desarrollo..."
    docker compose down
    ;;

  reset)
    echo "Reiniciando completamente (borra datos)..."
    docker compose down -v
    docker compose up -d --build
    ;;

  migrate)
    echo "Aplicando migraciones..."
    docker compose exec backend ./migrate up
    ;;

  test)
    echo "Corriendo pruebas del backend..."
    docker compose exec backend go test ./...
    ;;

  backup)
    echo "Creando backup de la base de datos dev..."
    docker compose exec -T mysql mysqldump -uapp_user -papp_password zaro_group \
      --single-transaction --quick | gzip > dumps/dev_backup_$(date +%Y%m%d_%H%M%S).sql.gz
    echo "Backup creado."
    ;;

  *)
    echo "Uso: $0 [up|down|reset|migrate|test|backup]"
    exit 1
    ;;
esac