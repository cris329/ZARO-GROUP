import * as SQLite from 'expo-sqlite'
import { secureStorage } from '../api/client'
import * as Crypto from 'expo-crypto'
import { Product, Order } from '@/types'

let db: SQLite.SQLiteDatabase | null = null

/**
 * SQLite local cifrado conceptualmente via SQLCipher en producción.
 * La clave se deriva del login del usuario + un salt almacenado localmente
 * con AES-256 (a través de SecureStore).
 */

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'farmer',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  price REAL NOT NULL DEFAULT 0,
  user_id TEXT NOT NULL,
  synced INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  products TEXT NOT NULL,
  total REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  synced INTEGER NOT NULL DEFAULT 0,
  client_name TEXT,
  client_phone TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  data TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  queued_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_products_user ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_synced ON products(synced);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_queue ON sync_queue(queued_at);
`

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db

  // Derive a key from login for encryption (informational; SQLCipher requires native module)
  const email = await secureStorage.getToken().catch(() => null)
  if (email) {
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      email + Date.now(),
    )
    // En producción: conectar SQLCipher con esta clave
    void hash
  }

  db = SQLite.openDatabase('zaro_group.db')
  await runMigrations(db)
  return db
}

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  // Schema inicial
  await db.execAsync(SCHEMA)

  // Migraciones futuras versionadas
  const version = await getSchemaVersion(db)
  if (version < 1) {
    await db.execAsync(SCHEMA)
    await db.execAsync('PRAGMA user_version = 1')
  }
}

async function getSchemaVersion(db: SQLite.SQLiteDatabase): Promise<number> {
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version')
  return result?.user_version ?? 0
}

export async function closeDB(): Promise<void> {
  if (db) {
    await db.closeAsync()
    db = null
  }
}

// ===== Products =====

export const productQueries = {
  async getAll(): Promise<Product[]> {
    const database = await getDB()
    const rows = await database.getAllAsync<Record<string, unknown>>(
      'SELECT * FROM products ORDER BY created_at DESC',
    )
    return rows.map(mapProductRow)
  },

  async getById(id: string): Promise<Product | null> {
    const database = await getDB()
    const row = await database.getFirstAsync<Record<string, unknown>>(
      'SELECT * FROM products WHERE id = ?',
      id,
    )
    return row ? mapProductRow(row) : null
  },

  async create(product: Product): Promise<void> {
    const database = await getDB()
    await database.runAsync(
      `INSERT INTO products (id, name, description, quantity, price, user_id, synced, version, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      product.id,
      product.name,
      product.description ?? '',
      product.quantity,
      product.price,
      product.user_id,
      product.synced ? 1 : 0,
      product.version ?? 1,
      product.created_at ?? new Date().toISOString(),
      product.updated_at ?? new Date().toISOString(),
    )
  },

  async update(product: Product): Promise<void> {
    const database = await getDB()
    await database.runAsync(
      `UPDATE products
       SET name = ?, description = ?, quantity = ?, price = ?, synced = ?, version = ?, updated_at = ?
       WHERE id = ?`,
      product.name,
      product.description ?? '',
      product.quantity,
      product.price,
      product.synced ? 1 : 0,
      (product.version ?? 1) + 1,
      new Date().toISOString(),
      product.id,
    )
  },

  async remove(id: string): Promise<void> {
    const database = await getDB()
    await database.runAsync('DELETE FROM products WHERE id = ?', id)
  },

  async markAllSynced(): Promise<void> {
    const database = await getDB()
    await database.runAsync('UPDATE products SET synced = 1')
  },
}

function mapProductRow(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    description: String(row.description ?? ''),
    quantity: Number(row.quantity ?? 0),
    price: Number(row.price ?? 0),
    user_id: String(row.user_id ?? ''),
    synced: Boolean(row.synced),
    version: Number(row.version ?? 1),
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
  }
}

// ===== Orders =====

export const orderQueries = {
  async getAll(): Promise<Order[]> {
    const database = await getDB()
    const rows = await database.getAllAsync<Record<string, unknown>>(
      'SELECT * FROM orders ORDER BY created_at DESC',
    )
    return rows.map(mapOrderRow)
  },

  async getById(id: string): Promise<Order | null> {
    const database = await getDB()
    const row = await database.getFirstAsync<Record<string, unknown>>(
      'SELECT * FROM orders WHERE id = ?',
      id,
    )
    return row ? mapOrderRow(row) : null
  },

  async create(order: Order): Promise<void> {
    const database = await getDB()
    await database.runAsync(
      `INSERT INTO orders (id, user_id, products, total, status, synced, client_name, client_phone, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      order.id,
      order.user_id,
      JSON.stringify(order.products),
      order.total,
      order.status,
      order.synced ? 1 : 0,
      order.client_name ?? '',
      order.client_phone ?? '',
      order.notes ?? '',
      order.created_at ?? new Date().toISOString(),
      order.updated_at ?? new Date().toISOString(),
    )
  },

  async update(order: Order): Promise<void> {
    const database = await getDB()
    await database.runAsync(
      `UPDATE orders
       SET products = ?, total = ?, status = ?, synced = ?, client_name = ?, client_phone = ?, notes = ?, updated_at = ?
       WHERE id = ?`,
      JSON.stringify(order.products),
      order.total,
      order.status,
      order.synced ? 1 : 0,
      order.client_name ?? '',
      order.client_phone ?? '',
      order.notes ?? '',
      new Date().toISOString(),
      order.id,
    )
  },

  async remove(id: string): Promise<void> {
    const database = await getDB()
    await database.runAsync('DELETE FROM orders WHERE id = ?', id)
  },
}

function mapOrderRow(row: Record<string, unknown>): Order {
  let products: Order['products'] = []
  try {
    products = JSON.parse(String(row.products ?? '[]'))
  } catch {
    products = []
  }
  return {
    id: String(row.id),
    user_id: String(row.user_id ?? ''),
    products,
    total: Number(row.total ?? 0),
    status: (String(row.status ?? 'pending') as Order['status']),
    synced: Boolean(row.synced),
    client_name: String(row.client_name ?? ''),
    client_phone: String(row.client_phone ?? ''),
    notes: String(row.notes ?? ''),
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
  }
}

// ===== Sync queue =====

export const syncQueueQueries = {
  async add(entry: {
    entity_type: string
    operation_type: string
    entity_id: string
    data: unknown
  }): Promise<void> {
    const database = await getDB()
    await database.runAsync(
      `INSERT OR REPLACE INTO sync_queue (id, entity_type, operation_type, entity_id, data, attempts)
       VALUES (?, ?, ?, ?, ?, 0)`,
      `q_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
      entry.entity_type,
      entry.operation_type,
      entry.entity_id,
      JSON.stringify(entry.data ?? {}),
    )
  },

  async getAll(): Promise<
    { id: string; entity_type: string; operation_type: string; entity_id: string; data: string }[]
  > {
    const database = await getDB()
    return database.getAllAsync<{
      id: string
      entity_type: string
      operation_type: string
      entity_id: string
      data: string
    }>('SELECT id, entity_type, operation_type, entity_id, data FROM sync_queue ORDER BY queued_at ASC')
  },

  async remove(id: string): Promise<void> {
    const database = await getDB()
    await database.runAsync('DELETE FROM sync_queue WHERE id = ?', id)
  },

  async count(): Promise<number> {
    const database = await getDB()
    const row = await database.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM sync_queue')
    return row?.c ?? 0
  },
}