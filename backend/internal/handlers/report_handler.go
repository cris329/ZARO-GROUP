package handlers

import (
	"errors"
	"net/http"
	"net/url"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/zaro-group/backend/internal/usecases/reports"
)

type ReportHandler struct {
	reportUC *reports.ReportUseCase
}

func NewReportHandler(reportUC *reports.ReportUseCase) *ReportHandler {
	return &ReportHandler{reportUC: reportUC}
}

func (h *ReportHandler) Inventory(c *gin.Context) {
	userID := c.GetString("user_id")

	report, err := h.reportUC.Inventory(c.Request.Context(), userID)
	if err != nil {
		respondError(c, http.StatusInternalServerError, "internal_error", "error al generar reporte")
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": report})
}

func (h *ReportHandler) Sales(c *gin.Context) {
	userID := c.GetString("user_id")

	from, err := parseDate(c.Query("from"), time.Now().AddDate(0, -1, 0))
	if err != nil {
		respondError(c, http.StatusBadRequest, "invalid_date", err.Error())
		return
	}
	to, err := parseDate(c.Query("to"), time.Time{})
	if err != nil {
		respondError(c, http.StatusBadRequest, "invalid_date", err.Error())
		return
	}

	report, err := h.reportUC.Sales(c.Request.Context(), userID, from, to)
	if err != nil {
		respondError(c, http.StatusInternalServerError, "internal_error", "error al generar reporte")
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": report})
}

func (h *ReportHandler) ExportInventory(c *gin.Context) {
	userID := c.GetString("user_id")

	data, filename, err := h.reportUC.ExportInventoryExcel(c.Request.Context(), userID)
	if err != nil {
		respondError(c, http.StatusInternalServerError, "internal_error", "error al exportar reporte")
		return
	}

	c.Header("Content-Disposition", "attachment; filename=\""+filename+"\"")
	c.Data(http.StatusOK, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", data)
}

func (h *ReportHandler) ExportSales(c *gin.Context) {
	userID := c.GetString("user_id")

	from, err := parseDate(c.Query("from"), time.Now().AddDate(0, -1, 0))
	if err != nil {
		respondError(c, http.StatusBadRequest, "invalid_date", err.Error())
		return
	}
	to, err := parseDate(c.Query("to"), time.Time{})
	if err != nil {
		respondError(c, http.StatusBadRequest, "invalid_date", err.Error())
		return
	}

	data, filename, err := h.reportUC.ExportSalesExcel(c.Request.Context(), userID, from, to)
	if err != nil {
		respondError(c, http.StatusInternalServerError, "internal_error", "error al exportar reporte")
		return
	}

	c.Header("Content-Disposition", "attachment; filename=\""+filename+"\"")
	c.Data(http.StatusOK, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", data)
}

func parseDate(s string, fallback time.Time) (time.Time, error) {
	if s == "" {
		return fallback, nil
	}
	decoded, err := url.QueryUnescape(s)
	if err != nil {
		decoded = s
	}
	t, err := time.Parse("2006-01-02", decoded)
	if err != nil {
		return time.Time{}, errors.New("fecha inválida, formato esperado: YYYY-MM-DD")
	}
	return t, nil
}