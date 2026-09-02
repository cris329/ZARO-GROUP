#!/bin/sh
# ===== ZARO GROUP - Healthcheck de MySQL =====
HOST="${1:--h localhost}"
USER="${2:-root}"

my_success=0
mysqladmin ping -h "${HOST#-h }" -u "$USER" --silent

exit $?