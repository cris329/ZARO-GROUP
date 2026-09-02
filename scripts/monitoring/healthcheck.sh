#!/bin/bash
# ===== ZARO GROUP - Healthcheck del API =====
HOST="${HEALTHCHECK_HOST:-http://localhost:8080}"
TIMEOUT="${HEALTHCHECK_TIMEOUT:-5}"

for i in $(seq 1 "${HEALTHCHECK_RETRIES:-20}"); do
  RESPONSE=$(curl -sf -m "$TIMEOUT" "$HOST/health" 2>/dev/null || echo "FAIL")

  if [ "$RESPONSE" = "FAIL" ]; then
    echo "[$i] Sin respuesta de $HOST"
    sleep 5
    continue
  fi

  # Verificar que la respuesta contenga status ok
  if echo "$RESPONSE" | grep -q '"status": *"ok"'; then
    echo "ZARO GROUP API saludable ✓"
    exit 0
  fi

  echo "[$i] Respuesta inesperada: $RESPONSE"
  sleep 5
done

echo "Healthcheck falló: el API no está disponible"
exit 1