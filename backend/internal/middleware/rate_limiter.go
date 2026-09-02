package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type clientBucket struct {
	tokens     float64
	lastRefill time.Time
}

type RateLimiter struct {
	mu       sync.Mutex
	clients  map[string]*clientBucket
	rate     float64 // tokens por segundo
	burst    float64 // capacidad máxima
}

func NewRateLimiter(requestsPerMinute, burst int) *RateLimiter {
	rate := float64(requestsPerMinute) / 60.0
	if burst <= 0 {
		burst = requestsPerMinute / 5
		if burst == 0 {
			burst = 1
		}
	}
	return &RateLimiter{
		clients: make(map[string]*clientBucket),
		rate:    rate,
		burst:   float64(burst),
	}
}

func (rl *RateLimiter) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		if !rl.allow(ip) {
			c.Header("Retry-After", "60")
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error":   "rate_limited",
				"message": "demasiadas peticiones, intente en un minuto",
				"status":  http.StatusTooManyRequests,
			})
			c.Abort()
			return
		}
		c.Next()
	}
}

func (rl *RateLimiter) allow(ip string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	bucket, exists := rl.clients[ip]
	if !exists {
		rl.clients[ip] = &clientBucket{
			tokens:     rl.burst - 1,
			lastRefill: now,
		}
		return true
	}

	elapsed := now.Sub(bucket.lastRefill).Seconds()
	bucket.tokens += elapsed * rl.rate
	if bucket.tokens > rl.burst {
		bucket.tokens = rl.burst
	}
	bucket.lastRefill = now

	if bucket.tokens < 1 {
		return false
	}

	bucket.tokens--
	return true
}

// Cleanup runs in background to avoid memory leak
func (rl *RateLimiter) Cleanup(interval time.Duration) {
	go func() {
		ticker := time.NewTicker(interval)
		defer ticker.Stop()
		for range ticker.C {
			rl.mu.Lock()
			now := time.Now()
			for ip, bucket := range rl.clients {
				if now.Sub(bucket.lastRefill) > time.Hour {
					delete(rl.clients, ip)
				}
			}
			rl.mu.Unlock()
		}
	}()
}