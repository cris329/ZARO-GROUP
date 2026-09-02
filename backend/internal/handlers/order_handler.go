package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/zaro-group/backend/internal/repositories"
	"github.com/zaro-group/backend/internal/usecases/orders"
)

type OrderHandler struct {
	orderUC *orders.OrderUseCase
}

func NewOrderHandler(orderUC *orders.OrderUseCase) *OrderHandler {
	return &OrderHandler{orderUC: orderUC}
}

func (h *OrderHandler) List(c *gin.Context) {
	userID := c.GetString("user_id")
	role := c.GetString("user_role")

	if role == "admin" && c.Query("all") == "true" {
		userID = ""
	}

	page := parsePage(c.Query("page"))
	limit := parseLimit(c.Query("limit"))

	orderList, total, err := h.orderUC.List(c.Request.Context(), userID, page, limit)
	if err != nil {
		respondError(c, http.StatusInternalServerError, "internal_error", "error al listar pedidos")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"orders": orderList,
			"total":  total,
			"page":   page,
			"limit":  limit,
		},
	})
}

func (h *OrderHandler) Get(c *gin.Context) {
	userID := c.GetString("user_id")
	id := c.Param("id")

	order, err := h.orderUC.GetByID(c.Request.Context(), userID, id)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			respondError(c, http.StatusNotFound, "not_found", "pedido no encontrado")
			return
		}
		respondError(c, http.StatusInternalServerError, "internal_error", "error al obtener pedido")
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": order})
}

func (h *OrderHandler) Create(c *gin.Context) {
	userID := c.GetString("user_id")

	var input orders.CreateOrderInput
	if err := c.ShouldBindJSON(&input); err != nil {
		respondError(c, http.StatusBadRequest, "invalid_input", "cuerpo de petición inválido")
		return
	}

	order, err := h.orderUC.Create(c.Request.Context(), userID, input)
	if err != nil {
		respondError(c, http.StatusBadRequest, "validation_error", err.Error())
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "data": order})
}

func (h *OrderHandler) Update(c *gin.Context) {
	userID := c.GetString("user_id")
	id := c.Param("id")

	var input orders.UpdateOrderInput
	if err := c.ShouldBindJSON(&input); err != nil {
		respondError(c, http.StatusBadRequest, "invalid_input", "cuerpo de petición inválido")
		return
	}

	order, err := h.orderUC.Update(c.Request.Context(), userID, id, input)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			respondError(c, http.StatusNotFound, "not_found", "pedido no encontrado")
			return
		}
		respondError(c, http.StatusBadRequest, "validation_error", err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": order})
}

func (h *OrderHandler) Delete(c *gin.Context) {
	userID := c.GetString("user_id")
	id := c.Param("id")

	if err := h.orderUC.Delete(c.Request.Context(), userID, id); err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			respondError(c, http.StatusNotFound, "not_found", "pedido no encontrado")
			return
		}
		respondError(c, http.StatusInternalServerError, "internal_error", "error al eliminar pedido")
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "pedido eliminado"})
}