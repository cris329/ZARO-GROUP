package reports

import (
	"bytes"
	"context"
	"fmt"
	"time"

	"github.com/omeblas/omeblas/backend/internal/domain"
	"github.com/omeblas/omeblas/backend/internal/interfaces"
	"github.com/omeblas/omeblas/backend/pkg/logger"
	"github.com/xuri/excelize/v2"
)

type ReportUseCase struct {
	productRepo interfaces.ProductRepository
	orderRepo   interfaces.OrderRepository
}

func NewReportUseCase(
	productRepo interfaces.ProductRepository,
	orderRepo interfaces.OrderRepository,
) *ReportUseCase {
	return &ReportUseCase{productRepo: productRepo, orderRepo: orderRepo}
}

type InventoryReport struct {
	GeneratedAt time.Time         `json:"generated_at"`
	Products    []domain.Product  `json:"products"`
	TotalValue  float64           `json:"total_value"`
	TotalItems  int               `json:"total_items"`
}

type SalesReport struct {
	GeneratedAt time.Time        `json:"generated_at"`
	Orders      []domain.Order   `json:"orders"`
	TotalSales  float64          `json:"total_sales"`
	OrderCount  int              `json:"order_count"`
	StatusCount map[string]int   `json:"status_count"`
}

func (uc *ReportUseCase) Inventory(ctx context.Context, userID string) (*InventoryReport, error) {
	products, err := uc.productRepo.ListByUser(ctx, userID)
	if err != nil {
		return nil, err
	}

	report := &InventoryReport{
		GeneratedAt: time.Now().UTC(),
		Products:    products,
	}

	for _, p := range products {
		report.TotalValue += float64(p.Quantity) * p.Price
		report.TotalItems += p.Quantity
	}

	return report, nil
}

func (uc *ReportUseCase) Sales(ctx context.Context, userID string, from, to time.Time) (*SalesReport, error) {
	orders, total, err := uc.orderRepo.List(ctx, userID, 1, 500)
	if err != nil {
		return nil, err
	}

	report := &SalesReport{
		GeneratedAt: time.Now().UTC(),
		StatusCount: make(map[string]int),
	}

	for _, o := range orders {
		if o.CreatedAt.Before(from) {
			continue
		}
		if !to.IsZero() && o.CreatedAt.After(to.AddDate(0, 0, 1)) {
			continue
		}
		report.Orders = append(report.Orders, o)
		report.TotalSales += o.Total
		report.StatusCount[o.Status]++
	}

	report.OrderCount = int(total)
	return report, nil
}

// ExportInventoryExcel generates an Excel (.xlsx) inventory report
func (uc *ReportUseCase) ExportInventoryExcel(ctx context.Context, userID string) ([]byte, string, error) {
	report, err := uc.Inventory(ctx, userID)
	if err != nil {
		return nil, "", err
	}

	f := excelize.NewFile()
	defer func() {
		if err := f.Close(); err != nil {
			logger.Error("Error cerrando excel:", err)
		}
	}()

	sheet := "Inventario"
	index, err := f.NewSheet(sheet)
	if err != nil {
		return nil, "", err
	}
	f.SetActiveSheet(index)

	headers := []string{"ID", "Nombre", "Descripción", "Cantidad", "Precio", "Valor Total"}
	for i, h := range headers {
		cell := fmt.Sprintf("%s1", excelize.GetColumnLetter(i+1))
		f.SetCellValue(sheet, cell, h)
	}

	style, _ := f.NewStyle(&excelize.Style{Font: &excelize.Font{Bold: true}})
	f.SetCellStyle(sheet, "A1", "F1", style)

	for i, p := range report.Products {
		row := i + 2
		f.SetCellValue(sheet, fmt.Sprintf("A%d", row), p.ID)
		f.SetCellValue(sheet, fmt.Sprintf("B%d", row), p.Name)
		f.SetCellValue(sheet, fmt.Sprintf("C%d", row), p.Description)
		f.SetCellValue(sheet, fmt.Sprintf("D%d", row), p.Quantity)
		f.SetCellValue(sheet, fmt.Sprintf("E%d", row), p.Price)
		f.SetCellValue(sheet, fmt.Sprintf("F%d", row), float64(p.Quantity)*p.Price)
	}

	summaryRow := len(report.Products) + 3
	f.SetCellValue(sheet, fmt.Sprintf("E%d", summaryRow), "VALOR TOTAL INVENTARIO:")
	f.SetCellValue(sheet, fmt.Sprintf("F%d", summaryRow), report.TotalValue)

	var buf bytes.Buffer
	if err := f.Write(&buf); err != nil {
		return nil, "", err
	}

	filename := "inventario_" + time.Now().Format("20060102") + ".xlsx"
	return buf.Bytes(), filename, nil
}

func (uc *ReportUseCase) ExportSalesExcel(ctx context.Context, userID string, from, to time.Time) ([]byte, string, error) {
	report, err := uc.Sales(ctx, userID, from, to)
	if err != nil {
		return nil, "", err
	}

	f := excelize.NewFile()
	defer f.Close()

	sheet := "Ventas"
	index, _ := f.NewSheet(sheet)
	f.SetActiveSheet(index)

	headers := []string{"ID", "Cliente", "Teléfono", "Fecha", "Estado", "Total"}
	for i, h := range headers {
		cell := fmt.Sprintf("%s1", excelize.GetColumnLetter(i+1))
		f.SetCellValue(sheet, cell, h)
	}

	style, _ := f.NewStyle(&excelize.Style{Font: &excelize.Font{Bold: true}})
	f.SetCellStyle(sheet, "A1", "F1", style)

	for i, o := range report.Orders {
		row := i + 2
		f.SetCellValue(sheet, fmt.Sprintf("A%d", row), o.ID)
		f.SetCellValue(sheet, fmt.Sprintf("B%d", row), o.ClientName)
		f.SetCellValue(sheet, fmt.Sprintf("C%d", row), o.ClientPhone)
		f.SetCellValue(sheet, fmt.Sprintf("D%d", row), o.CreatedAt.Format("2006-01-02"))
		f.SetCellValue(sheet, fmt.Sprintf("E%d", row), o.Status)
		f.SetCellValue(sheet, fmt.Sprintf("F%d", row), o.Total)
	}

	summaryRow := len(report.Orders) + 3
	f.SetCellValue(sheet, fmt.Sprintf("E%d", summaryRow), "TOTAL VENTAS:")
	f.SetCellValue(sheet, fmt.Sprintf("F%d", summaryRow), report.TotalSales)

	var buf bytes.Buffer
	if err := f.Write(&buf); err != nil {
		return nil, "", err
	}

	filename := "ventas_" + time.Now().Format("20060102") + ".xlsx"
	return buf.Bytes(), filename, nil
}