package middleware

import (
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/zaro-group/backend/pkg/logger"
)

type CircuitBreaker struct {
	mu            sync.Mutex
	failures      int
	state         string // closed, open, half_open
	lastFailure   time.Time
	failureThreshold int
	timeout       time.Duration
}

func NewCircuitBreaker(threshold int, timeout time.Duration) *CircuitBreaker {
	return &CircuitBreaker{
		state:            "closed",
		failureThreshold: threshold,
		timeout:          timeout,
	}
}

func (cb *CircuitBreaker) Allow() bool {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	switch cb.state {
	case "closed":
		return true
	case "open":
		if time.Since(cb.lastFailure) > cb.timeout {
			cb.state = "half_open"
			return true
		}
		return false
	case "half_open":
		return true
	}
	return false
}

func (cb *CircuitBreaker) RecordSuccess() {
	cb.mu.Lock()
	defer cb.mu.Unlock()
	cb.failures = 0
	if cb.state == "half_open" {
		cb.state = "closed"
	}
	cb.lastFailure = time.Time{}
}

func (cb *CircuitBreaker) RecordFailure() {
	cb.mu.Lock()
	defer cb.mu.Unlock()
	cb.failures++
	cb.lastFailure = time.Now()
	if cb.state == "half_open" || cb.failures >= cb.failureThreshold {
		cb.state = "open"
	}
}

func (cb *CircuitBreaker) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if !cb.Allow() {
			logger.Warn("Circuit breaker abierto, rechazando petición")
			c.JSON(503, gin.H{
				"error":   "service_unavailable",
				"message": "servicio temporalmente no disponible",
				"status":  503,
			})
			c.Abort()
			return
		}

		// Record result after handler runs
		// This is tracked via ResponseWriter writer captured in closure
		writer := &captureWriter{ResponseWriter: c.Writer}
		c.Writer = writer

		c.Next()

		if writer.status >= 500 {
			cb.RecordFailure()
		} else {
			cb.RecordSuccess()
		}
	}
}

type captureWriter struct {
	gin.ResponseWriter
	status int
}

func (w *captureWriter) WriteHeader(code int) {
	w.status = code
	w.ResponseWriter.WriteHeader(code)
}

func (w *captureWriter) Write(data []byte) (int, error) {
	if w.status == 0 {
		w.status = 200
	}
	return w.ResponseWriter.Write(data)
}