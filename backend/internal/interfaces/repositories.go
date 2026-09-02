package interfaces

import (
	"context"

	"github.com/omeblas/omeblas/backend/internal/domain"
)

type UserRepository interface {
	Create(ctx context.Context, user *domain.User) error
	GetByID(ctx context.Context, id string) (*domain.User, error)
	GetByEmail(ctx context.Context, email string) (*domain.User, error)
	Update(ctx context.Context, user *domain.User) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, page, limit int) ([]domain.User, int64, error)
}

type ProductRepository interface {
	Create(ctx context.Context, product *domain.Product) error
	GetByID(ctx context.Context, id string) (*domain.Product, error)
	Update(ctx context.Context, product *domain.Product) error
	Delete(ctx context.Context, id string) error
	DeleteForUser(ctx context.Context, userID, id string) error
	List(ctx context.Context, filter domain.ProductFilter) (*domain.ProductList, error)
	ListByUser(ctx context.Context, userID string) ([]domain.Product, error)
	GetByIDForUser(ctx context.Context, userID, id string) (*domain.Product, error)
	UpdateForUser(ctx context.Context, userID string, product *domain.Product) error
}

type OrderRepository interface {
	Create(ctx context.Context, order *domain.Order) error
	GetByID(ctx context.Context, id string) (*domain.Order, error)
	Update(ctx context.Context, order *domain.Order) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, userID string, page, limit int) ([]domain.Order, int64, error)
	GetByIDForUser(ctx context.Context, userID, id string) (*domain.Order, error)
	UpdateForUser(ctx context.Context, userID string, order *domain.Order) error
}

type SyncLogRepository interface {
	Create(ctx context.Context, log *domain.SyncLog) error
	CreateMany(ctx context.Context, logs []domain.SyncLog) error
	GetByID(ctx context.Context, id string) (*domain.SyncLog, error)
	ListPendingByUser(ctx context.Context, userID string, limit int) ([]domain.SyncLog, error)
	UpdateStatus(ctx context.Context, id string, status string) error
	Update(ctx context.Context, log *domain.SyncLog) error
	IncrementAttempts(ctx context.Context, id string) error
	GetByEntity(ctx context.Context, userID, entityType, entityID string) (*domain.SyncLog, error)
	DeleteByID(ctx context.Context, id string) error
	CountPending(ctx context.Context, userID string) (int64, error)
}
