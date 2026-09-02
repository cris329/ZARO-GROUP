package products

import (
	"context"
	"errors"

	"github.com/omeblas/omeblas/backend/internal/domain"
	"github.com/omeblas/omeblas/backend/internal/interfaces"
	"github.com/omeblas/omeblas/backend/internal/repositories"
	"github.com/omeblas/omeblas/backend/pkg/utils"
	"github.com/omeblas/omeblas/backend/pkg/validator"
)

type ProductUseCase struct {
	productRepo interfaces.ProductRepository
	syncRepo    interfaces.SyncLogRepository
}

func NewProductUseCase(
	productRepo interfaces.ProductRepository,
	syncRepo interfaces.SyncLogRepository,
) *ProductUseCase {
	return &ProductUseCase{productRepo: productRepo, syncRepo: syncRepo}
}

type CreateProductInput struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Quantity    int     `json:"quantity"`
	Price       float64 `json:"price"`
}

type UpdateProductInput struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Quantity    int     `json:"quantity"`
	Price       float64 `json:"price"`
	Synced      *bool   `json:"synced"`
}

func validateProduct(name, description string, quantity int, price float64) error {
	if !validator.IsValidName(name) {
		return errors.New("nombre de producto inválido (2-100 caracteres)")
	}
	if len(validator.SanitizeInput(description)) > 1000 {
		return errors.New("descripción demasiado larga")
	}
	if !validator.IsValidQuantity(quantity) {
		return errors.New("cantidad inválida")
	}
	if !validator.IsValidPrice(price) {
		return errors.New("precio inválido")
	}
	return nil
}

func (uc *ProductUseCase) Create(ctx context.Context, userID string, input CreateProductInput) (*domain.Product, error) {
	name := validator.SanitizeInput(input.Name)
	description := validator.SanitizeInput(input.Description)

	if err := validateProduct(name, description, input.Quantity, input.Price); err != nil {
		return nil, err
	}

	product := &domain.Product{
		ID:          utils.GenerateID("prd"),
		Name:        name,
		Description: description,
		Quantity:    input.Quantity,
		Price:       input.Price,
		UserID:      userID,
		Synced:      true,
	}

	if err := uc.productRepo.Create(ctx, product); err != nil {
		return nil, err
	}

	return product, nil
}

func (uc *ProductUseCase) GetByID(ctx context.Context, userID, id string) (*domain.Product, error) {
	product, err := uc.productRepo.GetByIDForUser(ctx, userID, id)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return nil, repositories.ErrNotFound
		}
		return nil, err
	}
	return product, nil
}

func (uc *ProductUseCase) Update(ctx context.Context, userID, id string, input UpdateProductInput) (*domain.Product, error) {
	product, err := uc.productRepo.GetByIDForUser(ctx, userID, id)
	if err != nil {
		return nil, err
	}

	name := validator.SanitizeInput(input.Name)
	description := validator.SanitizeInput(input.Description)

	if err := validateProduct(name, description, input.Quantity, input.Price); err != nil {
		return nil, err
	}

	product.Name = name
	product.Description = description
	product.Quantity = input.Quantity
	product.Price = input.Price

	if input.Synced != nil {
		product.Synced = *input.Synced
	}

	if err := uc.productRepo.UpdateForUser(ctx, userID, product); err != nil {
		return nil, err
	}

	return product, nil
}

func (uc *ProductUseCase) Delete(ctx context.Context, userID, id string) error {
	if _, err := uc.productRepo.GetByIDForUser(ctx, userID, id); err != nil {
		return err
	}
	return uc.productRepo.DeleteForUser(ctx, userID, id)
}

func (uc *ProductUseCase) List(ctx context.Context, userID string, filter domain.ProductFilter) (*domain.ProductList, error) {
	if userID != "" {
		filter.UserID = userID
	}
	return uc.productRepo.List(ctx, filter)
}

func (uc *ProductUseCase) ListByUser(ctx context.Context, userID string) ([]domain.Product, error) {
	return uc.productRepo.ListByUser(ctx, userID)
}