package orders

import (
	"context"
	"errors"

	"github.com/zaro-group/backend/internal/domain"
	"github.com/zaro-group/backend/internal/interfaces"
	"github.com/zaro-group/backend/internal/repositories"
	"github.com/zaro-group/backend/pkg/utils"
	"github.com/zaro-group/backend/pkg/validator"
)

type OrderUseCase struct {
	orderRepo interfaces.OrderRepository
}

func NewOrderUseCase(orderRepo interfaces.OrderRepository) *OrderUseCase {
	return &OrderUseCase{orderRepo: orderRepo}
}

type CreateOrderInput struct {
	Products    []OrderItemInput `json:"products"`
	ClientName  string           `json:"client_name"`
	ClientPhone string           `json:"client_phone"`
	Notes       string           `json:"notes"`
}

type OrderItemInput struct {
	ProductID string  `json:"product_id"`
	Name      string  `json:"name"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
}

type UpdateOrderInput struct {
	Products    []OrderItemInput `json:"products"`
	ClientName  string           `json:"client_name"`
	ClientPhone string           `json:"client_phone"`
	Notes       string           `json:"notes"`
	Status      string           `json:"status"`
}

func (uc *OrderUseCase) Create(ctx context.Context, userID string, input CreateOrderInput) (*domain.Order, error) {
	if len(input.Products) == 0 {
		return nil, errors.New("la orden debe tener al menos un producto")
	}

	items := make([]domain.OrderItem, len(input.Products))
	for i, in := range input.Products {
		name := validator.SanitizeInput(in.Name)
		if !validator.IsValidName(name) {
			return nil, errors.New("nombre de producto inválido")
		}
		if !validator.IsValidQuantity(in.Quantity) || in.Quantity <= 0 {
			return nil, errors.New("cantidad inválida")
		}
		if !validator.IsValidPrice(in.Price) {
			return nil, errors.New("precio inválido")
		}
		items[i] = domain.OrderItem{
			ProductID: in.ProductID,
			Name:      name,
			Quantity:  in.Quantity,
			Price:     in.Price,
		}
	}

	order := &domain.Order{
		ID:          utils.GenerateID("ord"),
		UserID:      userID,
		Products:    items,
		Status:      string(domain.OrderPending),
		Synced:      true,
		ClientName:  validator.SanitizeInput(input.ClientName),
		ClientPhone: input.ClientPhone,
		Notes:       validator.SanitizeInput(input.Notes),
	}
	order.CalculateTotal()

	if err := uc.orderRepo.Create(ctx, order); err != nil {
		return nil, err
	}
	return order, nil
}

func (uc *OrderUseCase) GetByID(ctx context.Context, userID, id string) (*domain.Order, error) {
	order, err := uc.orderRepo.GetByIDForUser(ctx, userID, id)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return nil, repositories.ErrNotFound
		}
		return nil, err
	}
	return order, nil
}

func (uc *OrderUseCase) Update(ctx context.Context, userID, id string, input UpdateOrderInput) (*domain.Order, error) {
	order, err := uc.orderRepo.GetByIDForUser(ctx, userID, id)
	if err != nil {
		return nil, err
	}

	if input.Status != "" {
		if !isValidStatus(input.Status) {
			return nil, errors.New("estado de orden inválido")
		}
		order.Status = input.Status
	}

	if len(input.Products) > 0 {
		items := make([]domain.OrderItem, len(input.Products))
		for i, in := range input.Products {
			items[i] = domain.OrderItem{
				ProductID: in.ProductID,
				Name:      validator.SanitizeInput(in.Name),
				Quantity:  in.Quantity,
				Price:     in.Price,
			}
		}
		order.Products = items
		order.CalculateTotal()
	}

	if input.ClientName != "" {
		order.ClientName = validator.SanitizeInput(input.ClientName)
	}
	if input.ClientPhone != "" {
		order.ClientPhone = input.ClientPhone
	}
	if input.Notes != "" {
		order.Notes = validator.SanitizeInput(input.Notes)
	}

	if err := uc.orderRepo.UpdateForUser(ctx, userID, order); err != nil {
		return nil, err
	}
	return order, nil
}

func (uc *OrderUseCase) Delete(ctx context.Context, userID, id string) error {
	if _, err := uc.orderRepo.GetByIDForUser(ctx, userID, id); err != nil {
		return err
	}
	return uc.orderRepo.Delete(ctx, id)
}

func (uc *OrderUseCase) List(ctx context.Context, userID string, page, limit int) ([]domain.Order, int64, error) {
	return uc.orderRepo.List(ctx, userID, page, limit)
}

func isValidStatus(status string) bool {
	switch domain.OrderStatus(status) {
	case domain.OrderPending, domain.OrderConfirmed, domain.OrderShipped, domain.OrderDelivered, domain.OrderCancelled:
		return true
	}
	return false
}