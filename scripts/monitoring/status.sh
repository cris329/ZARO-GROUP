#!/bin/bash
# ===== ZARO GROUP - Monitoreo: estado de infraestructura =====
set -e

TIME=$(date '+%Y-%m-%d %H:%M:%S')
echo "===== ZARO GROUP Status: $TIME ====="
echo ""

echo "--- Contenedores ---"
docker compose ps

echo ""
echo "--- Uso de recursos ---"
docker stats --no-stream

echo ""
echo "--- Espacio en disco ---"
df -h | grep -E '^(Filesystem|/dev/)'

echo ""
echo "--- Memoria ---"
free -h

echo ""
echo "--- Logs recientes del backend (últimos 50) ---"
docker compose logs backend --tail 50

echo ""
echo "--- Errores recientes ---"
docker compose logs --since 1h | grep -i -E 'error|fatal|panic' || echo "Sin errores en la última hora ✓"