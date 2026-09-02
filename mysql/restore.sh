#!/bin/sh
# ===== OMEBLAS - Restore de MySQL =====
set -e

MYSQL_HOST="${DB_HOST:-localhost}"
MYSQL_USER="${MYSQL_USER:-root}"
MYSQL_PASSWORD="${MYSQL_ROOT_PASSWORD:-}"
MYSQL_DATABASE="${MYSQL_DATABASE:-omeblas}"
BACKUP_DIR="/backups"

if [ -z "$1" ]; then
    echo "Uso: restore.sh <archivo_backup>"
    echo "Archivos disponibles:"
    ls -la "$BACKUP_DIR"
    exit 1
fi

BACKUP_FILE="$BACKUP_DIR/$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: archivo $BACKUP_FILE no existe"
    exit 1
fi

echo "Restaurando $BACKUP_FILE..."

case "$BACKUP_FILE" in
    *.enc)
        if [ -z "$ENCRYPTION_KEY" ]; then
            echo "Error: se requiere ENCRYPTION_KEY para descifrar"
            exit 1
        fi
        openssl enc -d -aes-256-cbc -pbkdf2 -in "$BACKUP_FILE" \
            | gunzip \
            | mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"
        ;;
    *)
        gunzip -c "$BACKUP_FILE" \
            | mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"
        ;;
esac

echo "Restauración completada correctamente."