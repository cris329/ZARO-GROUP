#!/bin/bash
# ===== ZARO GROUP - Copia de seguridad de la base de datos =====
set -e

DUMPS="${BACKUP_DIR:-$PWD/dumps}"
DB_USER="${MYSQL_USER:-app_user}"
DB_PASS="${MYSQL_PASSWORD:-app_password}"

mkdir -p "$DUMPS"

while true; do
  STAMP=$(date '+%Y%m%d_%H%M%S')
  # Retención: mantener los últimos 7 backups, borrar los más antiguos
  find "$DUMPS" -name "*.sql.gz" -type f | sort | head -n -7 | xargs -r rm -f

  echo "[$(date '+%H:%M:%S')] Creando backup..."
  docker compose exec -T mysql \
    mysqldump -u"$DB_USER" -p"$DB_PASS" zaro_group \
    --single-transaction --quick --lock-tables=false \
  | gzip > "$DUMPS/zaro_group_$STAMP.sql.gz"

  echo "Backup guardado en $DUMPS/zaro_group_$STAMP.sql.gz"
  sleep 24h
done