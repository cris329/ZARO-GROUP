package cache

import (
	"context"
	"encoding/json"
	"sync"
	"time"

	"github.com/go-redis/redis/v8"
)

type Cache interface {
	Get(ctx context.Context, key string, out interface{}) error
	Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error
	Delete(ctx context.Context, key string) error
	DeletePattern(ctx context.Context, pattern string) error
	ServeHTTPEnabled() bool
}

type RedisCache struct {
	client *redis.Client
}

func NewRedisCache(client *redis.Client) *RedisCache {
	return &RedisCache{client: client}
}

func (c *RedisCache) Get(ctx context.Context, key string, out interface{}) error {
	data, err := c.client.Get(ctx, key).Bytes()
	if err != nil {
		return err
	}
	return json.Unmarshal(data, out)
}

func (c *RedisCache) Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return c.client.Set(ctx, key, data, ttl).Err()
}

func (c *RedisCache) Delete(ctx context.Context, key string) error {
	return c.client.Del(ctx, key).Err()
}

func (c *RedisCache) DeletePattern(ctx context.Context, pattern string) error {
	iter := c.client.Scan(ctx, 0, pattern, 0).Iterator()
	var keys []string
	for iter.Next(ctx) {
		keys = append(keys, iter.Val())
	}
	if err := iter.Err(); err != nil {
		return err
	}
	if len(keys) > 0 {
		return c.client.Del(ctx, keys...).Err()
	}
	return nil
}

func (c *RedisCache) ServeHTTPEnabled() bool {
	return c.client != nil
}

// ===== In-memory cache =====

type memoryEntry struct {
	value     []byte
	expiresAt time.Time
}

type MemoryCache struct {
	mu      sync.RWMutex
	items   map[string]memoryEntry
	maxSize int
}

func NewMemoryCache(maxSize int) *MemoryCache {
	c := &MemoryCache{
		items:   make(map[string]memoryEntry),
		maxSize: maxSize,
	}
	go c.sweeper()
	return c
}

func (c *MemoryCache) Get(ctx context.Context, key string, out interface{}) error {
	c.mu.RLock()
	entry, ok := c.items[key]
	c.mu.RUnlock()

	if !ok || time.Now().After(entry.expiresAt) {
		c.Delete(ctx, key)
		return redis.Nil
	}

	return json.Unmarshal(entry.value, out)
}

func (c *MemoryCache) Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}

	c.mu.Lock()
	defer c.mu.Unlock()

	if len(c.items) >= c.maxSize {
		// Simple eviction: delete the oldest entry
		var oldestKey string
		var oldestTime time.Time
		for k, v := range c.items {
			if oldestKey == "" || v.expiresAt.Before(oldestTime) {
				oldestKey = k
				oldestTime = v.expiresAt
			}
		}
		if oldestKey != "" {
			delete(c.items, oldestKey)
		}
	}

	c.items[key] = memoryEntry{
		value:     data,
		expiresAt: time.Now().Add(ttl),
	}
	return nil
}

func (c *MemoryCache) Delete(ctx context.Context, key string) error {
	c.mu.Lock()
	delete(c.items, key)
	c.mu.Unlock()
	return nil
}

func (c *MemoryCache) DeletePattern(ctx context.Context, pattern string) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	for k := range c.items {
		if matchPattern(k, pattern) {
			delete(c.items, k)
		}
	}
	return nil
}

func (c *MemoryCache) ServeHTTPEnabled() bool { return true }

func (c *MemoryCache) sweeper() {
	ticker := time.NewTicker(time.Minute)
	defer ticker.Stop()
	for range ticker.C {
		now := time.Now()
		c.mu.Lock()
		for k, v := range c.items {
			if now.After(v.expiresAt) {
				delete(c.items, k)
			}
		}
		c.mu.Unlock()
	}
}

func matchPattern(key, pattern string) bool {
	// Simple wildcard matching (* at start/end)
	if len(pattern) == 0 {
		return false
	}
	if pattern == "*" {
		return true
	}
	hasPrefix := false
	hasSuffix := false
	core := pattern
	if core[0] == '*' {
		hasPrefix = true
		core = core[1:]
	}
	if len(core) > 0 && core[len(core)-1] == '*' {
		hasSuffix = true
		core = core[:len(core)-1]
	}

	switch {
	case hasPrefix && hasSuffix:
		return len(key) >= len(core) && key[len(key)-len(core):] == core && key[:len(core)] == core
	case hasPrefix:
		return len(key) >= len(core) && key[len(key)-len(core):] == core
	case hasSuffix:
		return len(key) >= len(core) && key[:len(core)] == core
	default:
		return key == pattern
	}
}