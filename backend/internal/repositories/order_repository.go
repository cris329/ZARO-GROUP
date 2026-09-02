package repositories

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"

	"github.com/zaro-group/backend/internal/domain"
)

type OrderRepository struct {
	db *sql.DB
}

func NewOrderRepository(db *sql.DB) *OrderRepository {
	return &OrderRepository{db: db}
}

const orderColumns = "id, user_id, products, total, status, synced, client_name, client_phone, notes, created_at, updated_at, deleted_at"

func scanOrder(row interface{ Scan(...interface{}) error }) (*domain.Order, error) {
	o := &domain.Order{}
	var productsJSON []byte
	err := row.Scan(
		&o.ID, &o.UserID, &productsJSON, &o.Total, &o.Status, &o.Synced,
		&o.ClientName, &o.ClientPhone, &o.Notes,
		&o.CreatedAt, &o.UpdatedAt, &o.DeletedAt,
	)
	if err == sql.ErrNoRows {
		return nil, ErrNotFound
	}
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(productsJSON, &o.Products); err != nil {
		return nil, err
	}
	return o, nil
}

func (r *OrderRepository) Create(ctx context.Context, order *domain.Order) error {
	query := `
		INSERT INTO orders (id, user_id, products, total, status, synced, client_name, client_phone, notes, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	now := time.Now().UTC()
	order.CreatedAt = now
	order.UpdatedAt = now

	if order.Status == "" {
		order.Status = string(domain.OrderPending)
	}

	productsJSON, err := json.Marshal(order.Products)
	if err != nil {
		return err
	}

	_, err = r.db.ExecContext(ctx, query,
		order.ID, order.UserID, productsJSON, order.Total, order.Status, order.Synced,
		order.ClientName, order.ClientPhone, order.Notes,
		order.CreatedAt, order.UpdatedAt,
	)
	return err
}

func (r *OrderRepository) GetByID(ctx context.Context, id string) (*domain.Order, error) {
	query := `
		SELECT id, user_id, products, total, status, synced, client_name, client_phone, notes, created_at, updated_at, deleted_at
		FROM orders
		WHERE id = ? AND deleted_at IS NULL
	`
	return scanOrder(r.db.QueryRowContext(ctx, query, id))
}

func (r *OrderRepository) GetByIDForUser(ctx context.Context, userID, id string) (*domain.Order, error) {
	query := `
		SELECT id, user_id, products, total, status, synced, client_name, client_phone, notes, created_at, updated_at, deleted_at
		FROM orders
		WHERE id = ? AND user_id = ? AND deleted_at IS NULL
	`
	return scanOrder(r.db.QueryRowContext(ctx, query, id, userID))
}

func (r *OrderRepository) Update(ctx context.Context, order *domain.Order) error {
	query := `
		UPDATE orders
		SET products = ?, total = ?, status = ?, synced = ?,
			client_name = ?, client_phone = ?, notes = ?, updated_at = ?
		WHERE id = ? AND deleted_at IS NULL
	`
	order.UpdatedAt = time.Now().UTC()

	productsJSON, err := json.Marshal(order.Products)
	if err != nil {
		return err
	}

	_, err = r.db.ExecContext(ctx, query,
		productsJSON, order.Total, order.Status, order.Synced,
		order.ClientName, order.ClientPhone, order.Notes,
		order.UpdatedAt, order.ID,
	)
	return err
}

func (r *OrderRepository) UpdateForUser(ctx context.Context, userID string, order *domain.Order) error {
	query := `
		UPDATE orders
		SET products = ?, total = ?, status = ?, synced = ?,
			client_name = ?, client_phone = ?, notes = ?, updated_at = ?
		WHERE id = ? AND user_id = ? AND deleted_at IS NULL
	`
	order.UpdatedAt = time.Now().UTC()

	productsJSON, err := json.Marshal(order.Products)
	if err != nil {
		return err
	}

	_, err = r.db.ExecContext(ctx, query,
		productsJSON, order.Total, order.Status, order.Synced,
		order.ClientName, order.ClientPhone, order.Notes,
		order.UpdatedAt, order.ID, userID,
	)
	return err
}

func (r *OrderRepository) Delete(ctx context.Context, id string) error {
	query := `UPDATE orders SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL`
	now := time.Now().UTC()
	_, err := r.db.ExecContext(ctx, query, now, now, id)
	return err
}

func (r *OrderRepository) List(ctx context.Context, userID string, page, limit int) ([]domain.Order, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	offset := (page - 1) * limit

	var total int64
	var countErr error
	where := ""
	args := []interface{}{}

	if userID != "" {
		where = "WHERE user_id = ? AND deleted_at IS NULL"
		args = append(args, userID)
		countErr = r.db.QueryRowContext(ctx,
			"SELECT COUNT(*) FROM orders "+where, args...).Scan(&total)
	} else {
		where = "WHERE deleted_at IS NULL"
		countErr = r.db.QueryRowContext(ctx,
			"SELECT COUNT(*) FROM orders "+where).Scan(&total)
	}
	if countErr != nil {
		return nil, 0, countErr
	}

	query := `
		SELECT id, user_id, products, total, status, synced, client_name, client_phone, notes, created_at, updated_at, deleted_at
		FROM orders
		` + where + `
		ORDER BY created_at DESC
		LIMIT ? OFFSET ?
	`

	listArgs := append(args, limit, offset)
	rows, err := r.db.QueryContext(ctx, query, listArgs...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var orders []domain.Order
	for rows.Next() {
		o, err := scanOrder(rows)
		if err != nil {
			return nil, 0, err
		}
		orders = append(orders, *o)
	}

	return orders, total, rows.Err()
}