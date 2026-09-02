package domain

import "testing"

func TestOrderCalculateTotal(t *testing.T) {
	order := &Order{
		Products: []OrderItem{
			{Name: "Tomate", Quantity: 10, Price: 2.5},
			{Name: "Papa", Quantity: 5, Price: 1.0},
		},
	}
	order.CalculateTotal()

	if order.Total != 30.0 {
		t.Errorf("Total = %v, want 30.0", order.Total)
	}

	if order.Products[0].Subtotal != 25.0 {
		t.Errorf("Subtotal[0] = %v, want 25.0", order.Products[0].Subtotal)
	}
}

func TestUserIsValidRole(t *testing.T) {
	admin := User{Role: string(RoleAdmin)}
	farmer := User{Role: string(RoleFarmer)}
	invalid := User{Role: "hacker"}

	if !admin.IsValidRole() {
		t.Error("admin debería ser rol válido")
	}
	if !farmer.IsValidRole() {
		t.Error("farmer debería ser rol válido")
	}
	if invalid.IsValidRole() {
		t.Error("rol inválido aceptado")
	}
}

func TestUserSanitize(t *testing.T) {
	u := User{
		ID:           "usr_1",
		Name:         "Juan",
		Email:        "juan@example.com",
		PasswordHash: "hash_secreto",
		Role:         "farmer",
	}

	s := u.Sanitize()
	if s.PasswordHash != "" {
		t.Error("Sanitize no removió el hash de contraseña")
	}
	if s.ID != "usr_1" {
		t.Error("Sanitize perdió el ID")
	}
}