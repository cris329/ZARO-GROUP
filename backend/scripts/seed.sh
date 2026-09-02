#!/bin/sh
# ===== OMEBLAS - Seed de datos de prueba =====
set -e

MYSQL_HOST="${DB_HOST:-mysql}"
MYSQL_PORT="${DB_PORT:-3306}"
MYSQL_USER="${MYSQL_USER:-app_user}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-}"
MYSQL_DATABASE="${MYSQL_DATABASE:-omeblas}"

echo "Cargando datos de prueba en ${MYSQL_DATABASE}..."

mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" <<'SQL'
-- Usuario de prueba
INSERT INTO users (id, name, email, password_hash, role)
VALUES ('usr_seed_01', 'Campesino Demo', 'demo@omeblas.com', '$2y$12$dummyhashdummyhashdummyhashdummyhashdummyhashdummyhashdummy22', 'farmer')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Productos de prueba
INSERT INTO products (id, name, description, quantity, price, user_id, synced)
VALUES
 ('prd_seed_01', 'Tomate Chonto', 'Tomate fresco de finca', 500, 1800, 'usr_seed_01', 1),
 ('prd_seed_02', 'Papa Criolla', 'Papa criolla de la zona', 800, 1200, 'usr_seed_01', 1),
 ('prd_seed_03', 'Plátano', 'Plátano hartón', 300, 900, 'usr_seed_01', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Pedido de prueba
INSERT INTO orders (id, user_id, products, total, status, synced, client_name, client_phone)
VALUES (
 'ord_seed_01',
 'usr_seed_01',
 JSON_ARRAY(JSON_OBJECT('product_id', 'prd_seed_01', 'name', 'Tomate Chonto', 'quantity', 100, 'price', 1800)),
 180000,
 'pending',
 1,
 'Tienda Central',
 '3001234567'
)
ON DUPLICATE KEY UPDATE total = VALUES(total);
SQL

echo "Datos de prueba cargados correctamente."