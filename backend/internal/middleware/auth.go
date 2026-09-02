package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/zaro-group/backend/internal/config"
	"github.com/zaro-group/backend/pkg/crypto"
	"github.com/zaro-group/backend/pkg/logger"
)

func Auth(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			respondUnauthorized(c, "token de autenticación requerido")
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			respondUnauthorized(c, "formato de token inválido")
			return
		}

		claims, err := crypto.ParseJWT(parts[1], jwtSecret)
		if err != nil {
			logger.Warn("Token inválido:", err)
			respondUnauthorized(c, "token inválido o expirado")
			return
		}

		if claims.Role == "refresh" {
			respondUnauthorized(c, "refresh token no es válido para acceso")
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("user_role", claims.Role)
		c.Next()
	}
}

func RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("user_role")
		if !exists {
			respondForbidden(c, "sin permisos de acceso")
			return
		}

		roleStr := role.(string)
		for _, r := range roles {
			if roleStr == r {
				c.Next()
				return
			}
		}
		respondForbidden(c, "no tiene permisos para esta acción")
	}
}

func respondUnauthorized(c *gin.Context, msg string) {
	c.JSON(http.StatusUnauthorized, gin.H{
		"error":   "unauthorized",
		"message": msg,
		"status":  http.StatusUnauthorized,
	})
	c.Abort()
}

func respondForbidden(c *gin.Context, msg string) {
	c.JSON(http.StatusForbidden, gin.H{
		"error":   "forbidden",
		"message": msg,
		"status":  http.StatusForbidden,
	})
	c.Abort()
}

// RefreshToken middleware validates a refresh JWT (missing user role check)
func RefreshToken(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			respondUnauthorized(c, "token de autenticación requerido")
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			respondUnauthorized(c, "formato de token inválido")
			return
		}

		claims, err := crypto.ParseJWT(parts[1], jwtSecret)
		if err != nil {
			logger.Warn("Refresh token inválido:", err)
			respondUnauthorized(c, "refresh token inválido o expirado")
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("refresh_exp", claims.ExpiresAt)
		c.Next()
	}
}

var _ = config.Config{}