-- =============================================
-- ZARO GROUP - Migración 001 - Tablas iniciales
-- =============================================

-- Tabla: users
CREATE TABLE IF NOT EXISTS users (
    id            VARCHAR(36)  NOT NULL,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(254) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('admin', 'farmer', 'manager') NOT NULL DEFAULT 'farmer',
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    TIMESTAMP    NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    KEY idx_users_email (email),
    KEY idx_users_role (role),
    KEY idx_users_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: products
CREATE TABLE IF NOT EXISTS products (
    id            VARCHAR(36)   NOT NULL,
    name          VARCHAR(100)  NOT NULL,
    description   TEXT          NULL,
    quantity      INT           NOT NULL DEFAULT 0,
    price         DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    user_id       VARCHAR(36)   NOT NULL,
    synced        TINYINT(1)    NOT NULL DEFAULT 0,
    version       INT           NOT NULL DEFAULT 1,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    TIMESTAMP     NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_products_user_id (user_id),
    KEY idx_products_user_synced (user_id, synced),
    KEY idx_products_updated_at (updated_at),
    CONSTRAINT fk_products_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: orders
CREATE TABLE IF NOT EXISTS orders (
    id            VARCHAR(36)   NOT NULL,
    user_id       VARCHAR(36)   NOT NULL,
    products      JSON          NOT NULL,
    total         DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    status        ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    synced        TINYINT(1)    NOT NULL DEFAULT 0,
    client_name   VARCHAR(100)  NULL,
    client_phone  VARCHAR(20)   NULL,
    notes         TEXT          NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    TIMESTAMP     NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_orders_user_id (user_id),
    KEY idx_orders_user_synced (user_id, synced),
    KEY idx_orders_status (status),
    KEY idx_orders_created_at (created_at),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: sync_logs
CREATE TABLE IF NOT EXISTS sync_logs (
    id              VARCHAR(36)  NOT NULL,
    user_id         VARCHAR(36)  NOT NULL,
    entity_type     ENUM('product', 'order') NOT NULL,
    operation_type  ENUM('create', 'update', 'delete') NOT NULL,
    entity_id       VARCHAR(36)  NOT NULL,
    data            JSON         NULL,
    status          ENUM('pending', 'synced', 'failed', 'conflict') NOT NULL DEFAULT 'pending',
    attempts        INT          NOT NULL DEFAULT 0,
    last_attempt    TIMESTAMP    NULL DEFAULT NULL,
    client_version  INT          NOT NULL DEFAULT 1,
    server_version  INT          NOT NULL DEFAULT 1,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP    NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_sync_logs_user_status (user_id, status),
    KEY idx_sync_logs_entity (entity_type, entity_id),
    KEY idx_sync_logs_created_at (created_at),
    CONSTRAINT fk_sync_logs_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;