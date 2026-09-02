package repositories

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/zaro-group/backend/internal/domain"
)

type ProductRepository struct {
	db *sql.DB
}

func NewProductRepository(db *sql.DB) *ProductRepository {
	return &ProductRepository{db: db}
}

const productColumns = "id, name, description, quantity, price, user_id, synced, created_at, updated_at, deleted_at, version"

func scanProduct(row interface{ Scan(...interface{}) error }) (*domain.Product, error) {
	p := &domain.Product{}
	err := row.Scan(
		&p.ID, &p.Name, &p.Description, &p.Quantity, &p.Price,
		&p.UserID, &p.Synced, &p.CreatedAt, &p.UpdatedAt, &p.DeletedAt, &p.Version,
	)
	if err == sql.ErrNoRows {
		return nil, ErrNotFound
	}
	if err != nil {
		return nil, err
	}
	return p, nil
}

func (r *ProductRepository) Create(ctx context.Context, product *domain.Product) error {
	query := `
		INSERT INTO products (id, name, description, quantity, price, user_id, synced, created_at, updated_at, version)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
	`

	now := time.Now().UTC()
	product.CreatedAt = now
	product.UpdatedAt = now
	product.Version = 1

	_, err := r.db.ExecContext(ctx, query,
		product.ID, product.Name, product.Description,
		product.Quantity, product.Price, product.UserID,
		product.Synced, product.CreatedAt, product.UpdatedAt,
	)
	return err
}

func (r *ProductRepository) GetByID(ctx context.Context, id string) (*domain.Product, error) {
	query := fmt.Sprintf("SELECT %s FROM products WHERE id = ? AND deleted_at IS NULL", productColumns)
	return scanProduct(r.db.QueryRowContext(ctx, query, id))
}

func (r *ProductRepository) GetByIDForUser(ctx context.Context, userID, id string) (*domain.Product, error) {
	query := fmt.Sprintf("SELECT %s FROM products WHERE id = ? AND user_id = ? AND deleted_at IS NULL", productColumns)
	return scanProduct(r.db.QueryRowContext(ctx, query, id, userID))
}

func (r *ProductRepository) Update(ctx context.Context, product *domain.Product) error {
	query := `
		UPDATE products
		SET name = ?, description = ?, quantity = ?, price = ?,
			synced = ?, updated_at = ?, version = version + 1
		WHERE id = ? AND deleted_at IS NULL
	`

	product.UpdatedAt = time.Now().UTC()
	_, err := r.db.ExecContext(ctx, query,
		product.Name, product.Description, product.Quantity, product.Price,
		product.Synced, product.UpdatedAt, product.ID,
	)
	return err
}

func (r *ProductRepository) UpdateForUser(ctx context.Context, userID string, product *domain.Product) error {
	query := `
		UPDATE products
		SET name = ?, description = ?, quantity = ?, price = ?,
			synced = ?, updated_at = ?, version = version + 1
		WHERE id = ? AND user_id = ? AND deleted_at IS NULL
	`

	product.UpdatedAt = time.Now().UTC()
	_, err := r.db.ExecContext(ctx, query,
		product.Name, product.Description, product.Quantity, product.Price,
		product.Synced, product.UpdatedAt, product.ID, userID,
	)
	return err
}

func (r *ProductRepository) Delete(ctx context.Context, id string) error {
	query := `UPDATE products SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL`
	now := time.Now().UTC()
	_, err := r.db.ExecContext(ctx, query, now, now, id)
	return err
}

func (r *ProductRepository) DeleteForUser(ctx context.Context, userID, id string) error {
	query := `UPDATE products SET deleted_at = ?, updated_at = ? WHERE id = ? AND user_id = ? AND deleted_at IS NULL`
	now := time.Now().UTC()
	_, err := r.db.ExecContext(ctx, query, now, now, id, userID)
	return err
}

func (r *ProductRepository) List(ctx context.Context, filter domain.ProductFilter) (*domain.ProductList, error) {
	if filter.Page < 1 {
		filter.Page = 1
	}
	if filter.Limit < 1 {
		filter.Limit = 10
	}
	if filter.Limit > 100 {
		filter.Limit = 100
	}

	where := []string{"deleted_at IS NULL"}
	args := []interface{}{}

	if filter.UserID != "" {
		where = append(where, "user_id = ?")
		args = append(args, filter.UserID)
	}

	if filter.Search != "" {
		where = append(where, "(name LIKE ? OR description LIKE ?)")
		search := "%" + filter.Search + "%"
		args = append(args, search, search)
	}

	whereClause := strings.Join(where, " AND ")

	var total int64
	err := r.db.QueryRowContext(ctx,
		fmt.Sprintf("SELECT COUNT(*) FROM products WHERE %s", whereClause),
		args...,
	).Scan(&total)
	if err != nil {
		return nil, err
	}

	sortBy := "created_at"
	sortDir := "DESC"
	if filter.SortBy != "" {
		switch filter.SortBy {
		case "name", "price", "quantity", "updated_at":
			sortBy = filter.SortBy
		}
	}
	if filter.SortDir == "asc" || filter.SortDir == "ASC" {
		sortDir = "ASC"
	}

	offset := (filter.Page - 1) * filter.Limit
	query := fmt.Sprintf(
		"SELECT %s FROM products WHERE %s ORDER BY %s %s LIMIT ? OFFSET ?",
		productColumns, whereClause, sortBy, sortDir,
	)

	listArgs := append(args, filter.Limit, offset)
	rows, err := r.db.QueryContext(ctx, query, listArgs...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	products := []domain.Product{}
	for rows.Next() {
		p, err := scanProduct(rows)
		if err != nil {
			return nil, err
		}
		products = append(products, *p)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	totalPages := 0
	if total > 0 {
		totalPages = int((total + int64(filter.Limit) - 1) / int64(filter.Limit))
	}

	return &domain.ProductList{
		Products:   products,
		Total:      total,
		Page:       filter.Page,
		Limit:      filter.Limit,
		TotalPages: totalPages,
	}, nil
}

func (r *ProductRepository) ListByUser(ctx context.Context, userID string) ([]domain.Product, error) {
	query := fmt.Sprintf(
		"SELECT %s FROM products WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC",
		productColumns,
	)

	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	products := []domain.Product{}
	for rows.Next() {
		p, err := scanProduct(rows)
		if err != nil {
			return nil, err
		}
		products = append(products, *p)
	}
	return products, rows.Err()
}