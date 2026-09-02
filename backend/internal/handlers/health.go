package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Health(dbPing func() error) gin.HandlerFunc {
	return func(c *gin.Context) {
		status := "ok"
		code := http.StatusOK

		if err := dbPing(); err != nil {
			status = "degraded"
			code = http.StatusServiceUnavailable
		}

		c.JSON(code, gin.H{
			"status":  status,
			"version": "1.0.0",
			"time":    nowISO(),
		})
	}
}

func Live() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "alive"})
	}
}