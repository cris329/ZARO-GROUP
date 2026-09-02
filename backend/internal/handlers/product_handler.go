package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/omeblas/omeblas/backend/internal/domain"
	"github.com/omeblas/omeblas/backend/internal/repositories"
	"github.com/omeblas/omeblas/backend/internal/usecases/products"
)

type ProductHandler struct {
	productUC *products.ProductUseCase
}

func NewProductHandler(productUC *products.ProductUseCase) *ProductHandler {
	return &ProductHandler{productUC: productUC}
}

func (h *ProductHandler) List(c *gin.Context) {
	userID := c.GetString("user_id")
	role := c.GetString("user_role")

	// Admins can view all; farmers only their own
	if role == "admin" && c.Query("all") == "true" {
		userID = ""
	}

	filter := domain.ProductFilter{
		Search:  c.Query("search"),
		Page:    parsePage(c.Query("page")),
		Limit:   parseLimit(c.Query("limit")),
		SortBy:  c.Query("sort_by"),
		SortDir: c.Query("sort_dir"),
	}

	list, err := h.productUC.List(c.Request.Context(), userID, filter)
	if err != nil {
		respondError(c, http.StatusInternalServerError, "internal_error", "error al listar productos")
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": list})
}

func (h *ProductHandler) Get(c *gin.Context) {
	userID := c.GetString("user_id")
	id := c.Param("id")

	product, err := h.productUC.GetByID(c.Request.Context(), userID, id)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			respondError(c, http.StatusNotFound, "not_found", "producto no encontrado")
			return
		}
		respondError(c, http.StatusInternalServerError, "internal_error", "error al obtener producto")
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": product})
}

func (h *ProductHandler) Create(c *gin.Context) {
	userID := c.GetString("user_id")

	var input products.CreateProductInput
	if err := c.ShouldBindJSON(&input); err != nil {
		respondError(c, http.StatusBadRequest, "invalid_input", "cuerpo de petición inválido")
		return
	}

	product, err := h.productUC.Create(c.Request.Context(), userID, input)
	if err != nil {
		respondError(c, http.StatusBadRequest, "validation_error", err.Error())
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "data": product})
}

func (h *ProductHandler) Update(c *gin.Context) {
	userID := c.GetString("user_id")
	id := c.Param("id")

	var input products.UpdateProductInput
	if err := c.ShouldBindJSON(&input); err != nil {
		respondError(c, http.StatusBadRequest, "invalid_input", "cuerpo de petición inválido")
		return
	}

	product, err := h.productUC.Update(c.Request.Context(), userID, id, input)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			respondError(c, http.StatusNotFound, "not_found", "producto no encontrado")
			return
		}
		respondError(c, http.StatusBadRequest, "validation_error", err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": product})
}

func (h *ProductHandler) Delete(c *gin.Context) {
	userID := c.GetString("user_id")
	id := c.Param("id")

	if err := h.productUC.Delete(c.Request.Context(), userID, id); err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			respondError(c, http.StatusNotFound, "not_found", "producto no encontrado")
			return
		}
		respondError(c, http.StatusInternalServerError, "internal_error", "error al eliminar producto")
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "producto eliminado"})
}

func parsePage(s string) int {
	if s == "" {
		return 1
	}
	v, _ := strconv.Atoi(s)
	if v < 1 {
		return 1
	}
	return v
}

func parseLimit(s string) int {
	if s == "" {
		return 20
	}
	v, _ := strconv.Atoi(s)
	if v < 1 {
		return 20
	}
	if v > 100 {
		return 100
	}
	return v
}