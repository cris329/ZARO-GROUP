import { openDB, IDBPDatabase } from 'idb'
import { Product, Order } from '@/types'

const DB_NAME = 'zaro-group-offline'
const DB_VERSION = 1

type DBSchema = {
  products: {
    key: string
    value: Product
    indexes: { 'by-user_id': string }
  }
  orders: {
    key: string
    value: Order
    indexes: { 'by-user_id': string }
  }
  meta: {
    key: string
    value: { key: string; value: unknown }
  }
}

let dbPromise: Promise<IDBPDatabase<DBSchema>> | null = null

export const getDB = (): Promise<IDBPDatabase<DBSchema>> => {
  if (!dbPromise) {
    dbPromise = openDB<DBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('products')) {
          const store = db.createObjectStore('products', { keyPath: 'id' })
          store.createIndex('by-user_id', 'user_id')
        }
        if (!db.objectStoreNames.contains('orders')) {
          const store = db.createObjectStore('orders', { keyPath: 'id' })
          store.createIndex('by-user_id', 'user_id')
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' })
        }
      },
    })
  }
  return dbPromise
}

export const offlineDB = {
  async saveProducts(products: Product[]): Promise<void> {
    const db = await getDB()
    const tx = db.transaction('products', 'readwrite')
    await Promise.all(products.map((p) => tx.store.put(p)))
    await tx.done
  },

  async getProducts(): Promise<Product[]> {
    const db = await getDB()
    return (await db.getAll('products')) as Product[]
  },

  async saveProduct(product: Product): Promise<void> {
    const db = await getDB()
    await db.put('products', product)
  },

  async deleteProduct(id: string): Promise<void> {
    const db = await getDB()
    await db.delete('products', id)
  },

  async saveOrders(orders: Order[]): Promise<void> {
    const db = await getDB()
    const tx = db.transaction('orders', 'readwrite')
    await Promise.all(orders.map((o) => tx.store.put(o)))
    await tx.done
  },

  async getOrders(): Promise<Order[]> {
    const db = await getDB()
    return (await db.getAll('orders')) as Order[]
  },

  async saveOrder(order: Order): Promise<void> {
    const db = await getDB()
    await db.put('orders', order)
  },

  async getMeta<T>(key: string): Promise<T | null> {
    const db = await getDB()
    const entry = await db.get('meta', key)
    return entry ? (entry.value as T) : null
  },

  async setMeta(key: string, value: unknown): Promise<void> {
    const db = await getDB()
    await db.put('meta', { key, value })
  },

  async clearAll(): Promise<void> {
    const db = await getDB()
    const tx = db.transaction(['products', 'orders'], 'readwrite')
    await Promise.all([tx.objectStore('products').clear(), tx.objectStore('orders').clear()])
    await tx.done
  },
}