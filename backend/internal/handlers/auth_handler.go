package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/omeblas/omeblas/backend/internal/repositories"
	"github.com/omeblas/omeblas/backend/internal/usecases/auth"
)

type AuthHandler struct {
	authUC *auth.AuthUseCase
}

func NewAuthHandler(authUC *auth.AuthUseCase) *AuthHandler {
	return &AuthHandler{authUC: authUC}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var input auth.RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		respondError(c, http.StatusBadRequest, "invalid_input", "cuerpo de petición inválido")
		return
	}

	result, err := h.authUC.Register(c.Request.Context(), input)
	if err != nil {
		handleAuthError(c, err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    result,
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var input auth.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		respondError(c, http.StatusBadRequest, "invalid_input", "cuerpo de petición inválido")
		return
	}

	result, err := h.authUC.Login(c.Request.Context(), input)
	if err != nil {
		handleAuthError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    result,
	})
}

func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var input struct {
		RefreshToken string `json:"refresh_token"`
	}
	if err := c.ShouldBindJSON(&input); err != nil || input.RefreshToken == "" {
		respondError(c, http.StatusBadRequest, "invalid_input", "refresh_token requerido")
		return
	}

	result, err := h.authUC.RefreshToken(c.Request.Context(), input.RefreshToken)
	if err != nil {
		handleAuthError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    result,
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	authorization := c.GetHeader("Authorization")
	if len(authorization) > 7 {
		token := authorization[7:]
		_ = h.authUC.Logout(c.Request.Context(), token)
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "sesión cerrada"})
}

func (h *AuthHandler) Me(c *gin.Context) {
	userID := c.GetString("user_id")
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    gin.H{"user_id": userID},
	})
}

func handleAuthError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, auth.ErrInvalidCredentials):
		respondError(c, http.StatusUnauthorized, "invalid_credentials", "email o contraseña incorrectos")
	case errors.Is(err, repositories.ErrEmailInUse):
		respondError(c, http.StatusConflict, "email_in_use", "el email ya está registrado")
	case errors.Is(err, auth.ErrPasswordTooWeak):
		respondError(c, http.StatusBadRequest, "weak_password", err.Error())
	case errors.Is(err, auth.ErrEmailInvalid):
		respondError(c, http.StatusBadRequest, "invalid_email", err.Error())
	default:
		respondError(c, http.StatusInternalServerError, "internal_error", "error interno del servidor")
	}
}