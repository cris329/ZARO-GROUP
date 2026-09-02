package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/omeblas/omeblas/backend/pkg/logger"
	"github.com/google/uuid"
)

func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()

		duration := time.Since(start)
		logger.Info("request",
			"method", c.Request.Method,
			"path", c.Request.URL.Path,
			"status", c.Writer.Status(),
			"duration", duration.String(),
			"ip", c.ClientIP(),
			"user_agent", c.Request.UserAgent(),
			"request_id", c.GetString("request_id"),
		)
	}
}

func RequestID() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := c.GetHeader("X-Request-ID")
		if requestID == "" {
			requestID = "req_" + uuid.New().String()
		}
		c.Set("request_id", requestID)
		c.Header("X-Request-ID", requestID)
		c.Next()
	}
}

func Timeout() gin.HandlerFunc {
	return func(c *gin.Context) {
		done := make(chan bool, 1)

		go func() {
			c.Next()
			done <- true
		}()

		select {
		case <-done:
		case <-time.After(30 * time.Second):
			c.AbortWithStatusJSON(504, gin.H{
				"error":   "timeout",
				"message": "el servidor tardó demasiado en responder",
				"status":  504,
			})
		}
	}
}

func Compression() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Content-Encoding", "gzip")

		// We'll use the gzip library at handler level
		// Simpler: just add Vary header to let proxies handle
		c.Header("Vary", "Accept-Encoding")

		// No hard content-encoding set here; Handler uses gzip middleware if configured.
		c.Writer.Header().Del("Content-Encoding")
		c.Next()
	}
}

func PayloadLimit(maxBytes int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.ContentLength > maxBytes {
			c.AbortWithStatusJSON(413, gin.H{
				"error":   "payload_too_large",
				"message": "el cuerpo de la petición excede el límite de 10MB",
				"status":  413,
			})
			return
		}
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxBytes)
		c.Next()
	}
}