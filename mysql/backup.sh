#!/bin/sh
# ===== OMEBLAS - Backup automático de MySQL =====
set -e

MYSQL_HOST="${DB_HOST:-localhost}"
MYSQL_USER="${MYSQL_USER:-root}"
MYSQL_PASSWORD="${MYSQL_ROOT_PASSWORD:-}"
MYSQL_DATABASE="${MYSQL_DATABASE:-omeblas}"
BACKUP_DIR="/backups"
RETENTION_DAYS=7

mkdir -p "$BACKUP_DIR"

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${MYSQL_DATABASE}_${BACKUP_DATE}.sql.gz"

echo "Iniciando backup de $MYSQL_DATABASE..."

mysqldump -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" \
    --single-transaction --routines --triggers \
    "$MYSQL_DATABASE" | gzip > "$BACKUP_FILE"

# Cifrar el backup
if [ -n "$ENCRYPTION_KEY" ]; then
    openssl enc -aes-256-cbc -salt -pbkdf2 \
        -in "$BACKUP_FILE" -out "$BACKUP_FILE.enc"
    rm -f "$BACKUP_FILE"
    BACKUP_FILE="$BACKUP_FILE.enc"
fi

echo "Backup creado: $BACKUP_FILE"

# Retención de 7 días
find "$BACKUP_DIR" -name "${MYSQL_DATABASE}_*.sql.gz*" -mtime +$RETENTION_DAYS -exec rm -f {} \;
echo "Backups antiguos (>$RETENTION_DAYS días) eliminados."

echo "Backup completado correctamente."