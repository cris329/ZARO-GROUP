package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/zaro-group/backend/internal/usecases/sync"
)

type SyncHandler struct {
	syncUC *sync.SyncUseCase
}

func NewSyncHandler(syncUC *sync.SyncUseCase) *SyncHandler {
	return &SyncHandler{syncUC: syncUC}
}

func (h *SyncHandler) Push(c *gin.Context) {
	userID := c.GetString("user_id")

	var req sync.SyncRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondError(c, http.StatusBadRequest, "invalid_input", "cuerpo de petición inválido")
		return
	}

	if len(req.Logs) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    gin.H{"logs_synced": 0, "conflicts": []interface{}{}},
		})
		return
	}

	if len(req.Logs) > 500 {
		respondError(c, http.StatusBadRequest, "too_many_items", "máximo 500 operaciones por sincronización")
		return
	}

	result, err := h.syncUC.ProcessPush(c.Request.Context(), userID, req)
	if err != nil {
		respondError(c, http.StatusInternalServerError, "internal_error", "error al sincronizar")
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": result})
}

// Pull returns the current state of all entities for the user
func (h *SyncHandler) Pull(c *gin.Context) {
	// This endpoint is used to fetch full state if the client requests
	// In this implementation, the push endpoint returns the result,
	// and clients query list endpoints for full data.
	// Kept for API contract compatibility.
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"server_time": nowISO(),
		},
	})
}

func (h *SyncHandler) Status(c *gin.Context) {
	userID := c.GetString("user_id")

	data := gin.H{
		"device_id":      c.Query("device_id"),
		"last_sync":      nowISO(),
		"pending_count":  0,
		"server_version": "1.0.0",
	}
	_, _ = userID, data

	c.JSON(http.StatusOK, gin.H{"success": true, "data": data})
}