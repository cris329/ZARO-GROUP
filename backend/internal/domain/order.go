package domain

import "time"

type OrderStatus string

const (
	OrderPending   OrderStatus = "pending"
	OrderConfirmed OrderStatus = "confirmed"
	OrderShipped   OrderStatus = "shipped"
	OrderDelivered OrderStatus = "delivered"
	OrderCancelled OrderStatus = "cancelled"
)

type Order struct {
	ID           string    `json:"id"`
	UserID       string    `json:"user_id"`
	Products     []OrderItem `json:"products"`
	Total        float64   `json:"total"`
	Status       string    `json:"status"`
	Synced       bool      `json:"synced"`
	ClientName   string    `json:"client_name"`
	ClientPhone  string    `json:"client_phone"`
	Notes        string    `json:"notes"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	DeletedAt    *time.Time `json:"deleted_at,omitempty"`
}

type OrderItem struct {
	ProductID string  `json:"product_id"`
	Name      string  `json:"name"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
	Subtotal  float64 `json:"subtotal"`
}

func (o *Order) CalculateTotal() {
	var total float64
	for i := range o.Products {
		p := &o.Products[i]
		p.Subtotal = float64(p.Quantity) * p.Price
		total += p.Subtotal
	}
	o.Total = total
}
