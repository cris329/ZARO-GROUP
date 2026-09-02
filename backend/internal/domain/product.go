package domain

import (
	"time"
)

type Product struct {
	ID          string     `json:"id"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	Quantity    int        `json:"quantity"`
	Price       float64    `json:"price"`
	UserID      string     `json:"user_id"`
	Synced      bool       `json:"synced"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	DeletedAt   *time.Time `json:"deleted_at,omitempty"`
	Version     int        `json:"version"`
}

type ProductFilter struct {
	Search  string
	UserID  string
	Page    int
	Limit   int
	SortBy  string
	SortDir string
}

type ProductList struct {
	Products   []Product `json:"products"`
	Total      int64     `json:"total"`
	Page       int       `json:"page"`
	Limit      int       `json:"limit"`
	TotalPages int       `json:"total_pages"`
}
